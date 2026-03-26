import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { motion } from "motion/react";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign,
  Shield,
  Sparkles,
  Navigation,
  User,
  Star,
  TrendingUp,
  Filter,
  Search,
  Check,
  Car,
  Bike,
  Truck,
  Bus
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import React from "react";

// Mock data - caronas disponíveis
const availableRides = [
  {
    id: 1,
    driver: "Motorista Anônimo",
    driverInitials: "MA",
    from: "Centro - Campinas",
    to: "USF Sagrado",
    date: "2026-03-21",
    time: "07:30",
    vehicleType: "car",
    vehicleModel: "Honda Fit 2022",
    licensePlate: "ABC1D23",
    totalSeats: 4,
    availableSeats: [1, 3],
    occupiedSeats: [2, 4],
    price: 5.00,
    distance: "12 km",
    duration: "25 min",
    womenOnly: false,
    recurring: ["seg", "qua", "sex"],
    badges: ["eco-warrior", "punctual"],
    rating: 4.8,
    trips: 45,
    notes: "Ponto de encontro: em frente ao Parque Portugal",
    whatsapp: "19999999999",
    recommended: true,
    matchScore: 95,
  },
  {
    id: 2,
    driver: "Motorista Anônimo",
    driverInitials: "MB",
    from: "Shopping Iguatemi",
    to: "USF Sagrado",
    date: "2026-03-21",
    time: "07:45",
    vehicleType: "suv",
    vehicleModel: "Chevrolet Spin 2021",
    licensePlate: "DEF4G56",
    totalSeats: 6,
    availableSeats: [2, 4, 5],
    occupiedSeats: [1, 3, 6],
    price: 4.50,
    distance: "8 km",
    duration: "18 min",
    womenOnly: true,
    recurring: ["seg", "ter", "qua", "qui", "sex"],
    badges: ["green-champion", "friendly"],
    rating: 4.9,
    trips: 78,
    notes: "Carona exclusiva para mulheres. Música ambiente.",
    whatsapp: "19988888888",
    recommended: true,
    matchScore: 88,
  },
  {
    id: 3,
    driver: "Motorista Anônimo",
    driverInitials: "MC",
    from: "Taquaral",
    to: "USF Sagrado",
    date: "2026-03-21",
    time: "08:00",
    vehicleType: "car",
    vehicleModel: "Hyundai HB20 2020",
    licensePlate: "GHI7J89",
    totalSeats: 4,
    availableSeats: [3],
    occupiedSeats: [1, 2, 4],
    price: 6.00,
    distance: "10 km",
    duration: "22 min",
    womenOnly: false,
    recurring: ["seg", "qua"],
    badges: ["reliable"],
    rating: 4.7,
    trips: 32,
    notes: "Ar-condicionado sempre ligado",
    whatsapp: "19977777777",
    recommended: false,
    matchScore: 72,
  },
  {
    id: 4,
    driver: "Motorista Anônimo",
    driverInitials: "MD",
    from: "Cambuí",
    to: "USF Sagrado",
    date: "2026-03-21",
    time: "07:15",
    vehicleType: "motorcycle",
    vehicleModel: "Yamaha Fazer 250",
    licensePlate: "JKL2M34",
    totalSeats: 1,
    availableSeats: [1],
    occupiedSeats: [],
    price: 5.50,
    distance: "11 km",
    duration: "20 min",
    womenOnly: false,
    recurring: ["seg", "ter", "qui", "sex"],
    badges: ["eco-warrior"],
    rating: 4.6,
    trips: 28,
    notes: "",
    whatsapp: "19966666666",
    recommended: false,
    matchScore: 65,
  },
];

const badgeInfo: Record<string, { icon: string; label: string; color: string }> = {
  "eco-warrior": { icon: "🌱", label: "Guerreiro Eco", color: "bg-green-100 text-green-700" },
  "green-champion": { icon: "🏆", label: "Campeão Verde", color: "bg-emerald-100 text-emerald-700" },
  "punctual": { icon: "⏰", label: "Pontual", color: "bg-blue-100 text-blue-700" },
  "friendly": { icon: "😊", label: "Amigável", color: "bg-yellow-100 text-yellow-700" },
  "reliable": { icon: "✓", label: "Confiável", color: "bg-purple-100 text-purple-700" },
};

const vehicleIcons: Record<string, any> = {
  car: Car,
  suv: Bus,
  motorcycle: Bike,
};

export function FindRides() {
  const [filters, setFilters] = useState({
    origin: "",
    destination: "USF Sagrado",
    date: "",
    womenOnly: false,
  });

  const [showFilters, setShowFilters] = useState(false);

  const filteredRides = availableRides.filter((ride) => {
    if (filters.origin && !ride.from.toLowerCase().includes(filters.origin.toLowerCase())) {
      return false;
    }
    if (filters.destination && ride.to !== filters.destination) {
      return false;
    }
    if (filters.date && ride.date !== filters.date) {
      return false;
    }
    if (filters.womenOnly && !ride.womenOnly) {
      return false;
    }
    return true;
  });

  const recommendedRides = filteredRides.filter(ride => ride.recommended);
  const otherRides = filteredRides.filter(ride => !ride.recommended);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium">Encontrar Caronas</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Caronas disponíveis para você
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Encontre caronas compartilhadas na sua rota e economize enquanto ajuda o planeta
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200"
          >
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  <MapPin className="w-4 h-4 inline mr-1 text-green-600" />
                  Origem
                </label>
                <input
                  type="text"
                  value={filters.origin}
                  onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                  placeholder="De onde você sai?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  <Navigation className="w-4 h-4 inline mr-1 text-green-600" />
                  Destino
                </label>
                <select
                  value={filters.destination}
                  onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Todos os destinos</option>
                  {/* <option value="USF Sagrado">USF Sagrado</option>
                  <option value="PUC-Campinas">PUC-Campinas</option>
                  <option value="FACAMP">FACAMP</option> */}
                  <option value="USF Sagrado">USF Sagrado</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  <Calendar className="w-4 h-4 inline mr-1 text-green-600" />
                  Data
                </label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filtros
                </button>
              </div>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4 border-t border-gray-200"
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.womenOnly}
                    onChange={(e) => setFilters({ ...filters, womenOnly: e.target.checked })}
                    className="w-5 h-5 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                  />
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-pink-600" />
                    <span className="font-medium text-gray-900">Apenas caronas exclusivas para mulheres</span>
                  </div>
                </label>
              </motion.div>
            )}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Rides List */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recommended Rides */}
              {recommendedRides.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <h2 className="text-xl font-bold text-gray-900">Recomendadas para você</h2>
                  </div>
                  <div className="space-y-4">
                    {recommendedRides.map((ride, index) => (
                      <motion.div
                        key={ride.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-lg border-2 border-green-200 p-6 hover:shadow-xl transition-all relative overflow-hidden"
                      >
                        {/* Match Score Badge */}
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {ride.matchScore}% match
                        </div>

                        <div className="flex gap-4">
                          {/* Driver Avatar */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              {ride.driverInitials}
                            </div>
                            <div className="flex items-center justify-center gap-1 mt-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium text-gray-700">{ride.rating}</span>
                            </div>
                          </div>

                          {/* Ride Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-1">{ride.driver}</h3>
                                <div className="flex flex-wrap gap-1">
                                  {ride.badges.map((badge) => (
                                    <span
                                      key={badge}
                                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeInfo[badge]?.color}`}
                                    >
                                      {badgeInfo[badge]?.icon} {badgeInfo[badge]?.label}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Route */}
                            <div className="flex items-center gap-2 mb-3">
                              <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span className="font-medium text-gray-900">{ride.from}</span>
                              <span className="text-gray-400">→</span>
                              <span className="font-medium text-green-700">{ride.to}</span>
                              {ride.womenOnly && (
                                <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full font-medium flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  Exclusiva para Mulheres
                                </span>
                              )}
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(ride.date).toLocaleDateString('pt-BR')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{ride.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Navigation className="w-4 h-4" />
                                <span>{ride.distance} • {ride.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{ride.availableSeats.length} {ride.availableSeats.length === 1 ? 'vaga' : 'vagas'}</span>
                              </div>
                            </div>

                            {/* Recurring */}
                            {ride.recurring.length > 0 && (
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs text-gray-600">Recorrente:</span>
                                <div className="flex gap-1">
                                  {["seg", "ter", "qua", "qui", "sex"].map((day) => (
                                    <span
                                      key={day}
                                      className={`w-6 h-6 rounded flex items-center justify-center text-xs font-medium ${
                                        ride.recurring.includes(day)
                                          ? "bg-green-500 text-white"
                                          : "bg-gray-100 text-gray-400"
                                      }`}
                                    >
                                      {day.charAt(0).toUpperCase()}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Notes */}
                            {ride.notes && (
                              <p className="text-sm text-gray-600 mb-3 italic">"{ride.notes}"</p>
                            )}

                            {/* Visual Seat Selector */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-3">
                              <div className="flex items-center gap-2 mb-2">
                                {React.createElement(vehicleIcons[ride.vehicleType] || Car, { className: "w-4 h-4 text-gray-700" })}
                                <span className="text-sm font-medium text-gray-700">
                                  {ride.vehicleType === "car" && "Carro"}
                                  {ride.vehicleType === "suv" && "SUV/Van"}
                                  {ride.vehicleType === "motorcycle" && "Moto"}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">
                                {ride.vehicleModel} • Placa {ride.licensePlate}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {Array.from({ length: ride.totalSeats }, (_, i) => i + 1).map((seatNum) => (
                                  <div
                                    key={seatNum}
                                    className={`flex items-center justify-center w-10 h-10 rounded-lg text-xs font-medium ${
                                      ride.availableSeats.includes(seatNum)
                                        ? "bg-green-500 text-white"
                                        : ride.occupiedSeats.includes(seatNum)
                                        ? "bg-gray-300 text-gray-600"
                                        : "bg-gray-200 text-gray-500"
                                    }`}
                                  >
                                    {seatNum}
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-xs">
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                                  <span className="text-gray-600">Disponível</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                                  <span className="text-gray-600">Ocupado</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-gray-200">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                <span className="text-2xl font-bold text-green-600">R$ {ride.price.toFixed(2)}</span>
                                <span className="text-sm text-gray-500">por pessoa</span>
                              </div>
                              <div className="flex gap-2 sm:ml-auto">
                                <a
                                  href={`https://wa.me/55${ride.whatsapp}?text=Olá! Vi sua carona de ${ride.from} para ${ride.to} no dia ${new Date(ride.date).toLocaleDateString('pt-BR')} às ${ride.time}. Gostaria de mais informações!`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                  </svg>
                                  WhatsApp
                                </a>
                                  <Link
                                    to="/acompanhar-carona"
                                    className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-md flex items-center justify-center gap-2"
                                  >
                                    <Check className="w-4 h-4" />
                                    Solicitar
                                  </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Rides */}
              {otherRides.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Outras caronas disponíveis</h2>
                  <div className="space-y-4">
                    {otherRides.map((ride, index) => (
                      <motion.div
                        key={ride.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: (recommendedRides.length + index) * 0.1 }}
                        className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all"
                      >
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              {ride.driverInitials}
                            </div>
                            <div className="flex items-center justify-center gap-1 mt-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium text-gray-700">{ride.rating}</span>
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-1">{ride.driver}</h3>
                                <div className="flex flex-wrap gap-1">
                                  {ride.badges.map((badge) => (
                                    <span
                                      key={badge}
                                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeInfo[badge]?.color}`}
                                    >
                                      {badgeInfo[badge]?.icon} {badgeInfo[badge]?.label}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span className="font-medium text-gray-900">{ride.from}</span>
                              <span className="text-gray-400">→</span>
                              <span className="font-medium text-green-700">{ride.to}</span>
                              {ride.womenOnly && (
                                <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full font-medium flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  Exclusiva para Mulheres
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(ride.date).toLocaleDateString('pt-BR')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{ride.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Navigation className="w-4 h-4" />
                                <span>{ride.distance} • {ride.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{ride.availableSeats.length} {ride.availableSeats.length === 1 ? 'vaga' : 'vagas'}</span>
                              </div>
                            </div>

                            {ride.notes && (
                              <p className="text-sm text-gray-600 mb-3 italic">"{ride.notes}"</p>
                            )}

                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                <span className="text-2xl font-bold text-green-600">R$ {ride.price.toFixed(2)}</span>
                                <span className="text-sm text-gray-500">por pessoa</span>
                              </div>
                              <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-md flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                Solicitar
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {filteredRides.length === 0 && (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma carona encontrada</h3>
                  <p className="text-gray-600 mb-6">Tente ajustar seus filtros ou crie uma nova carona</p>
                  <Link
                    to="/criar-carona"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                  >
                    <Sparkles className="w-5 h-5" />
                    Criar Carona
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Security Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mt-12"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Segurança Garantida</h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Identidades verificadas de todos os usuários</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Dados anônimos até confirmação mútua</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Sistema de avaliação por badges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Opção exclusiva para mulheres</span>
                  </li>
                </ul>
              </motion.div>

              {/* Create Ride CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white"
              >
                <h3 className="font-semibold mb-2">Não encontrou sua rota?</h3>
                <p className="text-sm mb-4 opacity-90">
                  Crie sua própria carona e ajude outros estudantes enquanto economiza!
                </p>
                <Link
                  to="/criar-carona"
                  className="block w-full px-4 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-gray-100 transition-colors text-center"
                >
                  Oferecer Carona
                </Link>
              </motion.div>

              {/* Impact Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-4">Impacto da Comunidade</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-green-600">2.5k+</div>
                    <div className="text-sm text-gray-600">Estudantes ativos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">3.2 ton</div>
                    <div className="text-sm text-gray-600">CO₂ economizado</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">10k+</div>
                    <div className="text-sm text-gray-600">Caronas realizadas</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}