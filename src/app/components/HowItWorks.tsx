import { EyeOff, Bell, UserCheck, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: EyeOff,
    number: "01",
    title: "Ofereça ou Encontre",
    description: "Como motorista, você publica a rota e as condições da viagem. Como passageiro, você busca uma carona compatível e vê somente as informações públicas.",
  },
  {
    icon: Bell,
    number: "02",
    title: "Passageiro Solicita",
    description: "O passageiro solicita uma vaga. O motorista recebe uma notificação, pode abrir o perfil de quem solicitou e decide se aprova ou recusa.",
  },
  {
    icon: UserCheck,
    number: "03",
    title: "Motorista Aprova",
    description: "Se o motorista aprovar, o passageiro recebe uma notificação, consulta o perfil do motorista e pode confirmar a vaga ou desistir.",
  },
  {
    icon: MessageCircle,
    number: "04",
    title: "Match Fechado!",
    description: "Só depois da dupla confirmação o match é fechado e os dois podem acessar o contato por WhatsApp.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Simples, rápido e feito para estudantes!
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Com a mesma conta, você pode oferecer uma carona como motorista ou buscar e solicitar uma vaga como passageiro. A dupla confirmação protege os dois lados antes da viagem.
          </p>
        </motion.div>

        <div className="relative">
          {/* Linha de conexão tech animada (apenas desktop) */}
          <div className="hidden lg:block absolute top-[3.5rem] left-[5%] right-[15%] h-[2px] bg-gray-100 z-0">
            <motion.div
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              className="h-full bg-green-300"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative z-10 flex flex-col group"
              >
                {/* Header do passo: Número gigante e Ícone, com fundo branco para quebrar a linha */}
                <div className="flex items-center gap-4 mb-6 bg-white pr-4 self-start">
                  <div className="text-5xl lg:text-6xl font-black text-green-300 tracking-tighter transition-transform duration-300 group-hover:scale-105 group-hover:text-green-400">
                    {step.number}
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gray-50 border border-gray-100 text-gray-400 shadow-sm transition-colors duration-300 group-hover:bg-green-50 group-hover:text-green-500 group-hover:border-green-200">
                    <step.icon size={24} strokeWidth={2} />
                  </div>
                </div>
                
                {/* Textos sem card em volta, visual limpo e direto */}
                <div className="pl-1 lg:pl-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
