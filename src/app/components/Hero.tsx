import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { PlatformStats } from "../auth";

const formatCount = (value: number | undefined, maximumFractionDigits = 0) => value === undefined
  ? "—"
  : new Intl.NumberFormat("pt-BR", { maximumFractionDigits }).format(value);

export function Hero({ stats }: { stats: PlatformStats | null }) {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 sm:mb-6 leading-tight">
              Caronas universitárias{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">inteligentes</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-7 leading-relaxed">
              Conecte-se com colegas da sua universidade, economize dinheiro e
              ajude o meio ambiente. A forma mais fácil de compartilhar caronas
              no campus.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-6" aria-label="Números atuais da comunidade U-Go">
              <div className="min-w-0 text-center">
                <div className="text-xl font-bold text-gray-900 sm:text-2xl">{formatCount(stats?.active_users)}</div>
                <div className="text-xs text-gray-600 sm:text-sm">Usuários ativos</div>
              </div>
              <div className="min-w-0 text-center">
                <div className="text-xl font-bold text-gray-900 sm:text-2xl">{formatCount(stats?.completed_rides)}</div>
                <div className="text-xs text-gray-600 sm:text-sm">Caronas concluídas</div>
              </div>
              <div className="min-w-0 text-center">
                <div className="text-xl font-bold text-gray-900 sm:text-2xl">{formatCount(stats?.co2_saved_kg, 1)} kg</div>
                <div className="text-xs text-gray-600 sm:text-sm">CO₂ evitado</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1561065475-b0dc9f889ee7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGNvbGxlZ2UlMjBzdHVkZW50cyUyMGNhciUyMHNoYXJpbmd8ZW58MXx8fHwxNzczMzM3ODAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Estudantes universitários compartilhando carona"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute bottom-3 left-3 bg-white p-4 rounded-xl shadow-lg sm:-bottom-6 sm:-left-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                  ✓
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Carona confirmada!
                  </div>
                  <div className="text-sm text-gray-600">
                    Contato liberado após confirmação mútua
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
