export interface AchievementCertificateInput {
  recipient: string;
  achievement: string;
  description: string;
  achievedAt?: string;
  university: string;
  course: string;
  color: string;
}

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function fitText(context: CanvasRenderingContext2D, text: string, maxWidth: number, initialSize: number, weight = 800) {
  let size = initialSize;
  do {
    context.font = `${weight} ${size}px Arial, sans-serif`;
    if (context.measureText(text).width <= maxWidth) return;
    size -= 2;
  } while (size > 28);
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (current && context.measureText(next).width > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });
  if (current) lines.push(current);
  return lines;
}

export function createAchievementCertificateCanvas(input: AchievementCertificateInput) {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 1130;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Seu navegador não conseguiu gerar o certificado.");

  context.fillStyle = "#eafbdc";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#58cc02";
  context.beginPath();
  context.arc(1450, 80, 260, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#b8ef91";
  context.beginPath();
  context.arc(100, 1060, 250, 0, Math.PI * 2);
  context.fill();

  context.shadowColor = "rgba(35, 75, 20, .16)";
  context.shadowBlur = 28;
  context.shadowOffsetY = 14;
  roundedRect(context, 90, 80, 1420, 950, 44);
  context.fillStyle = "#ffffff";
  context.fill();
  context.shadowColor = "transparent";
  context.lineWidth = 5;
  context.strokeStyle = "#d9e4d2";
  context.stroke();

  context.fillStyle = "#58cc02";
  context.font = "900 56px Arial, sans-serif";
  context.textAlign = "left";
  context.fillText("U-GO", 160, 175);
  context.fillStyle = "#667066";
  context.font = "800 24px Arial, sans-serif";
  context.letterSpacing = "5px";
  context.fillText("CERTIFICADO DE CONQUISTA", 160, 225);
  context.letterSpacing = "0px";

  context.fillStyle = input.color || "#58cc02";
  context.beginPath();
  context.arc(1290, 220, 92, 0, Math.PI * 2);
  context.fill();
  context.lineWidth = 12;
  context.strokeStyle = "#ffffff";
  context.stroke();
  context.fillStyle = "#ffffff";
  context.font = "900 62px Arial, sans-serif";
  context.textAlign = "center";
  context.fillText("✓", 1290, 242);

  context.textAlign = "left";
  context.fillStyle = "#7a8478";
  context.font = "700 28px Arial, sans-serif";
  context.fillText("Este certificado reconhece", 160, 365);
  context.fillStyle = "#202820";
  fitText(context, input.recipient, 1180, 76, 900);
  context.fillText(input.recipient, 160, 450);

  context.fillStyle = "#7a8478";
  context.font = "700 28px Arial, sans-serif";
  context.fillText("pela conquista", 160, 525);
  context.fillStyle = input.color || "#43a900";
  fitText(context, input.achievement, 1180, 64, 900);
  context.fillText(input.achievement, 160, 600);

  context.fillStyle = "#465046";
  context.font = "500 28px Arial, sans-serif";
  wrapText(context, input.description, 1190).slice(0, 2).forEach((line, index) => context.fillText(line, 160, 665 + index * 38));

  context.fillStyle = "#f3f8ef";
  roundedRect(context, 145, 785, 1310, 145, 24);
  context.fill();
  context.fillStyle = "#384238";
  context.font = "800 24px Arial, sans-serif";
  context.fillText(input.course, 185, 840);
  context.fillStyle = "#6c766b";
  context.font = "600 22px Arial, sans-serif";
  context.fillText(input.university, 185, 880);
  const date = input.achievedAt ? new Intl.DateTimeFormat("pt-BR").format(new Date(input.achievedAt)) : "Data registrada na plataforma";
  context.textAlign = "right";
  context.fillText(`Conquistado em ${date}`, 1415, 880);

  context.textAlign = "center";
  context.fillStyle = "#8a9388";
  context.font = "600 18px Arial, sans-serif";
  context.fillText("Emitido com base nas conquistas registradas no perfil U-Go.", 800, 985);

  return canvas;
}

function safeCertificateName(achievement: string) {
  return achievement.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/(^-|-$)/g, "").toLowerCase() || "conquista";
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Não foi possível preparar o arquivo do certificado.")), type, quality);
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function createPdfWithJpeg(jpeg: Uint8Array, imageWidth: number, imageHeight: number) {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets = new Array<number>(6).fill(0);
  let length = 0;
  const append = (value: string | Uint8Array) => {
    const chunk = typeof value === "string" ? encoder.encode(value) : value;
    chunks.push(chunk);
    length += chunk.byteLength;
  };
  const object = (id: number, body: string) => {
    offsets[id] = length;
    append(`${id} 0 obj\n${body}\nendobj\n`);
  };

  const pageWidth = 841.89;
  const pageHeight = 595.28;
  append("%PDF-1.4\n% U-Go certificate\n");
  object(1, "<< /Type /Catalog /Pages 2 0 R >>");
  object(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  object(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Certificate 5 0 R >> >> /Contents 4 0 R >>`);
  const drawing = `q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Certificate Do\nQ\n`;
  object(4, `<< /Length ${encoder.encode(drawing).byteLength} >>\nstream\n${drawing}endstream`);
  offsets[5] = length;
  append(`5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.byteLength} >>\nstream\n`);
  append(jpeg);
  append("\nendstream\nendobj\n");

  const xrefOffset = length;
  append("xref\n0 6\n0000000000 65535 f \n");
  for (let id = 1; id <= 5; id += 1) append(`${String(offsets[id]).padStart(10, "0")} 00000 n \n`);
  append(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
  return new Blob(chunks, { type: "application/pdf" });
}

export async function downloadAchievementCertificateImage(input: AchievementCertificateInput) {
  const canvas = createAchievementCertificateCanvas(input);
  const blob = await canvasToBlob(canvas, "image/png");
  downloadBlob(blob, `certificado-u-go-${safeCertificateName(input.achievement)}.png`);
}

export async function downloadAchievementCertificatePdf(input: AchievementCertificateInput) {
  const pdf = await createAchievementCertificatePdfBlob(input);
  downloadBlob(pdf, `certificado-u-go-${safeCertificateName(input.achievement)}.pdf`);
}

export async function createAchievementCertificatePdfBlob(input: AchievementCertificateInput) {
  const canvas = createAchievementCertificateCanvas(input);
  const jpeg = await canvasToBlob(canvas, "image/jpeg", .96);
  return createPdfWithJpeg(new Uint8Array(await jpeg.arrayBuffer()), canvas.width, canvas.height);
}

export async function copyAchievementCertificateImage(input: AchievementCertificateInput) {
  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
    throw new Error("Seu navegador não permite copiar imagens diretamente. Use ‘Baixar imagem’.");
  }
  const canvas = createAchievementCertificateCanvas(input);
  const blob = await canvasToBlob(canvas, "image/png");
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}
