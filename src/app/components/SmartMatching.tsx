import { motion } from "framer-motion";
import { Sparkles, Route, MapPin, Users, CheckCircle2, Navigation, Clock } from "lucide-react";
import { Link } from "react-router";

export function SmartMatching() {
  return (
    <section className="py-16 md:py-24  relative overflow-hidden">
  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Coluna de Texto (Venda do Benefício) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6 font-medium text-sm">
              <Sparkles className="w-4 h-4" />
              Recomendação Inteligente
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-5 leading-tight">
              O match perfeito para o seu trajeto universitário
            </h2>
            
            <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
              Nosso algoritmo inteligente analisa cruzamentos de rotas, horários e preferências para conectar você a pessoas que fazem caminhos como o seu.
            </p>

            

            <Link
              to="/caronas"
              // Substitua o bg-gray-900 por este gradiente:
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-green-500/25"
            >
              Encontrar Carona
            </Link>
          </motion.div>

          {/* Coluna Visual (Simulação de Match) */}
          <div className="relative h-[500px] w-full flex items-center justify-center">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-gradient-to-r from-green-300 to-emerald-400 rounded-full opacity-30 blur-3xl animate-slow-spin pointer-events-none"></div>
            
            {/* Card do Motorista (Fundo) */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: -5 }}
              whileInView={{ opacity: 1, y: 0, rotate: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute bg-white p-5 rounded-2xl shadow-xl border border-gray-100 w-72 z-10 -ml-20 -mt-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm">MB</div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold uppercase">Motorista</div>
                  <div className="text-sm font-bold text-gray-900">Marta Batista</div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" /> Centro, Campinas
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Navigation className="w-4 h-4 text-green-500" /> USF Sagrado
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">07:30</span>
                <span className="font-bold text-gray-900">3 Vagas</span>
              </div>
            </motion.div>

            {/* Ícone de Conexão no Meio */}
            

            {/* Card do Passageiro (Frente) */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: 5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute bg-white p-5 rounded-2xl shadow-2xl border border-green-100 w-72 z-20 ml-20 mt-16"
            >
              <div className="absolute -top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Alta compatibilidade
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">JP</div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold uppercase">Você (Buscando)</div>
                  <div className="text-sm font-bold text-gray-900">João Paulo</div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" /> Av. Brasil, Campinas
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Navigation className="w-4 h-4 text-green-500" /> USF Sagrado
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-medium">Chegar 08:00</span>
                <span className="font-bold text-gray-900">R$ 5,00</span>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
