import { motion } from "motion/react";
import { MapPin, Users, Clock, TrendingUp, Navigation } from "lucide-react";

const routes = [
  {
    id: 1,
    from: "Centro - Campinas",
    to: "USF Sagrado",
    users: 24,
    frequency: "15 min",
    popular: true,
    distance: "12 km",
  },
  {
    id: 2,
    from: "Shopping Iguatemi",
    to: "USF Sagrado",
    users: 18,
    frequency: "20 min",
    popular: true,
    distance: "8 km",
  },
  {
    id: 3,
    from: "Taquaral",
    to: "USF Sagrado",
    users: 15,
    frequency: "25 min",
    popular: false,
    distance: "10 km",
  },
  {
    id: 4,
    from: "Cambuí",
    to: "USF Sagrado",
    users: 12,
    frequency: "18 min",
    popular: false,
    distance: "11 km",
  },
  {
    id: 5,
    from: "Valinhos",
    to: "USF Sagrado",
    users: 10,
    frequency: "30 min",
    popular: false,
    distance: "18 km",
  },
  {
    id: 6,
    from: "Americana",
    to: "USF Sagrado",
    users: 8,
    frequency: "45 min",
    popular: false,
    distance: "35 km",
  },
];

export function RouteMap() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Rotas para a USF Sagrado - Campinas e região
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra as rotas mais utilizadas pela nossa comunidade universitária
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-green-600" />
              Mapa de Rotas Convergentes
            </h3>
            <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl overflow-hidden h-96 border-2 border-green-200">
              {/* Map visualization */}
              <svg className="w-full h-full" viewBox="0 0 400 400">
                {/* Background grid */}
                <defs>
                  <pattern
                    id="route-grid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="#d1fae5"
                      strokeWidth="0.5"
                    />
                  </pattern>
                  <radialGradient id="route-centerGlow">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="400" height="400" fill="url(#route-grid)" />
                
                {/* Glow effect around university */}
                <circle cx="200" cy="200" r="60" fill="url(#route-centerGlow)" />

                {/* Route lines - all converging to center (USF Sagrado) */}
                {/* Route 1 - From top left (Centro) */}
                <line
                  x1="50"
                  y1="50"
                  x2="200"
                  y2="200"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray="8,4"
                  className="animate-pulse"
                />
                
                {/* Route 2 - From top right (Iguatemi) */}
                <line
                  x1="330"
                  y1="80"
                  x2="200"
                  y2="200"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray="8,4"
                  className="animate-pulse"
                  style={{ animationDelay: "0.3s" }}
                />
                
                {/* Route 3 - From right (Taquaral) */}
                <line
                  x1="350"
                  y1="200"
                  x2="200"
                  y2="200"
                  stroke="#059669"
                  strokeWidth="3"
                  strokeDasharray="6,3"
                />
                
                {/* Route 4 - From bottom right (Cambuí) */}
                <line
                  x1="320"
                  y1="320"
                  x2="200"
                  y2="200"
                  stroke="#059669"
                  strokeWidth="3"
                  strokeDasharray="6,3"
                  style={{ animationDelay: "0.6s" }}
                />
                
                {/* Route 5 - From bottom (Valinhos) */}
                <line
                  x1="200"
                  y1="360"
                  x2="200"
                  y2="200"
                  stroke="#047857"
                  strokeWidth="2.5"
                  strokeDasharray="5,3"
                />
                
                {/* Route 6 - From bottom left (Americana) */}
                <line
                  x1="40"
                  y1="340"
                  x2="200"
                  y2="200"
                  stroke="#047857"
                  strokeWidth="2.5"
                  strokeDasharray="5,3"
                />

                {/* Location markers */}
                {/* Centro */}
                <circle cx="50" cy="50" r="8" fill="#10b981" stroke="white" strokeWidth="2" />
                
                {/* Iguatemi */}
                <circle cx="330" cy="80" r="8" fill="#10b981" stroke="white" strokeWidth="2" />
                
                {/* Taquaral */}
                <circle cx="350" cy="200" r="7" fill="#059669" stroke="white" strokeWidth="2" />
                
                {/* Cambuí */}
                <circle cx="320" cy="320" r="7" fill="#059669" stroke="white" strokeWidth="2" />
                
                {/* Valinhos */}
                <circle cx="200" cy="360" r="6" fill="#047857" stroke="white" strokeWidth="2" />
                
                {/* Americana */}
                <circle cx="40" cy="340" r="6" fill="#047857" stroke="white" strokeWidth="2" />

                {/* University center (USF Sagrado) - pulsing */}
                <circle cx="200" cy="200" r="20" fill="#10b981" stroke="#065f46" strokeWidth="3">
                  <animate
                    attributeName="r"
                    values="20;24;20"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx="200" cy="200" r="12" fill="white" opacity="0.9" />
                
                {/* Labels */}
                <text x="200" y="205" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#065f46">
                  USF Sagrado
                </text>
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-0.5 bg-green-500"></div>
                  <span className="text-gray-700">Rotas ativas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Destino (USF Sagrado)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-gray-600">Rotas em tempo real</span>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+12% esta semana</span>
              </div>
            </div>
          </motion.div>

          {/* Routes List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {routes.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`bg-white p-4 rounded-xl border ${
                  route.popular
                    ? "border-green-300 shadow-md"
                    : "border-gray-200 shadow-sm"
                } hover:shadow-lg transition-all`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-gray-900">
                        {route.from}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="font-semibold text-green-700">
                        {route.to}
                      </span>
                      {route.popular && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{route.users} usuários</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{route.frequency}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Navigation className="w-4 h-4" />
                        <span>{route.distance}</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all">
                    Ver
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}