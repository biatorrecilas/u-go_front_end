import { useState } from "react";
import { Dices, Glasses, Plus, Scissors, Shirt, Smile, Sparkles } from "lucide-react";
import {
  AnimalPinBadge,
  avatarChoices,
  CoursePinBadge,
  UgoAvatar,
  type AvatarConfig,
  type AvatarHairColor,
  type AvatarOutfitColor,
  type AvatarPinColor,
} from "./UgoAvatar";

interface AvatarDesignerProps {
  config: AvatarConfig;
  onChange: (config: AvatarConfig) => void;
  courses?: ReadonlyArray<{ id: string; name: string }>;
  currentCourseId?: string;
}

type Section = "face" | "hair" | "outfit" | "extras";

const sections = [
  { id: "face", label: "Rosto", icon: Smile },
  { id: "hair", label: "Cabelo", icon: Scissors },
  { id: "outfit", label: "Roupa", icon: Shirt },
  { id: "extras", label: "Extras", icon: Glasses },
] as const;

const choiceButton = (active: boolean) =>
  `min-h-11 rounded-2xl border-2 px-3 py-2 text-xs font-black transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime-200 ${
    active
      ? "translate-y-0 border-[#58a700] bg-[#d7ffb8] text-[#397300] shadow-[0_3px_0_#58a700]"
      : "border-slate-200 bg-white text-slate-600 shadow-[0_3px_0_#e2e8f0] hover:-translate-y-0.5 hover:border-lime-300"
  }`;

function ColorChoices({
  label,
  choices,
  value,
  onSelect,
  customColor,
}: {
  label: string;
  choices: ReadonlyArray<{ value: string; label: string; color: string }>;
  value: string;
  onSelect: (value: string) => void;
  customColor?: {
    fallback: `#${string}`;
    label: string;
    onSelect: (value: `#${string}`) => void;
  };
}) {
  const customActive = /^#[0-9a-f]{6}$/i.test(value) && !choices.some((choice) => choice.value.toLocaleLowerCase() === value.toLocaleLowerCase());
  const customValue = customActive ? value : customColor?.fallback;
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-black uppercase tracking-[.12em] text-slate-500">{label}</legend>
      <div className="flex flex-wrap gap-2.5">
        {choices.map((choice) => {
          const active = value === choice.value;
          return (
            <button
              key={choice.value}
              type="button"
              title={choice.label}
              aria-label={`${label}: ${choice.label}`}
              aria-pressed={active}
              onClick={() => onSelect(choice.value)}
              className={`relative h-10 w-10 rounded-full border-[3px] transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime-200 ${active ? "scale-110 border-[#58a700] shadow-[0_3px_0_#58a700]" : "border-white shadow-[0_2px_0_#cbd5e1] hover:scale-105"}`}
              style={{ backgroundColor: choice.color }}
            >
              {active ? <span className="absolute inset-[7px] rounded-full border-2 border-white/90" /> : null}
            </button>
          );
        })}
        {customColor && customValue ? (
          <label
            title={customColor.label}
            className={`relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-[3px] transition-all focus-within:ring-4 focus-within:ring-lime-200 hover:scale-105 ${customActive ? "scale-110 border-[#58a700] shadow-[0_3px_0_#58a700]" : "border-dashed border-slate-300 bg-white shadow-[0_2px_0_#cbd5e1]"}`}
            style={customActive ? { backgroundColor: customValue } : undefined}
          >
            <Plus className={`h-5 w-5 stroke-[3] ${customActive ? "text-white drop-shadow" : "text-slate-500"}`} aria-hidden="true" />
            <input type="color" value={customValue} onChange={(event) => customColor.onSelect(event.target.value as `#${string}`)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" aria-label={customColor.label} />
          </label>
        ) : null}
      </div>
    </fieldset>
  );
}

function TextChoices({
  label,
  choices,
  value,
  onSelect,
  columns = 2,
}: {
  label: string;
  choices: ReadonlyArray<{ value: string; label: string }>;
  value: string;
  onSelect: (value: string) => void;
  columns?: 2 | 3;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-black uppercase tracking-[.12em] text-slate-500">{label}</legend>
      <div className={`grid gap-2.5 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {choices.map((choice) => (
          <button key={choice.value} type="button" aria-pressed={value === choice.value} onClick={() => onSelect(choice.value)} className={choiceButton(value === choice.value)}>
            {choice.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function AvatarDesigner({ config, onChange, courses = [], currentCourseId }: AvatarDesignerProps) {
  const [section, setSection] = useState<Section>("hair");
  const patch = <Key extends keyof AvatarConfig>(key: Key, value: AvatarConfig[Key]) => {
    const next = { ...config, [key]: value };
    if (key === "hairStyle" && (value === "bald" || value === "buzz")) next.hairLength = "short";
    onChange(next);
  };

  const selectOutfitAccessory = (value: AvatarConfig["outfitAccessory"]) => {
    const next = { ...config, outfitAccessory: value };
    if (value === "course_pin" && (!config.coursePin || config.coursePin === "Curso")) {
      next.coursePin = courses.find((course) => course.id === currentCourseId)?.name ?? courses[0]?.name ?? "Curso";
    }
    onChange(next);
  };

  const randomize = () => {
    const pick = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)];
    const hairStyle = pick(avatarChoices.hairStyle).value;
    onChange({
      ...config,
      skin: pick(avatarChoices.skin).value,
      hairColor: pick(avatarChoices.hairColor).value,
      hairStyle,
      hairLength: hairStyle === "bald" || hairStyle === "buzz" ? "short" : pick(avatarChoices.hairLength).value,
      facialHair: pick(avatarChoices.facialHair).value,
      facialHairColor: pick(avatarChoices.hairColor).value,
      outfitType: pick(avatarChoices.outfitType).value,
      outfitColor: pick(avatarChoices.outfitColor).value,
      headwear: pick(avatarChoices.headwear).value,
      eyewear: pick(avatarChoices.eyewear).value,
      earAccessory: pick(avatarChoices.earAccessory).value,
      outfitAccessory: pick(avatarChoices.outfitAccessory).value,
      animalPin: pick(avatarChoices.animalPin).value,
      coursePin: courses.find((course) => course.id === currentCourseId)?.name ?? courses[0]?.name ?? config.coursePin,
      pinColor: pick(avatarChoices.pinColor).value,
      expression: pick(avatarChoices.expression).value,
    });
  };

  return (
    <div className="mt-5 overflow-hidden rounded-[1.75rem] border-2 border-slate-200 bg-white shadow-[0_5px_0_#e2e8f0]">
      <div className="grid lg:grid-cols-[230px_1fr]">
        <aside className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#efffdc] to-[#d7ffb8] px-5 py-6 lg:min-h-[510px] lg:border-r-2 lg:border-slate-200">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/35" />
          <div className="absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-[#b8f28b]/60" />
          <UgoAvatar config={config} className="relative h-44 w-44 border-[6px] border-white shadow-[0_6px_0_#93c96c]" label="Prévia do avatar personalizado" />
          <button type="button" onClick={randomize} className="relative mt-5 inline-flex items-center gap-2 rounded-2xl border-2 border-[#58a700] bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wide text-[#397300] shadow-[0_4px_0_#58a700] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none">
            <Dices className="h-4 w-4" /> Me surpreenda
          </button>
        </aside>

        <div className="min-w-0">
          <nav className="grid grid-cols-4 border-b-2 border-slate-200 bg-slate-50 p-2" aria-label="Categorias do avatar">
            {sections.map((item) => {
              const Icon = item.icon;
              const active = section === item.id;
              return (
                <button key={item.id} type="button" onClick={() => setSection(item.id)} aria-current={active ? "page" : undefined} className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-[10px] font-black uppercase tracking-wide transition sm:flex-row sm:justify-center sm:text-xs ${active ? "bg-[#58cc02] text-white shadow-[0_3px_0_#58a700]" : "text-slate-500 hover:bg-white hover:text-slate-800"}`}>
                  <Icon className="h-4 w-4" /> {item.label}
                </button>
              );
            })}
          </nav>

          <div className="max-h-[430px] space-y-6 overflow-y-auto p-5 sm:p-6">
            {section === "face" ? (
              <>
                <ColorChoices label="Tom de pele" choices={avatarChoices.skin} value={config.skin} onSelect={(value) => patch("skin", value as AvatarConfig["skin"])} />
                <TextChoices label="Expressão" choices={avatarChoices.expression} value={config.expression} onSelect={(value) => patch("expression", value as AvatarConfig["expression"])} />
                <TextChoices label="Barba ou bigode" choices={avatarChoices.facialHair} value={config.facialHair} onSelect={(value) => patch("facialHair", value as AvatarConfig["facialHair"])} />
                {config.facialHair !== "none" ? <ColorChoices label="Cor da barba" choices={avatarChoices.hairColor} value={config.facialHairColor} onSelect={(value) => patch("facialHairColor", value as AvatarHairColor)} /> : null}
              </>
            ) : null}

            {section === "hair" ? (
              <>
                <fieldset>
                  <legend className="mb-3 text-xs font-black uppercase tracking-[.12em] text-slate-500">Estilo do cabelo</legend>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {avatarChoices.hairStyle.map((choice) => {
                      const active = config.hairStyle === choice.value;
                      return (
                        <button key={choice.value} type="button" aria-pressed={active} onClick={() => patch("hairStyle", choice.value)} className={`flex items-center gap-2 rounded-2xl border-2 p-2 text-left text-[11px] font-black transition-all ${active ? "border-[#58a700] bg-[#d7ffb8] text-[#397300] shadow-[0_3px_0_#58a700]" : "border-slate-200 bg-white text-slate-600 shadow-[0_3px_0_#e2e8f0] hover:border-lime-300"}`}>
                          <UgoAvatar config={{ ...config, hairStyle: choice.value, headwear: "none", eyewear: "none", earAccessory: "none" }} className="h-11 w-11 shrink-0" label="" />
                          <span>{choice.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
                {config.hairStyle !== "bald" ? <ColorChoices label="Cor do cabelo" choices={avatarChoices.hairColor} value={config.hairColor} onSelect={(value) => patch("hairColor", value as AvatarHairColor)} customColor={{ label: "Escolher outra cor de cabelo", fallback: "#1CB0F6", onSelect: (value) => patch("hairColor", value) }} /> : null}
                {!(["bald", "buzz"] as string[]).includes(config.hairStyle) ? <TextChoices label="Comprimento" choices={avatarChoices.hairLength} value={config.hairLength} onSelect={(value) => patch("hairLength", value as AvatarConfig["hairLength"])} columns={3} /> : null}
              </>
            ) : null}

            {section === "outfit" ? (
              <>
                <fieldset>
                  <legend className="mb-3 text-xs font-black uppercase tracking-[.12em] text-slate-500">Escolha seu look</legend>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {avatarChoices.outfitType.map((choice) => {
                      const active = config.outfitType === choice.value;
                      return (
                        <button key={choice.value} type="button" aria-pressed={active} onClick={() => patch("outfitType", choice.value)} className={`flex items-center gap-2 rounded-2xl border-2 p-2 text-left text-[11px] font-black transition-all ${active ? "border-[#58a700] bg-[#d7ffb8] text-[#397300] shadow-[0_3px_0_#58a700]" : "border-slate-200 bg-white text-slate-600 shadow-[0_3px_0_#e2e8f0] hover:border-lime-300"}`}>
                          <UgoAvatar config={{ ...config, outfitType: choice.value, headwear: "none", eyewear: "none", earAccessory: "none" }} className="h-11 w-11 shrink-0" label="" />
                          <span>{choice.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
                <ColorChoices label="Cor da roupa" choices={avatarChoices.outfitColor} value={config.outfitColor} onSelect={(value) => patch("outfitColor", value as AvatarOutfitColor)} customColor={{ label: "Escolher outra cor de roupa", fallback: "#FF6B6B", onSelect: (value) => patch("outfitColor", value) }} />
                <TextChoices label="Broche" choices={avatarChoices.outfitAccessory} value={config.outfitAccessory} onSelect={(value) => selectOutfitAccessory(value as AvatarConfig["outfitAccessory"])} />
                {config.outfitAccessory === "animal_pin" ? (
                  <fieldset>
                    <legend className="mb-3 text-xs font-black uppercase tracking-[.12em] text-slate-500">Escolha o animal</legend>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {avatarChoices.animalPin.map((animal) => <button key={animal.value} type="button" aria-pressed={config.animalPin === animal.value} onClick={() => patch("animalPin", animal.value)} className={`${choiceButton(config.animalPin === animal.value)} flex items-center gap-2 text-left`}><AnimalPinBadge animal={animal.value} color={config.pinColor} className="h-9 w-9 shrink-0" /><span>{animal.label}</span></button>)}
                    </div>
                  </fieldset>
                ) : null}
                {config.outfitAccessory === "course_pin" && courses.length ? (
                  <fieldset>
                    <legend className="mb-3 text-xs font-black uppercase tracking-[.12em] text-slate-500">Escolha o curso</legend>
                    <div className="grid grid-cols-2 gap-2.5">
                      {courses.map((course) => <button key={course.id} type="button" aria-pressed={config.coursePin === course.name} onClick={() => patch("coursePin", course.name)} className={`${choiceButton(config.coursePin === course.name)} flex items-center gap-2 text-left`}><CoursePinBadge course={course.name} color={config.pinColor} className="h-9 w-9 shrink-0" /><span>{course.name}</span></button>)}
                    </div>
                  </fieldset>
                ) : null}
                {config.outfitAccessory !== "none" ? <ColorChoices label="Cor do broche" choices={avatarChoices.pinColor} value={config.pinColor} onSelect={(value) => patch("pinColor", value as AvatarPinColor)} customColor={{ label: "Escolher outra cor para o broche", fallback: "#FF4FA3", onSelect: (value) => patch("pinColor", value) }} /> : null}
              </>
            ) : null}

            {section === "extras" ? (
              <>
                <TextChoices label="Na cabeça" choices={avatarChoices.headwear} value={config.headwear} onSelect={(value) => patch("headwear", value as AvatarConfig["headwear"])} />
                <TextChoices label="Óculos" choices={avatarChoices.eyewear} value={config.eyewear} onSelect={(value) => patch("eyewear", value as AvatarConfig["eyewear"])} />
                <TextChoices label="Nas orelhas" choices={avatarChoices.earAccessory} value={config.earAccessory} onSelect={(value) => patch("earAccessory", value as AvatarConfig["earAccessory"])} />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
