import {
  Award, Clock3, Flag, Flame, Heart, HeartHandshake, Leaf,
  MessageCircle, Rocket, ShieldCheck, Sparkles, TreePine,
} from "lucide-react";

const iconMap = {
  primeira_carona: Flag,
  cinco_caronas: Flame,
  vinte_caronas: Rocket,
  eco_10kg: Leaf,
  eco_50kg: TreePine,
  reconhecido_5: HeartHandshake,
  gentileza: Heart,
  pontualidade: Clock3,
  boa_conversa: MessageCircle,
  direcao_segura: ShieldCheck,
  respeito: ShieldCheck,
  rota_consciente: Leaf,
} as const;

interface BadgeSealProps {
  code: string;
  color: string;
  earned?: boolean;
  size?: "sm" | "md" | "lg";
  label: string;
}

export function BadgeSeal({ code, color, earned = true, size = "md", label }: BadgeSealProps) {
  const Icon = iconMap[code as keyof typeof iconMap] ?? (earned ? Award : Sparkles);
  const dimensions = size === "sm" ? "h-[4.5rem] w-14" : size === "lg" ? "h-36 w-28" : "h-24 w-[4.5rem]";
  const iconSize = size === "sm" ? "h-5 w-5" : size === "lg" ? "h-10 w-10" : "h-7 w-7";
  const activeColor = earned ? color : "#aeb7c4";
  const ringColor = earned ? "#f6c945" : "#d6dbe2";

  return (
    <div className={`relative shrink-0 ${dimensions}`} role="img" aria-label={`${earned ? "Selo conquistado" : "Selo bloqueado"}: ${label}`}>
      <svg viewBox="0 0 80 104" className="absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_3px_1px_rgba(0,0,0,.18)]" aria-hidden="true">
        <path d="M10 1h24l12 42-17 15Z" fill={activeColor} />
        <path d="M46 1h24L51 58 34 43Z" fill={activeColor} opacity=".72" />
        <path d="m30 2 10 35L50 2" fill="none" stroke="#fff" strokeOpacity=".42" strokeWidth="3" />
        <circle cx="40" cy="69" r="33" fill="#fff" />
        <circle cx="40" cy="69" r="30" fill={ringColor} />
        <circle cx="40" cy="69" r="24" fill={activeColor} />
        <circle cx="40" cy="69" r="19" fill="none" stroke="#fff" strokeOpacity=".66" strokeWidth="2" />
        <path d="M24 91c9 8 23 10 34 2" fill="none" stroke="#000" strokeOpacity=".12" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="absolute left-1/2 top-[66%] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-white drop-shadow-sm"><Icon className={iconSize} strokeWidth={2.8} /></span>
      {earned ? <span className="absolute bottom-[4%] right-[2%] flex h-[18%] min-h-3 w-[24%] min-w-3 items-center justify-center rounded-full bg-[#ffde59] text-[8px] font-black text-amber-700 ring-2 ring-white">✓</span> : null}
    </div>
  );
}
