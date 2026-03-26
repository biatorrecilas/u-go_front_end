import { motion } from "motion/react";
import { TrendingDown, DollarSign, Leaf, Fuel } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { id: 1, month: "Jan", economia: 120, co2: 15 },
  { id: 2, month: "Fev", economia: 180, co2: 22 },
  { id: 3, month: "Mar", economia: 240, co2: 30 },
  { id: 4, month: "Abr", economia: 320, co2: 40 },
  { id: 5, month: "Mai", economia: 450, co2: 56 },
  { id: 6, month: "Jun", economia: 580, co2: 72 },
];

export function SavingsChart() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Economia real para você e o planeta
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Acompanhe o impacto positivo das suas caronas compartilhadas
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">R$ 580</div>
                <div className="text-sm text-gray-600">Economizado em Junho</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>28% mais que Maio</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">72 kg</div>
                <div className="text-sm text-gray-600">CO₂ evitado</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-blue-600 text-sm">
              <Leaf className="w-4 h-4" />
              <span>= 3 árvores plantadas</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Fuel className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">45 L</div>
                <div className="text-sm text-gray-600">Combustível economizado</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-purple-600 text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>≈ 1 tanque cheio</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-gray-50 to-green-50/30 p-8 rounded-2xl border border-gray-200"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Evolução da Economia (Últimos 6 meses)
          </h3>
          <div className="h-80" style={{ minHeight: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEconomia" x1="0" y1="0" x2="0" y2="1">
                    <stop key="stop-start" offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop key="stop-end" offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                  }}
                />
                <Area
                  key="area-economia"
                  type="monotone"
                  dataKey="economia"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEconomia)"
                  name="Economia (R$)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            💰 Economia total acumulada: <span className="font-semibold text-green-600">R$ 1.890</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}