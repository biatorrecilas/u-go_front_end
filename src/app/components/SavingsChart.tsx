import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Leaf, Fuel, Check, User, X, Clock } from "lucide-react";

// Adicionamos mais itens e redistribuímos os ângulos (0 a 360) em cada órbita
const orbitItems = [
  // Órbita 1 (Interna - Raio 100) -> Serão menores
  { id: "savings", icon: <DollarSign />, label: "Economia Mensal", desc: "Redução direta nos custos mensais de transporte dividindo gastos.", color: "bg-[#00c950]", radius: 100, angle: 0, duration: 25 },
  { id: "u1", isUser: true, color: "bg-[#ff6b81]", label: "Comunidade Ativa", desc: "Mais de 1.200 conexões feitas nesta região hoje.", radius: 100, angle: 120, duration: 25 },
  { id: "u4", isUser: true, color: "bg-[#ffd32a]", label: "Avaliações Positivas", desc: "98% das caronas recebem nota máxima de segurança.", radius: 100, angle: 240, duration: 25 }, // NOVO
  
  // Órbita 2 (Intermediária - Raio 170)
  { id: "co2", icon: <Leaf />, label: "Sustentabilidade", desc: "Equivalente a plantar 3 árvores novas todos os meses.", color: "bg-[#2e74ff]", radius: 170, angle: 90, duration: 35 },
  { id: "u2", isUser: true, color: "bg-[#ff9f43]", label: "Segurança Verificada", desc: "Todos os usuários passam por checagem rigorosa de perfil.", radius: 170, angle: 210, duration: 35 },
  { id: "time", icon: <Clock />, label: "Tempo Salvo", desc: "Rotas otimizadas reduzem o tempo no trânsito em até 20%.", color: "bg-[#0fb9b1]", radius: 170, angle: 330, duration: 35 }, // NOVO
  
  // Órbita 3 (Externa - Raio 240)
  { id: "fuel", icon: <Fuel />, label: "Menos Combustível", desc: "Economia de aproximadamente 1 tanque cheio por mês.", color: "bg-[#a55eea]", radius: 240, angle: 45, duration: 45 },
  { id: "u3", isUser: true, color: "bg-[#70a1ff]", label: "Networking", desc: "Transforme seu tempo de trânsito em conexões valiosas.", radius: 240, angle: 165, duration: 45 },
  { id: "u5", isUser: true, color: "bg-[#f368e0]", label: "Menos Trânsito", desc: "Cada carro compartilhado retira até 3 veículos da rua.", radius: 240, angle: 285, duration: 45 }, // NOVO
];

export function SavingsChart() {
  const [selectedItem, setSelectedItem] = useState<typeof orbitItems[0] | null>(null);

  return (
    <section className="pt-16 pb-8 md:pt-24 md:pb-5 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* LADO ESQUERDO: TEXTO E DETALHES */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full text-center lg:text-left"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#111827] mb-4 leading-tight">
              Economia real para <br />
              <span className="text-[#00a859]">você e o planeta</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Acompanhe o impacto positivo das suas caronas compartilhadas. 
              Clique nos ícones da rede para descobrir como cada conexão contribui.
            </p>

            <div className="h-[120px] max-w-md mx-auto lg:mx-0">
              <AnimatePresence mode="wait">
                {selectedItem && (
                  <motion.div
                    key={selectedItem.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative bg-[#f8fafc] rounded-xl border border-gray-200 p-6 shadow-md flex items-start overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#00a859] rounded-l-xl" />
                    
                    <div className="flex-1 pl-2 text-left">
                      <h4 className="font-bold text-gray-900 text-[15px] mb-1">
                        {selectedItem.label}
                      </h4>
                      <p className="text-gray-600 text-[14px] leading-relaxed">
                        {selectedItem.desc}
                      </p>
                    </div>

                    <button 
                      onClick={() => setSelectedItem(null)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* LADO DIREITO: ÓRBITA */}
          <div className="flex-1 relative flex items-center justify-center h-[550px] w-full max-w-[550px]">
            
            {/* Linhas de Fundo */}
            <div className="absolute w-[200px] h-[200px] border border-gray-100 rounded-full" />
            <div className="absolute w-[340px] h-[340px] border border-gray-100 rounded-full" />
            <div className="absolute w-[480px] h-[480px] border border-gray-100 rounded-full" />

            {/* Badge Central (Selo Nuvem) */}
            <motion.div 
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-30 w-32 h-32 flex items-center justify-center"
            >
              <svg 
                viewBox="0 0 120 120" 
                className="absolute inset-0 w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)]"
              >
                <path 
                  d="M60,5 C66.5,5 71,11 76.5,13.5 C82,16 89.5,14.5 94,19 C98.5,23.5 97,31 99.5,36.5 C102,42 108,46.5 108,53 C108,59.5 102,64 99.5,69.5 C97,75 98.5,82.5 94,87 C89.5,91.5 82,90 76.5,92.5 C71,95 66.5,101 60,101 C53.5,101 49,95 43.5,92.5 C38,90 30.5,91.5 26,87 C21.5,82.5 23,75 20.5,69.5 C18,64 12,59.5 12,53 C12,46.5 18,42 20.5,36.5 C23,31 21.5,23.5 26,19 C30.5,14.5 38,16 43.5,13.5 C49,11 53.5,5 60,5 Z" 
                  fill="#ffffff"
                  stroke="#e2e8f0"
                  strokeWidth="0.5" 
                />
              </svg>
              <Check className="relative z-10 w-12 h-12 text-[#00a859] stroke-[4]" />
            </motion.div>

            {/* Itens Orbitais */}
            {orbitItems.map((item) => {
              // Lógica para deixar a menor órbita (raio 100) menor
              const isSmallOrbit = item.radius === 100;
              const sizeClass = item.isUser
                ? (isSmallOrbit ? "w-[34px] h-[34px]" : "w-[42px] h-[42px]")
                : (isSmallOrbit ? "w-[42px] h-[42px]" : "w-[52px] h-[52px]");
              
              // Tamanho do ícone interno também diminui
              const iconSizeClass = isSmallOrbit ? "w-4 h-4" : "w-5 h-5";
              const userIconSize = isSmallOrbit ? 16 : 20;

              return (
                <motion.div
                  key={item.id}
                  className="absolute pointer-events-none z-40 rounded-full"
                  style={{ width: item.radius * 2, height: item.radius * 2 }}
                  initial={{ rotate: item.angle }}
                  animate={{ rotate: item.angle + 360 }}
                  transition={{ duration: item.duration, repeat: Infinity, ease: "linear" }}
                >
                  <motion.button
                    onClick={() => setSelectedItem(item)}
                    whileHover={{ scale: 1.15 }}
                    initial={{ rotate: -item.angle }}
                    animate={{ rotate: -(item.angle + 360) }}
                    transition={{ duration: item.duration, repeat: Infinity, ease: "linear" }}
                    className={`
                      absolute pointer-events-auto cursor-pointer shadow-lg border-4 border-white rounded-full
                      flex items-center justify-center transition-shadow
                      ${item.color}
                      ${selectedItem?.id === item.id ? 'ring-4 ring-emerald-100 ring-offset-2 scale-110' : ''}
                      ${sizeClass}
                    `}
                    style={{
                      left: "50%",
                      top: 0,
                      x: "-50%",
                      y: "-50%",
                    }}
                  >
                    <div className="text-white flex items-center justify-center [&>svg]:!m-0">
                      {/* Controlamos o tamanho do ícone baseado na órbita */}
                      {item.isUser ? (
                        <User size={userIconSize} fill="currentColor" strokeWidth={1} />
                      ) : (
                        <div className={iconSizeClass}>
                           {/* Clona o ícone para passar as novas classes dinamicamente */}
                           {React.cloneElement(item.icon as React.ReactElement, { className: 'w-full h-full' })}
                        </div>
                      )}
                    </div>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}