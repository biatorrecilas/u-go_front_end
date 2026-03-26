import { Trophy, Award, Target, Zap, Heart, Sprout } from "lucide-react";
import { motion } from "motion/react";

const badges = [
  {
    icon: Sprout,
    name: "Eco Iniciante",
    description: "Primeira carona compartilhada",
    color: "from-green-400 to-emerald-500",
  },
  {
    icon: Heart,
    name: "Carona Solidária",
    description: "10 caronas oferecidas",
    color: "from-pink-400 to-rose-500",
  },
  {
    icon: Zap,
    name: "Relâmpago Verde",
    description: "Confirmou 50 caronas",
    color: "from-yellow-400 to-amber-500",
  },
  {
    icon: Target,
    name: "Pontual",
    description: "100% pontualidade",
    color: "from-blue-400 to-cyan-500",
  },
  {
    icon: Award,
    name: "Comunidade Ativa",
    description: "Membro há 6 meses",
    color: "from-purple-400 to-violet-500",
  },
  {
    icon: Trophy,
    name: "Eco Campeão",
    description: "Economizou 100kg de CO₂",
    color: "from-orange-400 to-red-500",
  },
];

export function Innovation() {
  return (
    <section id="innovation" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sistema de conquistas motivador
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sem estrelas ou comentários. Ganhe badges exclusivas por suas 
            ações positivas e construa uma reputação visual e gamificada.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${badge.color} rounded-2xl flex items-center justify-center mb-4 mx-auto transform hover:rotate-12 transition-transform`}
              >
                <badge.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                {badge.name}
              </h3>
              <p className="text-sm text-gray-600 text-center">
                {badge.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Innovation Features */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Rotas Anônimas
            </h3>
            <p className="text-gray-600 mb-4">
              Nosso algoritmo mostra apenas rotas e horários de pessoas que 
              passam perto de você, sem revelar nomes ou fotos até que ambas 
              as partes confirmem interesse. Privacidade em primeiro lugar.
            </p>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">
                  3 rotas próximas disponíveis
                </span>
              </div>
              <p className="text-xs text-gray-500 ml-6">
                Perfis revelados após conexão mútua
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Perfil Personalizado
            </h3>
            <p className="text-gray-600 mb-4">
              Crie seu perfil, exiba suas conquistas e badges. Quanto mais você 
              usa o app de forma positiva, mais reconhecimento visual você ganha. 
              Reputação transparente e motivadora.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Eco Campeão
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Pontual
              </div>
              <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                Comunidade
              </div>
              <div className="text-xs text-gray-500">+12 badges</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { Users, MapPin } from "lucide-react";
