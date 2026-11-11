import React, { useState, useRef, useEffect } from "react";
import { Trophy, Award, Target, Zap, Heart, Sprout } from "lucide-react";
import { motion } from "motion/react";
import type { PlatformStats } from "../auth";

const badges = [
  {
    icon: Sprout,
    name: "Eco Iniciante",
    description: "Primeira carona compartilhada",
    color: "from-green-400 to-emerald-500",
    iconColor: "text-green-500",
  },
  {
    icon: Heart,
    name: "Carona Solidária",
    description: "Reconhecimento por oferecer caronas à comunidade",
    color: "from-pink-400 to-rose-500",
    iconColor: "text-pink-500",
  },
  {
    icon: Zap,
    name: "Relâmpago Verde",
    description: "Reconhecimento por confirmar caronas com agilidade",
    color: "from-yellow-400 to-amber-500",
    iconColor: "text-amber-500",
  },
  {
    icon: Target,
    name: "Pontual",
    description: "Reconhecimento por atitudes pontuais",
    color: "from-blue-400 to-cyan-500",
    iconColor: "text-cyan-500",
  },
  {
    icon: Award,
    name: "Comunidade Ativa",
    description: "Reconhecimento por participação contínua",
    color: "from-purple-400 to-violet-500",
    iconColor: "text-violet-500",
  },
  {
    icon: Trophy,
    name: "Eco Campeão",
    description: "Reconhecimento pelo impacto ambiental acumulado",
    color: "from-orange-400 to-red-500",
    iconColor: "text-red-500",
  },
];

// Tipagem para a partícula gerada
interface Particle {
  id: number;
  startX: number;
  midX: number;
  endX: number;
  targetY: number;
  duration: number;
  rotateStart: number;
  rotateEnd: number;
  scale: number;
}

function BadgeCard({ badge, index }: { badge: any; index: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Função para criar UMA nova partícula com trajetória aleatória
  const addParticle = () => {
    const startX = Math.random() * 240 - 120;
    const midX = startX + (Math.random() * 100 - 50);
    const endX = midX + (Math.random() * 120 - 60);

    const newParticle: Particle = {
      id: Date.now() + Math.random(), // ID único para o React não se perder
      startX,
      midX,
      endX,
      targetY: -(Math.random() * 200 + 400), // Vai subir entre 400px e 600px
      duration: Math.random() * 1.5 + 3, // Duração da subida (3 a 4.5 segundos)
      rotateStart: Math.random() * 60 - 30,
      rotateEnd: Math.random() * 180 - 90,
      scale: Math.random() * 0.4 + 0.6,
    };

    setParticles((prev) => [...prev, newParticle]);
  };

  // Inicia a chuva de ícones
  const startEmitting = () => {
    if (!intervalRef.current) {
      addParticle(); // Dispara um imediatamente (bom para cliques rápidos no mobile)
      // Dispara um novo a cada 200ms enquanto estiver segurando/com mouse em cima
      intervalRef.current = setInterval(addParticle, 200); 
    }
  };

  // Para a criação de novos ícones
  const stopEmitting = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Remove a partícula do array (e da tela) assim que a animação dela acaba
  const handleAnimationComplete = (id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  // Limpa o timer caso o componente saia da tela por algum motivo
  useEffect(() => {
    return () => stopEmitting();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      // Se houver partículas na tela, joga o z-index pra 50 pra passarem por cima dos outros cards
      className={`relative group cursor-pointer ${particles.length > 0 ? "z-50" : "z-10"}`}
      
      // Eventos Desktop
      onMouseEnter={startEmitting}
      onMouseLeave={stopEmitting}
      // Eventos Mobile
      onTouchStart={startEmitting}
      onTouchEnd={stopEmitting}
      onTouchCancel={stopEmitting}
    >
      {/* Container das partículas - pointer-events-none para não bugar o hover do mouse */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className={`absolute ${badge.iconColor}`}
            initial={{ opacity: 0, y: 80, x: p.startX, scale: p.scale * 0.5 }}
            animate={{
              opacity: [0, 1, 0.8, 0],
              y: [80, p.targetY],
              x: [p.startX, p.midX, p.endX],
              scale: [p.scale * 0.5, p.scale, p.scale * 0.8],
              rotate: [p.rotateStart, p.rotateEnd],
            }}
            transition={{
              duration: p.duration,
              ease: "easeOut",
            }}
            // Dispara a função de destruição quando termina de subir
            onAnimationComplete={() => handleAnimationComplete(p.id)}
          >
            <badge.icon className="w-8 h-8 drop-shadow-sm" />
          </motion.div>
        ))}
      </div>

      {/* Card Principal */}
      <div className="relative z-10 bg-white p-6 rounded-xl shadow-md group-hover:shadow-xl transition-all border border-gray-100 h-full">
        <div
          className={`w-16 h-16 bg-gradient-to-br ${badge.color} rounded-2xl flex items-center justify-center mb-4 mx-auto transform group-hover:rotate-12 transition-transform`}
        >
          <badge.icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 text-center mb-2">
          {badge.name}
        </h3>
        <p className="text-sm text-gray-600 text-center">
          {badge.description}
        </p>
      </div>
    </motion.div>
  );
}

export function Innovation({ stats }: { stats: PlatformStats | null }) {
  return (
    <section
      id="innovation"
      className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-green-50 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative z-20"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Aqui as Conquistas são Reconhecidas!
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Sem estrelas ou comentários. Ganhe badges exclusivas por suas ações
            positivas e construa uma reputação visual e gamificada.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {badges.map((badge, index) => (
            <BadgeCard key={badge.name} badge={badge} index={index} />
          ))}
        </div>

        {/* Innovation Features */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-2xl shadow-lg relative z-20"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Perfil Personalizado
            </h3>
            <p className="text-gray-600 mb-4">
              Crie seu perfil, exiba suas conquistas e badges. Quanto mais você
              usa o app de forma positiva, mais reconhecimento visual você
              ganha. Reputação transparente e motivadora.
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
              <div className="text-xs text-gray-500">
                {stats ? `${stats.badge_feedback_count} reconhecimentos registrados` : "Dados sendo atualizados"}
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-2xl shadow-lg relative z-20"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Rotas Anônimas
            </h3>
            <p className="text-gray-600 mb-4">
              Nosso algoritmo mostra apenas rotas e horários de pessoas que
              passam perto de você, sem revelar nomes ou fotos até que ambas as
              partes confirmem interesse. Privacidade em primeiro lugar.
            </p>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">
                  {stats ? `${stats.active_rides} caronas ativas disponíveis` : "Caronas ativas sendo carregadas"}
                </span>
              </div>
              <p className="text-xs text-gray-500 ml-6">
                Perfis revelados após conexão mútua
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
