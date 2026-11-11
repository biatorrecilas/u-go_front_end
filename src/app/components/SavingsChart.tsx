import { cloneElement, useState, type ReactElement } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Clock, DollarSign, Fuel, Leaf, User, X } from "lucide-react";
import type { PlatformStats } from "../auth";

interface OrbitItem {
  id: string;
  icon?: ReactElement;
  isUser?: boolean;
  color: string;
  label: string;
  desc: string;
  radius: number;
  angle: number;
  duration: number;
}

const formatMetric = (value: number | undefined, maximumFractionDigits = 0) => (
  value === undefined
    ? "—"
    : new Intl.NumberFormat("pt-BR", { maximumFractionDigits }).format(value)
);

const buildOrbitItems = (stats: PlatformStats | null): OrbitItem[] => [
  // Órbita interna
  {
    id: "savings",
    icon: <DollarSign />,
    label: "Economia Compartilhada",
    desc: "Dividir o trajeto ajuda motoristas e passageiros a reduzirem seus custos de transporte.",
    color: "bg-[#00c950]",
    radius: 100,
    angle: 0,
    duration: 25,
  },
  {
    id: "u1",
    isUser: true,
    color: "bg-[#ff6b81]",
    label: "Comunidade Ativa",
    desc: `${formatMetric(stats?.active_users)} usuários ativos com e-mail institucional verificado.`,
    radius: 100,
    angle: 120,
    duration: 25,
  },
  {
    id: "u4",
    isUser: true,
    color: "bg-[#ffd32a]",
    label: "Boas Atitudes",
    desc: `${formatMetric(stats?.badge_feedback_count)} reconhecimentos por badges registrados após caronas concluídas.`,
    radius: 100,
    angle: 240,
    duration: 25,
  },

  // Órbita intermediária
  {
    id: "co2",
    icon: <Leaf />,
    label: "Sustentabilidade",
    desc: `${formatMetric(stats?.co2_saved_kg, 1)} kg de CO₂ potencialmente evitados pela comunidade.`,
    color: "bg-[#2e74ff]",
    radius: 170,
    angle: 90,
    duration: 35,
  },
  {
    id: "u2",
    isUser: true,
    color: "bg-[#ff9f43]",
    label: "Segurança Verificada",
    desc: `${formatMetric(stats?.active_users)} contas ativas passaram pela validação do e-mail institucional.`,
    radius: 170,
    angle: 210,
    duration: 35,
  },
  {
    id: "time",
    icon: <Clock />,
    label: "Caronas Disponíveis",
    desc: `${formatMetric(stats?.active_rides)} caronas ativas estão disponíveis para novos matches.`,
    color: "bg-[#0fb9b1]",
    radius: 170,
    angle: 330,
    duration: 35,
  },

  // Órbita externa
  {
    id: "fuel",
    icon: <Fuel />,
    label: "Menos Deslocamentos",
    desc: `${formatMetric(stats?.shared_distance_km, 1)} km já foram compartilhados em caronas concluídas.`,
    color: "bg-[#a55eea]",
    radius: 240,
    angle: 45,
    duration: 45,
  },
  {
    id: "u3",
    isUser: true,
    color: "bg-[#70a1ff]",
    label: "Conexões Reais",
    desc: `${formatMetric(stats?.confirmed_matches)} matches foram confirmados por motoristas e passageiros.`,
    radius: 240,
    angle: 165,
    duration: 45,
  },
  {
    id: "u5",
    isUser: true,
    color: "bg-[#f368e0]",
    label: "Mobilidade Coletiva",
    desc: `${formatMetric(stats?.completed_rides)} caronas compartilhadas já foram concluídas.`,
    radius: 240,
    angle: 285,
    duration: 45,
  },
];

export function SavingsChart({ stats }: { stats: PlatformStats | null }) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const orbitItems = buildOrbitItems(stats);
  const selectedItem = orbitItems.find((item) => item.id === selectedItemId) ?? null;

  return (
    <section className="overflow-hidden bg-white pb-8 pt-16 md:pb-5 md:pt-24" aria-labelledby="savings-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full flex-1 text-center lg:text-left"
          >
            <h2 id="savings-title" className="mb-4 text-3xl font-bold leading-tight text-[#111827] sm:text-4xl">
              Economia real para <br />
              <span className="text-[#00a859]">você e o planeta</span>
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg lg:mx-0">
              Acompanhe o impacto positivo das caronas compartilhadas.
              Clique nos ícones da rede para ver os indicadores reais da comunidade.
            </p>

            <div className="mx-auto h-[120px] max-w-md lg:mx-0" aria-live="polite">
              <AnimatePresence mode="wait">
                {selectedItem && (
                  <motion.div
                    key={selectedItem.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative flex items-start overflow-hidden rounded-xl border border-gray-200 bg-[#f8fafc] p-6 shadow-md"
                  >
                    <div className="absolute bottom-0 left-0 top-0 w-1.5 rounded-l-xl bg-[#00a859]" />
                    <div className="flex-1 pl-2 text-left">
                      <h3 className="mb-1 text-[15px] font-bold text-gray-900">{selectedItem.label}</h3>
                      <p className="text-[14px] leading-relaxed text-gray-600">{selectedItem.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedItemId(null)}
                      className="absolute right-3 top-3 text-gray-400 transition-colors hover:text-gray-600"
                      aria-label="Fechar detalhe do indicador"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="relative flex h-[360px] w-full flex-1 items-center justify-center sm:h-[550px]">
            <div className="relative flex h-[550px] w-[550px] shrink-0 scale-[0.62] items-center justify-center sm:scale-100">
              <div className="absolute h-[200px] w-[200px] rounded-full border border-gray-100" />
              <div className="absolute h-[340px] w-[340px] rounded-full border border-gray-100" />
              <div className="absolute h-[480px] w-[480px] rounded-full border border-gray-100" />

              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-30 flex h-32 w-32 items-center justify-center"
              >
                <svg
                  viewBox="0 0 120 120"
                  className="absolute inset-0 h-full w-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)]"
                  aria-hidden="true"
                >
                  <path
                    d="M60,5 C66.5,5 71,11 76.5,13.5 C82,16 89.5,14.5 94,19 C98.5,23.5 97,31 99.5,36.5 C102,42 108,46.5 108,53 C108,59.5 102,64 99.5,69.5 C97,75 98.5,82.5 94,87 C89.5,91.5 82,90 76.5,92.5 C71,95 66.5,101 60,101 C53.5,101 49,95 43.5,92.5 C38,90 30.5,91.5 26,87 C21.5,82.5 23,75 20.5,69.5 C18,64 12,59.5 12,53 C12,46.5 18,42 20.5,36.5 C23,31 21.5,23.5 26,19 C30.5,14.5 38,16 43.5,13.5 C49,11 53.5,5 60,5 Z"
                    fill="#ffffff"
                    stroke="#e2e8f0"
                    strokeWidth="0.5"
                  />
                </svg>
                <Check className="relative z-10 h-12 w-12 stroke-[4] text-[#00a859]" />
              </motion.div>

              {orbitItems.map((item) => {
                const isSmallOrbit = item.radius === 100;
                const sizeClass = item.isUser
                  ? (isSmallOrbit ? "h-[34px] w-[34px]" : "h-[42px] w-[42px]")
                  : (isSmallOrbit ? "h-[42px] w-[42px]" : "h-[52px] w-[52px]");
                const iconSizeClass = isSmallOrbit ? "h-4 w-4" : "h-5 w-5";
                const userIconSize = isSmallOrbit ? 16 : 20;

                return (
                  <motion.div
                    key={item.id}
                    className="pointer-events-none absolute z-40 rounded-full"
                    style={{ width: item.radius * 2, height: item.radius * 2 }}
                    initial={{ rotate: item.angle }}
                    animate={{ rotate: item.angle + 360 }}
                    transition={{ duration: item.duration, repeat: Infinity, ease: "linear" }}
                  >
                    <motion.button
                      type="button"
                      onClick={() => setSelectedItemId(item.id)}
                      whileHover={{ scale: 1.15 }}
                      initial={{ rotate: -item.angle }}
                      animate={{ rotate: -(item.angle + 360) }}
                      transition={{ duration: item.duration, repeat: Infinity, ease: "linear" }}
                      className={`
                        pointer-events-auto absolute flex cursor-pointer items-center justify-center rounded-full
                        border-4 border-white shadow-lg transition-shadow ${item.color} ${sizeClass}
                        ${selectedItemId === item.id ? "scale-110 ring-4 ring-emerald-100 ring-offset-2" : ""}
                      `}
                      style={{ left: "50%", top: 0, x: "-50%", y: "-50%" }}
                      aria-label={`${item.label}: ${item.desc}`}
                    >
                      <div className="flex items-center justify-center text-white [&>svg]:!m-0">
                        {item.isUser ? (
                          <User size={userIconSize} fill="currentColor" strokeWidth={1} />
                        ) : item.icon ? (
                          <div className={iconSizeClass}>
                            {cloneElement(item.icon, { className: "h-full w-full" })}
                          </div>
                        ) : null}
                      </div>
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
