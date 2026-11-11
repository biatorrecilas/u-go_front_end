export type AvatarSkin = "fair" | "light" | "warm" | "tan" | "brown" | "deep";
export type AvatarHairPreset = "black" | "dark_brown" | "brown" | "light_brown" | "blonde" | "red" | "gray" | "white";
export type AvatarHairColor = AvatarHairPreset | `#${string}`;
export type AvatarHairStyle = "straight" | "wavy" | "curly" | "coily" | "afro" | "braids" | "locs" | "bun" | "buzz" | "bald";
export type AvatarHairLength = "short" | "medium" | "long";
export type AvatarOutfitType = "hoodie" | "jacket" | "tee" | "sweater" | "polo" | "varsity" | "overalls" | "jersey" | "turtleneck";
export type AvatarOutfitPreset = "green" | "blue" | "coral" | "purple" | "yellow" | "charcoal";
export type AvatarOutfitColor = AvatarOutfitPreset | `#${string}`;
export type AvatarHeadwear = "none" | "cap" | "beanie" | "headscarf";
export type AvatarEyewear = "none" | "round_glasses" | "square_glasses" | "sunglasses";
export type AvatarEarAccessory = "none" | "headphones" | "earrings" | "hearing_aid";
export type AvatarOutfitAccessory = "none" | "leaf_pin" | "animal_pin" | "course_pin";
export type AvatarAnimalPin = "cat" | "dog" | "bird" | "rabbit" | "fish" | "turtle";
export type AvatarPinColor = `#${string}`;
export type AvatarExpression = "happy" | "calm" | "bored" | "wink";
export type AvatarFacialHair = "none" | "stubble" | "mustache" | "goatee" | "short_beard" | "beard";

export interface AvatarConfig {
  enabled: boolean;
  skin: AvatarSkin;
  hairColor: AvatarHairColor;
  hairStyle: AvatarHairStyle;
  hairLength: AvatarHairLength;
  facialHair: AvatarFacialHair;
  facialHairColor: AvatarHairColor;
  outfitType: AvatarOutfitType;
  outfitColor: AvatarOutfitColor;
  headwear: AvatarHeadwear;
  eyewear: AvatarEyewear;
  earAccessory: AvatarEarAccessory;
  outfitAccessory: AvatarOutfitAccessory;
  animalPin: AvatarAnimalPin;
  coursePin: string;
  pinColor: AvatarPinColor;
  expression: AvatarExpression;
}

export const defaultAvatarConfig: AvatarConfig = {
  enabled: false,
  skin: "warm",
  hairColor: "black",
  hairStyle: "straight",
  hairLength: "short",
  facialHair: "none",
  facialHairColor: "black",
  outfitType: "hoodie",
  outfitColor: "green",
  headwear: "none",
  eyewear: "none",
  earAccessory: "none",
  outfitAccessory: "none",
  animalPin: "cat",
  coursePin: "Curso",
  pinColor: "#1cb0f6",
  expression: "happy",
};

export const avatarChoices = {
  skin: [
    { value: "fair", label: "Muito claro", color: "#f8e1d2" },
    { value: "light", label: "Claro", color: "#f6d2b8" },
    { value: "warm", label: "Médio", color: "#d99b6c" },
    { value: "tan", label: "Bronzeado", color: "#ba7952" },
    { value: "brown", label: "Moreno", color: "#9a5f3f" },
    { value: "deep", label: "Escuro", color: "#633b2a" },
  ],
  hairColor: [
    { value: "black", label: "Preto", color: "#27201d" },
    { value: "dark_brown", label: "Castanho escuro", color: "#443027" },
    { value: "brown", label: "Castanho", color: "#654331" },
    { value: "light_brown", label: "Castanho claro", color: "#94684a" },
    { value: "blonde", label: "Loiro", color: "#d6a84e" },
    { value: "red", label: "Ruivo", color: "#9f452d" },
    { value: "gray", label: "Grisalho", color: "#8b929d" },
    { value: "white", label: "Branco", color: "#e5e7eb" },
  ],
  hairStyle: [
    { value: "straight", label: "Liso" },
    { value: "wavy", label: "Ondulado" },
    { value: "curly", label: "Cacheado" },
    { value: "coily", label: "Crespo" },
    { value: "afro", label: "Afro" },
    { value: "braids", label: "Tranças" },
    { value: "locs", label: "Locs" },
    { value: "bun", label: "Coque" },
    { value: "buzz", label: "Raspado" },
    { value: "bald", label: "Sem cabelo" },
  ],
  hairLength: [
    { value: "short", label: "Curto" },
    { value: "medium", label: "Médio" },
    { value: "long", label: "Longo" },
  ],
  facialHair: [
    { value: "none", label: "Sem barba" },
    { value: "stubble", label: "Barba curta" },
    { value: "mustache", label: "Bigode" },
    { value: "goatee", label: "Cavanhaque" },
    { value: "short_beard", label: "Barba aparada" },
    { value: "beard", label: "Barba cheia" },
  ],
  outfitType: [
    { value: "hoodie", label: "Moletom" },
    { value: "jacket", label: "Jaqueta" },
    { value: "tee", label: "Camiseta" },
    { value: "sweater", label: "Suéter" },
    { value: "polo", label: "Polo" },
    { value: "varsity", label: "Universitária" },
    { value: "overalls", label: "Jardineira" },
    { value: "jersey", label: "Esportiva" },
    { value: "turtleneck", label: "Gola alta" },
  ],
  outfitColor: [
    { value: "green", label: "Verde", color: "#58cc02" },
    { value: "blue", label: "Azul", color: "#1cb0f6" },
    { value: "coral", label: "Coral", color: "#ff6b6b" },
    { value: "purple", label: "Roxo", color: "#a560e8" },
    { value: "yellow", label: "Amarelo", color: "#ffc800" },
    { value: "charcoal", label: "Grafite", color: "#4b5563" },
  ],
  headwear: [
    { value: "none", label: "Nada na cabeça" },
    { value: "cap", label: "Boné" },
    { value: "beanie", label: "Gorro" },
    { value: "headscarf", label: "Lenço" },
  ],
  eyewear: [
    { value: "none", label: "Sem óculos" },
    { value: "round_glasses", label: "Óculos redondos" },
    { value: "square_glasses", label: "Óculos quadrados" },
    { value: "sunglasses", label: "Óculos escuros" },
  ],
  earAccessory: [
    { value: "none", label: "Nada nas orelhas" },
    { value: "headphones", label: "Fones" },
    { value: "earrings", label: "Brincos" },
    { value: "hearing_aid", label: "Aparelho auditivo" },
  ],
  outfitAccessory: [
    { value: "none", label: "Sem broche" },
    { value: "leaf_pin", label: "Broche ECO" },
    { value: "animal_pin", label: "Broche de Pet" },
    { value: "course_pin", label: "Broche Universitário" },
  ],
  animalPin: [
    { value: "cat", label: "Gato" },
    { value: "dog", label: "Cachorro" },
    { value: "bird", label: "Pássaro" },
    { value: "rabbit", label: "Coelho" },
    { value: "fish", label: "Peixe" },
    { value: "turtle", label: "Tartaruga" },
  ],
  pinColor: [
    { value: "#58cc02", label: "Verde", color: "#58cc02" },
    { value: "#1cb0f6", label: "Azul", color: "#1cb0f6" },
    { value: "#ff6b6b", label: "Coral", color: "#ff6b6b" },
    { value: "#a560e8", label: "Roxo", color: "#a560e8" },
    { value: "#ffc800", label: "Amarelo", color: "#ffc800" },
    { value: "#4b5563", label: "Grafite", color: "#4b5563" },
  ],
  expression: [
    { value: "happy", label: "Sorridente" },
    { value: "calm", label: "Tranquilo" },
    { value: "bored", label: "Entediado" },
    { value: "wink", label: "Piscando" },
  ],
} as const;

type LegacyAvatarConfig = Partial<AvatarConfig> & { hair?: string; outfit?: string; accessory?: string };

export function normalizeAvatarConfig(value?: LegacyAvatarConfig | null): AvatarConfig {
  const input = value ?? {};
  const normalized = { ...defaultAvatarConfig, ...input } as AvatarConfig;
  if (input.hair) {
    const legacyHair = {
      short: ["straight", "short"], medium: ["straight", "medium"], long: ["straight", "long"],
      curly: ["curly", "medium"], waves: ["wavy", "medium"], bun: ["bun", "long"],
    }[input.hair] as [AvatarHairStyle, AvatarHairLength] | undefined;
    if (legacyHair) {
      normalized.hairStyle = input.hairStyle ?? legacyHair[0];
      normalized.hairLength = input.hairLength ?? legacyHair[1];
    }
  }
  if (input.outfit) {
    const legacyOutfit = {
      green_hoodie: ["hoodie", "green"], blue_jacket: ["jacket", "blue"],
      coral_tee: ["tee", "coral"], purple_sweater: ["sweater", "purple"],
    }[input.outfit] as [AvatarOutfitType, AvatarOutfitColor] | undefined;
    if (legacyOutfit) {
      normalized.outfitType = input.outfitType ?? legacyOutfit[0];
      normalized.outfitColor = input.outfitColor ?? legacyOutfit[1];
    }
  }
  if (input.accessory) {
    if (input.accessory === "cap" && !input.headwear) normalized.headwear = "cap";
    if (input.accessory === "glasses" && !input.eyewear) normalized.eyewear = "square_glasses";
    if (input.accessory === "headphones" && !input.earAccessory) normalized.earAccessory = "headphones";
    if (input.accessory === "leaf_pin" && !input.outfitAccessory) normalized.outfitAccessory = "leaf_pin";
  }
  if ((input.outfitAccessory as string) === "campus_pin") normalized.outfitAccessory = "animal_pin";
  if ((input.expression as string) === "excited") normalized.expression = "bored";
  delete (normalized as AvatarConfig & LegacyAvatarConfig).hair;
  delete (normalized as AvatarConfig & LegacyAvatarConfig).outfit;
  delete (normalized as AvatarConfig & LegacyAvatarConfig).accessory;
  return normalized;
}

const skinColors: Record<AvatarSkin, { base: string; shade: string }> = {
  fair: { base: "#f8e1d2", shade: "#e4bfa8" },
  light: { base: "#f6d2b8", shade: "#dea98a" },
  warm: { base: "#d99b6c", shade: "#b97850" },
  tan: { base: "#ba7952", shade: "#92583d" },
  brown: { base: "#9a5f3f", shade: "#74432e" },
  deep: { base: "#633b2a", shade: "#43271e" },
};

const hairColors: Record<AvatarHairPreset, string> = {
  black: "#27201d", dark_brown: "#443027", brown: "#654331", light_brown: "#94684a",
  blonde: "#d6a84e", red: "#9f452d", gray: "#8b929d", white: "#e5e7eb",
};

const outfitColors: Record<AvatarOutfitPreset, { base: string; dark: string; accent: string }> = {
  green: { base: "#58cc02", dark: "#3f9f00", accent: "#ffffff" },
  blue: { base: "#1cb0f6", dark: "#168dcc", accent: "#ffffff" },
  coral: { base: "#ff6b6b", dark: "#dc4f4f", accent: "#ffe65b" },
  purple: { base: "#a560e8", dark: "#7f43c2", accent: "#ffffff" },
  yellow: { base: "#ffc800", dark: "#d8a700", accent: "#6b5100" },
  charcoal: { base: "#4b5563", dark: "#303742", accent: "#ffffff" },
};

function isHexColor(value: string): value is `#${string}` {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function customOutfitPalette(color: `#${string}`) {
  const red = Number.parseInt(color.slice(1, 3), 16);
  const green = Number.parseInt(color.slice(3, 5), 16);
  const blue = Number.parseInt(color.slice(5, 7), 16);
  const channel = (value: number) => Math.round(value * .72).toString(16).padStart(2, "0");
  const luminance = red * .299 + green * .587 + blue * .114;
  return {
    base: color,
    dark: `#${channel(red)}${channel(green)}${channel(blue)}`,
    accent: luminance > 170 ? "#334155" : "#ffffff",
  };
}

type CoursePinKind = "biomedical" | "nursing" | "electrical" | "computing" | "psychology" | "medicine" | "law" | "architecture" | "engineering" | "environment" | "business" | "dentistry" | "education" | "nutrition" | "veterinary" | "sports" | "arts" | "academic";

function coursePinKind(course: string): CoursePinKind {
  const name = course.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
  if (/comput|software|sistemas|informat|dados|tecnologia/.test(name)) return "computing";
  if (/eletric|eletron|mecatron/.test(name)) return "electrical";
  if (/biomed|biolog|farmac|biotec/.test(name)) return "biomedical";
  if (/enferm/.test(name)) return "nursing";
  if (/psicolog/.test(name)) return "psychology";
  if (/veterin/.test(name)) return "veterinary";
  if (/educacao fisica|educacao esportiva|esporte/.test(name)) return "sports";
  if (/medicina/.test(name)) return "medicine";
  if (/direito|jurid/.test(name)) return "law";
  if (/arquitet|urbanismo/.test(name)) return "architecture";
  if (/ambient|agronom|florest/.test(name)) return "environment";
  if (/engenharia/.test(name)) return "engineering";
  if (/administra|gestao|econom|contab|marketing|comercio/.test(name)) return "business";
  if (/odont/.test(name)) return "dentistry";
  if (/pedagog|letras|historia|geografia|filosofia|educacao/.test(name)) return "education";
  if (/nutri/.test(name)) return "nutrition";
  if (/design|artes|moda|publicidade|audiovisual/.test(name)) return "arts";
  return "academic";
}

function CoursePinGlyph({ course, color }: { course: string; color: string }) {
  const kind = coursePinKind(course);
  const common = { fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "computing") return <g {...common}><rect x="4" y="5" width="16" height="12" rx="2" /><path d="M8 20h8M12 17v3M9 9l-2 2 2 2M15 9l2 2-2 2" /></g>;
  if (kind === "electrical") return <path d="m14 2-8 12h6l-2 8 8-12h-6l2-8Z" fill={color} />;
  if (kind === "biomedical") return <g {...common}><path d="M7 18h8M4 21h16M14 21a6 6 0 0 0 0-12h-1M9 14h3M9 12a2 2 0 0 1-2-2V7h6v3a2 2 0 0 1-2 2H9ZM11 7V3h4v4" /></g>;
  if (kind === "nursing") return <g {...common}><path d="M12 21S4 16 4 10c0-5 6-6 8-2 2-4 8-3 8 2 0 6-8 11-8 11Z" /><path d="M12 9v6M9 12h6" /></g>;
  if (kind === "psychology") return <text x="12" y="17" textAnchor="middle" fill={color} fontSize="16" fontWeight="800" fontFamily="Georgia, serif">Ψ</text>;
  if (kind === "medicine") return <g {...common}><path d="M7 3v6a5 5 0 0 0 10 0V3M5 3h4M15 3h4M12 14v2a4 4 0 0 0 8 0v-2" /><circle cx="20" cy="13" r="2" /></g>;
  if (kind === "law") return <g {...common}><path d="M12 3v18M6 6h12M4 17h6M14 17h6M7 6l-3 8h6L7 6ZM17 6l-3 8h6l-3-8Z" /></g>;
  if (kind === "architecture") return <g {...common}><circle cx="12" cy="12" r="3" /><path d="M12 2 8 10M12 2l4 8M7 20l5-8 5 8M4 20h16" /></g>;
  if (kind === "engineering") return <g {...common}><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="8" strokeDasharray="3 2" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></g>;
  if (kind === "environment") return <g {...common}><path d="M5 19C5 8 11 3 20 4c1 10-5 16-15 15Z" /><path d="m6 18 10-10M10 14h5M12 12V8" /></g>;
  if (kind === "business") return <g {...common}><path d="M4 20V4M4 20h17M8 17v-5h3v5M13 17V8h3v9M18 17V4h3v13" /></g>;
  if (kind === "dentistry") return <path d="M12 4C8 1 4 4 5 9c1 5 2 12 5 12 2 0 1-6 2-6s0 6 2 6c3 0 4-7 5-12 1-5-3-8-7-5Z" {...common} />;
  if (kind === "education") return <g {...common}><path d="M3 5c4-1 7 0 9 3v12c-2-3-5-4-9-3V5ZM21 5c-4-1-7 0-9 3v12c2-3 5-4 9-3V5Z" /></g>;
  if (kind === "nutrition") return <g {...common}><path d="M12 8c-5-5-10-1-8 6 2 7 6 8 8 5 2 3 6 2 8-5 2-7-3-11-8-6Z" /><path d="M12 8c0-3 2-5 5-5M12 7c-2-3-5-3-6-2" /></g>;
  if (kind === "veterinary") return <g fill={color}><circle cx="6" cy="8" r="2.5" /><circle cx="11" cy="5" r="2.5" /><circle cx="17" cy="7" r="2.5" /><circle cx="19" cy="12" r="2.5" /><path d="M12 10c-5 0-8 7-4 10 2 2 4-1 6 0 3 2 7 0 6-4-1-4-5-6-8-6Z" /></g>;
  if (kind === "sports") return <g {...common}><path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12" /></g>;
  if (kind === "arts") return <g {...common}><path d="M12 3a9 9 0 1 0 0 18h2c2 0 2-3 0-3h-1c-2 0-2-3 0-3h4c5 0 5-12-5-12Z" /><circle cx="7" cy="10" r="1" fill={color} /><circle cx="10" cy="7" r="1" fill={color} /><circle cx="15" cy="8" r="1" fill={color} /></g>;
  return <g {...common}><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 12v5c4 3 8 3 12 0v-5M21 10v7" /></g>;
}

function InsetCoursePinGlyph({ course, color }: { course: string; color: string }) {
  return <g transform="translate(2.4 2.4) scale(.8)"><CoursePinGlyph course={course} color={color} /></g>;
}

function AnimalPinGlyph({ animal, color }: { animal: AvatarAnimalPin; color: string }) {
  const common = { fill: "none", stroke: color, strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (animal === "cat") return <g {...common}><path d="M5 9V4l4 3c2-1 4-1 6 0l4-3v5c2 2 2 7-1 10-3 3-9 3-12 0-3-3-3-8-1-10Z" /><path d="M8 13h.01M16 13h.01M10 17c1 1 3 1 4 0M12 15v2" /></g>;
  if (animal === "dog") return <g {...common}><path d="M4.42 11.25A13 13 0 0 0 4 14.56C4 18.73 7.58 21 12 21s8-2.27 8-6.44c0-1.13-.17-2.24-.49-3.31" /><path d="M8.5 8.5C8.12 9.55 7.42 10.53 6.16 11 4.23 11.72 2.58 10.7 2.5 10c-.11-.99 1.18-6.53 4-7 1.92-.32 3.65.85 3.65 2.24A7.5 7.5 0 0 1 14 5.28c0-1.39 1.84-2.6 3.77-2.28 2.82.47 4.11 6.01 4 7-.08.7-1.73 1.72-3.66 1-1.26-.47-1.85-1.45-2.24-2.5" /><circle cx="8" cy="14" r=".9" fill={color} /><circle cx="16" cy="14" r=".9" fill={color} /><path d="M10.5 16c1 1 2 1 3 0M12 17v1.2c0 1.4 2 1.4 2 0" /></g>;
  if (animal === "bird") return <g {...common}><circle cx="15" cy="8" r="4" /><path d="m19 8 4 2-4 2M17 11c2 5-2 9-7 9-4 0-7-2-8-6 3 1 6 0 9-4M7 13c3 0 5 2 6 5-4 0-6-2-6-5ZM9 20v2M15 19v3M7 22h4M13 22h4" /><circle cx="16" cy="7" r=".7" fill={color} /></g>;
  if (animal === "rabbit") return <g {...common}><ellipse cx="10" cy="16" rx="7" ry="5" /><circle cx="16" cy="11" r="4" /><path d="M14 8C9 2 11 0 16 7M17 7c0-6 3-6 2 2M3 14c-3-1-3 4 1 4M18 14h.01M8 21v1M14 20v2" /><circle cx="17" cy="10" r=".7" fill={color} /></g>;
  if (animal === "fish") return <g {...common}><path d="M4 12c4-6 10-6 15-2l3-3v10l-3-3c-5 4-11 4-15-2Z" /><circle cx="16" cy="11" r=".8" fill={color} /><path d="M8 9c1 2 1 4 0 6" /></g>;
  return <g {...common}><ellipse cx="11" cy="12" rx="7" ry="5" /><circle cx="20" cy="12" r="2.5" /><path d="M5 9 2 7M5 15l-3 2M15 9l2-2M15 15l2 2M4 12 2 11v2l2-1M8 8l3 4 3-4M8 16l3-4 3 4" /><circle cx="21" cy="11" r=".6" fill={color} /></g>;
}

function InsetAnimalPinGlyph({ animal, color }: { animal: AvatarAnimalPin; color: string }) {
  return <g transform="translate(2.4 2.4) scale(.8)"><AnimalPinGlyph animal={animal} color={color} /></g>;
}

export function CoursePinBadge({ course, color = "#1cb0f6", className = "" }: { course: string; color?: string; className?: string }) {
  const pin = isHexColor(color) ? color : "#1cb0f6";
  const accent = customOutfitPalette(pin).accent;
  return <svg viewBox="0 0 24 24" className={className} role="img" aria-label={`Símbolo de ${course}`}><circle cx="12" cy="12" r="11" fill={pin} /><InsetCoursePinGlyph course={course} color={accent} /></svg>;
}

export function AnimalPinBadge({ animal, color = "#1cb0f6", className = "" }: { animal: AvatarAnimalPin; color?: string; className?: string }) {
  const pin = isHexColor(color) ? color : "#1cb0f6";
  const accent = customOutfitPalette(pin).accent;
  return <svg viewBox="0 0 24 24" className={className} role="img" aria-label={`Broche de ${avatarChoices.animalPin.find((item) => item.value === animal)?.label ?? "animal"}`}><circle cx="12" cy="12" r="11" fill={pin} /><InsetAnimalPinGlyph animal={animal} color={accent} /></svg>;
}

interface UgoAvatarProps {
  config?: Partial<AvatarConfig> | null;
  className?: string;
  label?: string;
}

export function UgoAvatar({ config: rawConfig, className = "", label = "Avatar personalizado" }: UgoAvatarProps) {
  const config = normalizeAvatarConfig(rawConfig);
  const skin = skinColors[config.skin];
  const hairColor = isHexColor(config.hairColor) ? config.hairColor : hairColors[config.hairColor as AvatarHairPreset] ?? hairColors.black;
  const facialHairColor = isHexColor(config.facialHairColor) ? config.facialHairColor : hairColors[config.facialHairColor as AvatarHairPreset] ?? hairColors.black;
  const outfit = isHexColor(config.outfitColor) ? customOutfitPalette(config.outfitColor) : outfitColors[config.outfitColor as AvatarOutfitPreset] ?? outfitColors.green;
  const pinColor = isHexColor(config.pinColor) ? config.pinColor : "#1cb0f6";
  const pinAccent = customOutfitPalette(pinColor).accent;
  const showHair = config.hairStyle !== "bald" && config.headwear !== "headscarf";
  const usesHairMass = ["straight", "bun"].includes(config.hairStyle);
  const hairEnd = config.hairLength === "short" ? 74 : config.hairLength === "medium" ? 105 : 137;
  const curlyBackCurls = config.hairLength === "short"
    ? [[42, 51, 13], [118, 51, 13]]
    : config.hairLength === "medium"
      ? [[40, 48, 14], [36, 65, 13], [36, 83, 12], [40, 101, 12], [120, 48, 14], [124, 65, 13], [124, 83, 12], [120, 101, 12]]
      : [[39, 47, 15], [34, 65, 14], [34, 84, 13], [36, 103, 13], [39, 121, 12], [45, 138, 12], [121, 47, 15], [126, 65, 14], [126, 84, 13], [124, 103, 13], [121, 121, 12], [115, 138, 12]];
  const afroSize = config.hairLength === "short"
    ? { rx: 43, ry: 35, cy: 45 }
    : config.hairLength === "medium"
      ? { rx: 51, ry: 43, cy: 49 }
      : { rx: 59, ry: 52, cy: 54 };
  const afroBackCurls = config.hairLength === "short"
    ? [[42, 38, 15], [50, 24, 16], [64, 16, 16], [80, 14, 17], [96, 16, 16], [110, 24, 16], [118, 38, 15], [38, 54, 14], [122, 54, 14]]
    : config.hairLength === "medium"
      ? [[35, 34, 17], [45, 19, 18], [61, 10, 18], [80, 7, 19], [99, 10, 18], [115, 19, 18], [125, 34, 17], [30, 53, 16], [130, 53, 16], [32, 72, 16], [128, 72, 16]]
      : [[29, 31, 20], [41, 14, 21], [60, 3, 21], [80, 0, 22], [100, 3, 21], [119, 14, 21], [131, 31, 20], [22, 54, 19], [138, 54, 19], [23, 77, 19], [137, 77, 19], [31, 98, 18], [129, 98, 18]];

  return (
    <div className={`overflow-hidden rounded-full bg-[#dff7cf] ${className}`} role="img" aria-label={label}>
      <svg viewBox="0 0 160 160" className="h-full w-full" aria-hidden="true">
        <circle cx="80" cy="80" r="80" fill="#dff7cf" />
        <circle cx="132" cy="28" r="28" fill="#b9ed96" opacity=".65" />
        <circle cx="22" cy="128" r="36" fill="#c8f2aa" opacity=".8" />

        {showHair && usesHairMass && config.hairLength === "medium" ? <path d="M40 62c0-30 17-48 40-48s41 18 41 49v56c-10 7-20 8-30 1L80 103l-11 17c-10 7-20 6-30-1l1-57Z" fill={hairColor} /> : null}
        {showHair && usesHairMass && config.hairLength === "long" ? <path d="M37 65c0-33 18-52 43-52 27 0 44 21 44 54v72c-11 8-22 7-32-3l-12-31-13 31c-11 10-22 11-31 3l1-74Z" fill={hairColor} /> : null}
        {showHair && config.hairStyle === "wavy" && config.hairLength === "medium" ? (
          <path d="M39 62C37 31 54 13 80 13c28 0 45 20 43 53 7 9-3 16 2 25 5 10-5 17-1 26 3 8-4 15-12 14-9-1-12-9-7-17 5-9-4-16 0-25 4-8-1-17-5-25-13 5-28 6-43 2-5 8-8 16-3 24 5 9-5 16 0 25 5 8 1 16-7 17-8 1-15-7-11-15 4-9-6-16-1-26 5-9-5-16 2-25Z" fill={hairColor} />
        ) : null}
        {showHair && config.hairStyle === "wavy" && config.hairLength === "long" ? (
          <path d="M36 64C34 31 52 11 80 11c30 0 48 22 46 57 7 9-3 17 2 26 5 10-5 18 0 28 5 11-2 22-12 25-9 2-16-7-12-16 5-10-5-18 0-28 5-10-5-18 0-28 3-7 0-16-5-23-13 6-25 7-39 3-6 8-9 17-5 25 5 10-5 18 0 28 5 10-5 18 0 28 4 9-3 18-12 16-10-3-17-14-12-25 5-10-5-18 0-28 5-9-5-17 2-26Z" fill={hairColor} />
        ) : null}
        {showHair && config.hairStyle === "curly" ? (
          <g fill={hairColor}>
            <ellipse cx="80" cy="58" rx="38" ry={config.hairLength === "long" ? 48 : 39} />
            {curlyBackCurls.map(([cx, cy, radius]) => <circle key={`curly-back-${cx}-${cy}`} cx={cx} cy={cy} r={radius} />)}
          </g>
        ) : null}
        {showHair && config.hairStyle === "afro" ? (
          <g fill={hairColor}>
            <ellipse cx="80" cy={afroSize.cy} rx={afroSize.rx} ry={afroSize.ry} />
            {afroBackCurls.map(([cx, cy, radius]) => <circle key={`afro-back-${cx}-${cy}`} cx={cx} cy={cy} r={radius} />)}
          </g>
        ) : null}
        {config.headwear === "headscarf" ? <path d="M38 58c0-31 17-49 42-49 27 0 44 21 44 53v78c-13 10-27 7-37-7l-7-21-8 21c-10 14-23 17-36 7l2-82Z" fill="#7867d9" /> : null}

        <path d="M31 160c2-35 20-55 49-55s47 20 49 55H31Z" fill={outfit.base} />
        <path d="M31 160c2-35 20-55 49-55v55H31Z" fill={outfit.dark} opacity=".28" />

        {config.outfitType === "hoodie" ? (
          <>
            <path d="M56 112c7 12 41 12 48 0" fill="none" stroke={outfit.dark} strokeWidth="7" strokeLinecap="round" />
            <path d="M67 121v24M94 121v24" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : null}
        {config.outfitType === "jacket" ? (
          <>
            <path d="M80 111v49" stroke="#fff" strokeWidth="4" />
            <path d="m58 112 22 22 22-22" fill="#fff" opacity=".9" />
            <path d="m65 116 15 15 15-15" fill="#f3f4f6" />
          </>
        ) : null}
        {config.outfitType === "tee" ? <path d="M63 110c3 10 31 10 34 0" fill="none" stroke={outfit.accent} strokeWidth="6" strokeLinecap="round" /> : null}
        {config.outfitType === "sweater" ? (
          <path d="M45 143h70M48 153h64" stroke={outfit.accent} strokeWidth="4" opacity=".72" />
        ) : null}
        {config.outfitType === "polo" ? (
          <>
            <path d="m62 111 18 17 18-17-8-3-10 9-10-9-8 3Z" fill={outfit.accent} opacity=".95" />
            <path d="M80 121v26" stroke={outfit.dark} strokeWidth="3" />
            <circle cx="85" cy="132" r="2" fill={outfit.accent} /><circle cx="85" cy="140" r="2" fill={outfit.accent} />
          </>
        ) : null}
        {config.outfitType === "varsity" ? (
          <>
            <path d="M49 119c8-5 13-7 20-9l11 13 11-13c7 2 12 4 20 9l7 41H42l7-41Z" fill={outfit.base} />
            <path d="M80 121v39M69 110l11 13 11-13" fill="none" stroke={outfit.accent} strokeWidth="4" />
            <path d="M45 126c6 1 11 4 15 8M115 126c-6 1-11 4-15 8" fill="none" stroke={outfit.accent} strokeWidth="5" opacity=".9" />
            <path d="m91 134 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z" fill={outfit.accent} />
          </>
        ) : null}
        {config.outfitType === "overalls" ? (
          <>
            <path d="M60 111h40l6 49H54l6-49Z" fill={outfit.dark} />
            <path d="M66 108v25M94 108v25" stroke={outfit.accent} strokeWidth="6" strokeLinecap="round" />
            <rect x="67" y="128" width="26" height="21" rx="5" fill={outfit.base} stroke={outfit.accent} strokeWidth="2" />
            <circle cx="66" cy="126" r="3" fill={outfit.accent} /><circle cx="94" cy="126" r="3" fill={outfit.accent} />
          </>
        ) : null}
        {config.outfitType === "jersey" ? (
          <>
            <path d="M58 112c4 12 40 12 44 0" fill="none" stroke={outfit.accent} strokeWidth="6" />
            <path d="M45 130h16M99 130h16" stroke={outfit.accent} strokeWidth="5" />
            <text x="80" y="151" textAnchor="middle" fill={outfit.accent} fontSize="23" fontWeight="900" fontFamily="system-ui, sans-serif">U</text>
          </>
        ) : null}
        {config.outfitType === "turtleneck" ? (
          <>
            <path d="M61 108c4 12 34 12 38 0v19H61v-19Z" fill={outfit.dark} />
            <path d="M65 116h30M64 122h32" stroke={outfit.accent} strokeWidth="2.5" opacity=".65" />
          </>
        ) : null}

        <rect x="70" y="91" width="20" height="25" rx="9" fill={skin.base} />
        <circle cx="42" cy="70" r="11" fill={skin.base} />
        <circle cx="118" cy="70" r="11" fill={skin.base} />
        <ellipse cx="80" cy="67" rx="38" ry="43" fill={skin.base} />
        <path d="M74 75c3 2 9 2 12 0" fill="none" stroke={skin.shade} strokeWidth="3" strokeLinecap="round" />
        {config.facialHair === "stubble" ? <path d="M57 80c3 20 43 20 46 0" fill="none" stroke={facialHairColor} strokeWidth="5" strokeDasharray="1 6" strokeLinecap="round" opacity=".7" /> : null}
        {config.facialHair === "mustache" ? <path d="M80 80c-4-5-14-5-18 2 7 6 14 5 18 1 4 4 11 5 18-1-4-7-14-7-18-2Z" fill={facialHairColor} /> : null}
        {config.facialHair === "goatee" ? <><path d="M80 80c-4-4-12-4-16 2 6 5 12 4 16 1 4 3 10 4 16-1-4-6-12-6-16-2Z" fill={facialHairColor} /><path d="M72 92c3 12 13 14 16 0-5 3-11 3-16 0Z" fill={facialHairColor} /></> : null}
        {config.facialHair === "short_beard" ? <path d="M55 82c3 17 13 25 25 25s22-8 25-25c-5 4-9 5-13 6-5 9-19 9-24 0-4-1-8-2-13-6Z" fill={facialHairColor} opacity=".9" /> : null}
        {config.facialHair === "beard" ? <path d="M51 77c2 22 14 34 29 34s27-12 29-34c-5 4-9 6-13 7-3 15-29 15-32 0-4-1-8-3-13-7Z" fill={facialHairColor} opacity=".94" /> : null}
        {config.expression === "calm" ? (
          <>
            <path d="M58 65c4 4 8 4 12 0M90 65c4 4 8 4 12 0" fill="none" stroke="#263238" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M69 86c6 4 16 4 22 0" fill="none" stroke="#8f3f45" strokeWidth="3.5" strokeLinecap="round" />
          </>
        ) : config.expression === "bored" ? (
          <>
            <path d="M57 62h14M89 62h14" stroke="#263238" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="64" cy="66" r="3" fill="#263238" /><circle cx="96" cy="66" r="3" fill="#263238" />
            <path d="M70 87h20" fill="none" stroke="#8f3f45" strokeWidth="3.5" strokeLinecap="round" />
          </>
        ) : config.expression === "wink" ? (
          <>
            <path d="M57 65c5-4 10-4 15 0" fill="none" stroke="#263238" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="96" cy="64" r="4.5" fill="#263238" /><circle cx="97.5" cy="62.5" r="1.3" fill="#fff" />
            <path d="M68 84c7 8 18 8 25-1" fill="none" stroke="#8f3f45" strokeWidth="4" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="64" cy="65" r="4" fill="#263238" /><circle cx="96" cy="65" r="4" fill="#263238" />
            <circle cx="65.5" cy="63.5" r="1.2" fill="#fff" /><circle cx="97.5" cy="63.5" r="1.2" fill="#fff" />
            <path d="M67 85c7 7 19 7 26 0" fill="none" stroke="#8f3f45" strokeWidth="4" strokeLinecap="round" />
          </>
        )}

        {showHair && config.hairStyle === "straight" ? <path d="M43 61c0-28 17-45 39-45 22 0 37 15 38 43-9-3-17-11-21-21-10 10-31 17-55 15l-1 8Z" fill={hairColor} /> : null}
        {showHair && config.hairStyle === "wavy" ? (
          <g>
            <path d="M42 67C38 37 54 16 80 16c27 0 44 22 38 52-4-7-6-17-9-25-4 6-9 7-14 1-5 7-11 8-17 1-6 7-13 8-19 2-4 5-9 7-13 5 1 7 0 11-4 15Z" fill={hairColor} />
            <path d="M53 34c12-12 38-16 54 1" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".16" />
          </g>
        ) : null}
        {showHair && config.hairStyle === "curly" ? (
          <g fill={hairColor}>
            <circle cx="47" cy="46" r="14" /><circle cx="57" cy="32" r="15" /><circle cx="72" cy="26" r="15" /><circle cx="88" cy="26" r="15" /><circle cx="103" cy="32" r="15" /><circle cx="113" cy="46" r="14" />
            <circle cx="45" cy="59" r="11" /><circle cx="115" cy="59" r="11" />
          </g>
        ) : null}
        {showHair && config.hairStyle === "coily" ? (
          <g fill={hairColor}>
            {[[48, 46], [56, 34], [68, 28], [81, 26], [94, 29], [106, 36], [114, 48], [44, 59], [117, 61]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="9" />)}
            {config.hairLength !== "short" ? <><circle cx="42" cy="75" r="8" /><circle cx="119" cy="75" r="8" /><circle cx="43" cy="90" r="8" /><circle cx="118" cy="90" r="8" /></> : null}
            {config.hairLength === "long" ? <><circle cx="44" cy="105" r="8" /><circle cx="117" cy="105" r="8" /><circle cx="47" cy="120" r="8" /><circle cx="114" cy="120" r="8" /></> : null}
          </g>
        ) : null}
        {showHair && config.hairStyle === "afro" ? (
          <g fill={hairColor}>
            <circle cx="48" cy="42" r="13" /><circle cx="59" cy="31" r="14" /><circle cx="73" cy="27" r="14" /><circle cx="87" cy="27" r="14" /><circle cx="101" cy="31" r="14" /><circle cx="112" cy="42" r="13" />
          </g>
        ) : null}
        {showHair && config.hairStyle === "braids" ? (
          <g fill="none" stroke={hairColor} strokeLinecap="round">
            <path d={`M47 53C43 73 43 90 44 ${hairEnd}`} strokeWidth="6" /><path d={`M54 40C48 66 48 94 50 ${hairEnd}`} strokeWidth="6" /><path d={`M63 31C58 56 58 88 60 ${hairEnd}`} strokeWidth="6" />
            <path d={`M97 31C102 56 102 88 100 ${hairEnd}`} strokeWidth="6" /><path d={`M106 40C112 66 112 94 110 ${hairEnd}`} strokeWidth="6" /><path d={`M113 53C117 73 117 90 116 ${hairEnd}`} strokeWidth="6" />
            <path d="M48 48c12-23 51-29 65 2" strokeWidth="13" />
          </g>
        ) : null}
        {showHair && config.hairStyle === "locs" ? (
          <g fill="none" stroke={hairColor} strokeWidth="7" strokeLinecap="round">
            <path d={`M48 40C43 65 43 88 44 ${hairEnd}`} /><path d={`M58 29C53 57 54 87 56 ${hairEnd}`} /><path d={`M69 23C66 50 67 80 69 ${hairEnd}`} />
            <path d={`M91 23C94 50 93 80 91 ${hairEnd}`} /><path d={`M102 29C107 57 106 87 104 ${hairEnd}`} /><path d={`M112 40C117 65 117 88 116 ${hairEnd}`} />
          </g>
        ) : null}
        {showHair && config.hairStyle === "bun" ? (
          <>
            {config.headwear === "none" ? <circle cx="80" cy="15" r={config.hairLength === "short" ? 13 : 18} fill={hairColor} /> : null}
            <path d="M42 63c0-29 15-45 38-45 24 0 39 17 38 46-7-7-10-18-11-29-12 10-33 17-59 17-1 5-3 9-6 11Z" fill={hairColor} />
          </>
        ) : null}
        {showHair && config.hairStyle === "buzz" ? <path d="M43 54C45 28 59 15 80 15s35 13 37 39c-20-9-54-9-74 0Z" fill={hairColor} opacity=".96" /> : null}

        {config.headwear === "headscarf" ? <path d="M43 74V57c0-27 15-43 37-43 23 0 38 17 38 45v16" fill="none" stroke="#7867d9" strokeWidth="13" strokeLinecap="round" /> : null}
        {config.headwear === "cap" ? (
          <>
            <path d="M47 35c9-17 53-22 66 5l-2 11H47V35Z" fill="#ffca28" />
            <path d="M44 49h78c-3 9-22 10-37 6H47Z" fill="#e4a900" />
          </>
        ) : null}
        {config.headwear === "beanie" ? <><path d="M45 48c1-25 15-37 35-37 21 0 35 13 36 38Z" fill="#1cb0f6" /><rect x="43" y="46" width="74" height="14" rx="6" fill="#168dcc" /></> : null}
        {config.eyewear === "square_glasses" ? (
          <g fill="none" stroke="#374151" strokeWidth="3">
            <rect x="51" y="57" width="25" height="18" rx="8" /><rect x="84" y="57" width="25" height="18" rx="8" /><path d="M76 63h8" />
          </g>
        ) : null}
        {config.eyewear === "round_glasses" ? <g fill="none" stroke="#374151" strokeWidth="3"><circle cx="64" cy="65" r="11" /><circle cx="96" cy="65" r="11" /><path d="M75 63h10" /></g> : null}
        {config.eyewear === "sunglasses" ? <g fill="#263238" stroke="#111827" strokeWidth="2"><path d="M50 58h27l-2 19H57c-5-3-7-10-7-19Z" /><path d="M83 58h27c0 9-2 16-7 19H85Z" /><path d="M76 63h8" fill="none" strokeWidth="3" /></g> : null}
        {config.earAccessory === "headphones" ? (
          <>
            <path d="M39 76V62c0-25 18-43 41-43s41 18 41 43v14" fill="none" stroke="#374151" strokeWidth="8" strokeLinecap="round" />
            <rect x="34" y="64" width="13" height="27" rx="6" fill="#374151" /><rect x="113" y="64" width="13" height="27" rx="6" fill="#374151" />
          </>
        ) : null}
        {config.earAccessory === "earrings" ? <><circle cx="40" cy="78" r="4" fill="#f6c945" /><circle cx="120" cy="78" r="4" fill="#f6c945" /><path d="M40 81v8M120 81v8" stroke="#f6c945" strokeWidth="3" strokeLinecap="round" /></> : null}
        {config.earAccessory === "hearing_aid" ? <><path d="M119 66c9 2 9 15 3 20l-5-3c4-4 4-10 0-13Z" fill="#1cb0f6" /><circle cx="119" cy="84" r="3" fill="#168dcc" /></> : null}
        {config.outfitAccessory === "leaf_pin" ? (
          <g transform="translate(99 129) rotate(-20)">
            <path d="M0 11C1 1 9-3 18 1c0 10-7 17-18 10Z" fill={pinColor} /><path d="M3 11 14 3" stroke={pinAccent} strokeWidth="2" />
          </g>
        ) : null}
        {config.outfitAccessory === "animal_pin" ? <g transform="translate(94 124) scale(.84)"><circle cx="12" cy="12" r="11" fill={pinColor} stroke={pinAccent} strokeWidth="1.4" opacity=".98" /><InsetAnimalPinGlyph animal={config.animalPin} color={pinAccent} /></g> : null}
        {config.outfitAccessory === "course_pin" ? <g transform="translate(94 124) scale(.84)"><circle cx="12" cy="12" r="11" fill={pinColor} stroke={pinAccent} strokeWidth="1.4" opacity=".98" /><InsetCoursePinGlyph course={config.coursePin} color={pinAccent} /></g> : null}
      </svg>
    </div>
  );
}
