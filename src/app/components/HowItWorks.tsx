import { UserPlus, Search, Car, Star } from "lucide-react";
import { motion } from "motion/react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Cadastre-se",
    description:
      "Crie sua conta com seu e-mail universitário e complete seu perfil em minutos.",
  },
  {
    icon: Search,
    number: "02",
    title: "Busque ou Ofereça",
    description:
      "Procure caronas disponíveis ou ofereça lugares vazios no seu carro.",
  },
  {
    icon: Car,
    number: "03",
    title: "Confirme a Viagem",
    description:
      "Conecte-se com colegas, combine detalhes e confirme sua carona.",
  },
  {
    icon: Star,
    number: "04",
    title: "Avalie",
    description:
      "Após a viagem, avalie sua experiência e ajude a comunidade a crescer.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Como funciona?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Começar a usar o U-Go é simples e rápido. Siga estes passos e
            comece a economizar hoje mesmo.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full">
                <div className="text-5xl font-bold text-blue-100 mb-4">
                  {step.number}
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-200" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
