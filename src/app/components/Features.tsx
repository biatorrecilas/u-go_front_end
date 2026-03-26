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
    icon: Shield,
    title: "Segurança de Dados",
    description:
      "Criptografia de ponta a ponta e proteção LGPD. Seus dados pessoais são totalmente privados e seguros.",
  },
  {
    icon: MapPin,
    title: "Rotas Inteligentes",
    description:
      "Veja rotas de pessoas próximas sem revelar identidades. Algoritmo inteligente conecta você com a melhor carona.",
  },
  {
    icon: Users,
    title: "Mulheres com Mulheres",
    description:
      "Opção exclusiva para mulheres se conectarem apenas com outras mulheres. Mais segurança e conforto.",
  },
  {
    icon: MessageCircle,
    title: "Chat Seguro",
    description:
      "Entre em contato para combinar detalhes da carona. Sistema de mensagens rápido e protegido.",
  },
  {
    icon: Leaf,
    title: "Impacto Sustentável",
    description:
      "Acompanhe quanto CO₂ você economizou. Contribua para um campus mais verde e consciente.",
  },
  {
    icon: Lock,
    title: "Privacidade Total",
    description:
      "Controle o que os outros veem. Você decide quando e com quem compartilhar suas informações.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tecnologia que conecta com segurança
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Recursos inovadores pensados para sua privacidade, segurança e
            sustentabilidade. Uma nova forma de compartilhar caronas.
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
              className="p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all bg-gradient-to-br from-white to-green-50/30"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}