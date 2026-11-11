import {
  Shield,
  Leaf,
  Users,
  Lock,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: MapPin,
    title: "Rotas Inteligentes",
    description:
      "Veja rotas de pessoas próximas sem revelar identidades. Algoritmo inteligente conecta você com a melhor carona.",
  },
  {
    icon: Leaf,
    title: "Impacto Sustentável",
    description:
      "Acompanhe quanto CO₂ você economizou. Contribua para um campus mais verde e consciente.",
  },
  {
    icon: Users,
    title: "Filtro por Preferências",
    description:
      "Opção exclusiva para mulheres se conectarem apenas com outras mulheres, inclui alternativa para homens também. Mais segurança e conforto.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tecnologia que Conecta com Segurança
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Recursos pensados para sua privacidade e sustentabilidade. Uma nova forma de compartilhar caronas.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all bg-gradient-to-br from-white to-green-50/30 flex items-start gap-5"
            >
              <feature.icon className="w-8 h-8 text-green-600 shrink-0 mt-0.5" />
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
