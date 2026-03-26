import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  Play,
  Flag,
  Info,
  User,
  MessageCircle,
  Shield,
  Navigation,
  Car,
  Bike,
  Bus,
  Award,
  TrendingUp,
  Leaf,
  Route,
  PhoneCall,
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

type BadgeKey = "eco-warrior" | "punctual" | "green-champion" | "friendly" | "reliable";
type RideType = "driver" | "passenger";
type RideStatus = "scheduled" | "in_progress" | "completed";
type VehicleType = "car" | "suv" | "motorcycle";

interface RideParticipant {
  id: number;
  name: string;
  initials: string;
  seat: number;
  badges: BadgeKey[];
  rating: number;
  trips: number;
  phone: string;
}

interface Ride {
  id: number;
  type: RideType;
  status: RideStatus;
  from: string;
  to: string;
  date: string;
  time: string;
  vehicleType: VehicleType;
  vehicleModel: string;
  licensePlate: string;
  totalSeats: number;
  availableSeats: number[];
  price: number;
  distance: string;
  duration: string;
  womenOnly?: boolean;
  startTime?: string;
  participants?: RideParticipant[];
  notes?: string;
  whatsapp?: string;
  driverName?: string;
  driverInitials?: string;
  driverBadges?: BadgeKey[];
  mySeat?: number;
  completedTime?: string;
}

const badgeInfo: Record<BadgeKey, { label: string; icon: ReactNode; color: string }> = {
  "eco-warrior": {
    label: "Guerreiro Eco",
    icon: <Leaf className="w-4 h-4" />,
    color: "bg-green-100 text-green-700",
  },
  punctual: {
    label: "Pontual",
    icon: <Clock className="w-4 h-4" />,
    color: "bg-blue-100 text-blue-700",
  },
  "green-champion": {
    label: "Campeao Verde",
    icon: <Award className="w-4 h-4" />,
    color: "bg-emerald-100 text-emerald-700",
  },
  friendly: {
    label: "Amigavel",
    icon: <User className="w-4 h-4" />,
    color: "bg-purple-100 text-purple-700",
  },
  reliable: {
    label: "Confiavel",
    icon: <Shield className="w-4 h-4" />,
    color: "bg-indigo-100 text-indigo-700",
  },
};

const initialRides: Ride[] = [
  {
    id: 1,
    type: "driver",
    status: "in_progress",
    from: "Centro - Campinas",
    to: "USF Sagrado",
    date: "2026-03-20",
    time: "14:30",
    vehicleType: "car",
    vehicleModel: "Honda Fit 2022",
    licensePlate: "ABC1D23",
    totalSeats: 4,
    availableSeats: [1, 3],
    price: 5.0,
    distance: "12 km",
    duration: "25 min",
    womenOnly: false,
    startTime: "14:28",
    participants: [
      {
        id: 1,
        name: "Ana Silva",
        initials: "AS",
        seat: 1,
        badges: ["eco-warrior", "punctual"],
        rating: 4.8,
        trips: 45,
        phone: "19999999999",
      },
      {
        id: 2,
        name: "Joao Costa",
        initials: "JC",
        seat: 3,
        badges: ["friendly"],
        rating: 4.6,
        trips: 32,
        phone: "19988888888",
      },
    ],
    notes: "Ponto de encontro: em frente ao Parque Portugal",
    whatsapp: "19999999999",
  },
  {
    id: 2,
    type: "driver",
    status: "scheduled",
    from: "Shopping Iguatemi",
    to: "USF Sagrado",
    date: "2026-03-21",
    time: "07:45",
    vehicleType: "suv",
    vehicleModel: "Chevrolet Spin 2021",
    licensePlate: "DEF4G56",
    totalSeats: 6,
    availableSeats: [2, 4, 5],
    price: 4.5,
    distance: "8 km",
    duration: "18 min",
    womenOnly: true,
    participants: [
      {
        id: 3,
        name: "Maria Santos",
        initials: "MS",
        seat: 2,
        badges: ["green-champion"],
        rating: 4.9,
        trips: 78,
        phone: "19977777777",
      },
    ],
    notes: "Carona exclusiva para mulheres. Musica ambiente.",
    whatsapp: "19988888888",
  },
  {
    id: 3,
    type: "passenger",
    status: "scheduled",
    from: "Taquaral",
    to: "USF Sagrado",
    date: "2026-03-22",
    time: "08:00",
    vehicleType: "car",
    vehicleModel: "Hyundai HB20 2020",
    licensePlate: "GHI7J89",
    totalSeats: 4,
    availableSeats: [1, 2, 3, 4],
    driverName: "Carlos Oliveira",
    driverInitials: "CO",
    driverBadges: ["reliable", "punctual"],
    price: 6.0,
    distance: "10 km",
    duration: "22 min",
    mySeat: 3,
    notes: "Ar-condicionado sempre ligado",
    whatsapp: "19966666666",
  },
  {
    id: 4,
    type: "driver",
    status: "completed",
    from: "Barao Geraldo",
    to: "Shopping Parque das Bandeiras",
    date: "2026-03-19",
    time: "18:00",
    vehicleType: "car",
    vehicleModel: "Volkswagen Gol 2019",
    licensePlate: "JKL2M34",
    totalSeats: 4,
    availableSeats: [1, 2, 3, 4],
    price: 5.5,
    distance: "15 km",
    duration: "30 min",
    participants: [
      {
        id: 4,
        name: "Paula Mendes",
        initials: "PM",
        seat: 2,
        badges: ["eco-warrior"],
        rating: 4.7,
        trips: 23,
        phone: "19955555555",
      },
      {
        id: 5,
        name: "Roberto Lima",
        initials: "RL",
        seat: 4,
        badges: ["friendly", "punctual"],
        rating: 4.9,
        trips: 67,
        phone: "19944444444",
      },
    ],
    completedTime: "18:35",
    notes: "Ponto de encontro: portaria principal",
    whatsapp: "19955555555",
  },
];

const vehicleIcons: Record<VehicleType, ReactNode> = {
  car: <Car className="w-5 h-5" />,
  suv: <Bus className="w-5 h-5" />,
  motorcycle: <Bike className="w-5 h-5" />,
};

const statusLabels: Record<RideStatus, { label: string; color: string }> = {
  scheduled: { label: "Agendada", color: "bg-blue-100 text-blue-700" },
  in_progress: { label: "Em andamento", color: "bg-green-100 text-green-700" },
  completed: { label: "Concluida", color: "bg-gray-100 text-gray-700" },
};

export function RideTracking() {
  const [rides, setRides] = useState<Ride[]>(initialRides);
  const [filter, setFilter] = useState<"all" | RideType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | RideStatus>("all");
  const [expandedRide, setExpandedRide] = useState<number | null>(null);
  const [showStartConfirm, setShowStartConfirm] = useState<number | null>(null);
  const [showFinishConfirm, setShowFinishConfirm] = useState<number | null>(null);

  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      if (filter !== "all" && ride.type !== filter) return false;
      if (statusFilter !== "all" && ride.status !== statusFilter) return false;
      return true;
    });
  }, [rides, filter, statusFilter]);

  const handleStartRide = (rideId: number) => {
    const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    setRides((prev) => prev.map((ride) => (ride.id === rideId ? { ...ride, status: "in_progress", startTime: now } : ride)));
    setShowStartConfirm(null);
  };

  const handleFinishRide = (rideId: number) => {
    const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    setRides((prev) => prev.map((ride) => (ride.id === rideId ? { ...ride, status: "completed", completedTime: now } : ride)));
    setShowFinishConfirm(null);
  };

  const handleWhatsAppContact = (phone: string, name: string) => {
    const sanitizedPhone = phone.replace(/\D/g, "");
    const message = encodeURIComponent(`Ola ${name}, estou entrando em contato sobre nossa carona!`);
    window.open(`https://wa.me/55${sanitizedPhone}?text=${message}`, "_blank");
  };

  const handleWhatsAppGroup = (rideId: number) => {
    const ride = rides.find((item) => item.id === rideId);
    if (!ride?.whatsapp) return;
    const sanitizedPhone = ride.whatsapp.replace(/\D/g, "");
    const message = encodeURIComponent("Ola, gostaria de acessar o grupo desta carona.");
    window.open(`https://wa.me/55${sanitizedPhone}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Header />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
                <Route className="w-4 h-4" />
                <span className="text-sm font-medium">Minhas Caronas</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Acompanhe suas Caronas</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Gerencie suas viagens, veja participantes e acompanhe o status de cada carona
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{rides.filter((r) => r.status !== "completed").length}</div>
                    <div className="text-sm text-gray-600">Ativas</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{rides.filter((r) => r.type === "driver").length}</div>
                    <div className="text-sm text-gray-600">Como Motorista</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{rides.filter((r) => r.type === "passenger").length}</div>
                    <div className="text-sm text-gray-600">Como Passageiro</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">124 kg</div>
                    <div className="text-sm text-gray-600">CO2 evitado</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Tipo de Carona</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filter === "all" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Todas
                    </button>
                    <button
                      onClick={() => setFilter("driver")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filter === "driver" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Motorista
                    </button>
                    <button
                      onClick={() => setFilter("passenger")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filter === "passenger" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Passageiro
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setStatusFilter("all")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        statusFilter === "all" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Todas
                    </button>
                    <button
                      onClick={() => setStatusFilter("scheduled")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        statusFilter === "scheduled"
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Agendadas
                    </button>
                    <button
                      onClick={() => setStatusFilter("in_progress")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        statusFilter === "in_progress"
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Em Andamento
                    </button>
                    <button
                      onClick={() => setStatusFilter("completed")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        statusFilter === "completed"
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Concluidas
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredRides.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                  <Route className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma carona encontrada</h3>
                  <p className="text-gray-600 mb-6">Crie uma nova carona ou encontre caronas disponiveis</p>
                  <div className="flex gap-4 justify-center">
                    <Link
                      to="/criar-carona"
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all"
                    >
                      Criar Carona
                    </Link>
                    <Link
                      to="/caronas"
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                    >
                      Encontrar Caronas
                    </Link>
                  </div>
                </div>
              ) : (
                filteredRides.map((ride) => (
                  <motion.div
                    key={ride.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              ride.type === "driver" ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600"
                            }`}
                          >
                            {ride.type === "driver" ? <Car className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">
                                {ride.type === "driver" ? "Você é o motorista" : "Você é passageiro"}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusLabels[ride.status].color}`}>
                                {statusLabels[ride.status].label}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {ride.type === "passenger" && ride.driverName && <span>Motorista: {ride.driverName} • </span>}
                              {new Date(ride.date).toLocaleDateString("pt-BR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                              })}
                            </div>
                          </div>
                        </div>

                        {ride.type === "driver" && ride.status !== "completed" && (
                          <div className="flex gap-2">
                            {!ride.startTime ? (
                              <button
                                onClick={() => setShowStartConfirm(ride.id)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all flex items-center gap-2"
                              >
                                <Play className="w-4 h-4" />
                                Iniciar Trajeto
                              </button>
                            ) : (
                              <button
                                onClick={() => setShowFinishConfirm(ride.id)}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all flex items-center gap-2"
                              >
                                <Flag className="w-4 h-4" />
                                Finalizar Carona
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 bg-green-500 rounded-full" />
                              <div className="w-0.5 h-8 bg-gray-300" />
                              <div className="w-3 h-3 bg-red-500 rounded-full" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-gray-900">{ride.from}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Navigation className="w-4 h-4 text-red-600" />
                                <span className="font-medium text-gray-900">{ride.to}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(ride.date).toLocaleDateString("pt-BR")}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {ride.time}
                              {ride.startTime && <span className="text-green-600">(Iniciado as {ride.startTime})</span>}
                            </div>
                            <div className="flex items-center gap-2">
                              {vehicleIcons[ride.vehicleType]}
                              {ride.distance} • {ride.duration}
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              R$ {ride.price.toFixed(2)}
                            </div>
                          </div>

                          {ride.womenOnly && (
                            <div className="mt-3 inline-flex items-center gap-2 bg-pink-50 text-pink-700 px-3 py-1.5 rounded-lg text-sm">
                              <Shield className="w-4 h-4" />
                              Exclusiva para mulheres
                            </div>
                          )}
                        </div>
                      </div>

                      {ride.type === "driver" && ride.participants && ride.participants.length > 0 && (
                        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                          <Users className="w-5 h-5 text-gray-600" />
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900">
                              {ride.participants.length} {ride.participants.length === 1 ? "passageiro confirmado" : "passageiros confirmados"}
                            </span>
                          </div>
                          <div className="flex -space-x-2">
                            {ride.participants.slice(0, 3).map((participant) => (
                              <div
                                key={participant.id}
                                className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                                title={participant.name}
                              >
                                {participant.initials}
                              </div>
                            ))}
                            {ride.participants.length > 3 && (
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-semibold border-2 border-white">
                                +{ride.participants.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {ride.type === "passenger" && ride.mySeat && (
                        <div className="flex items-center gap-3 mb-4 p-3 bg-purple-50 rounded-lg">
                          <User className="w-5 h-5 text-purple-600" />
                          <span className="text-sm font-medium text-gray-900">Seu assento: #{ride.mySeat}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setExpandedRide(expandedRide === ride.id ? null : ride.id)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center gap-2"
                        >
                          <Info className="w-4 h-4" />
                          {expandedRide === ride.id ? "Ocultar Detalhes" : "Ver Detalhes"}
                        </button>

                        {ride.status !== "completed" && ride.whatsapp && (
                          <button
                            onClick={() => handleWhatsAppGroup(ride.id)}
                            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-all flex items-center gap-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Grupo do WhatsApp
                          </button>
                        )}
                      </div>
                    </div>

                    {expandedRide === ride.id && (
                      <div className="border-t border-gray-200 p-6 bg-gray-50">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <Info className="w-5 h-5 text-green-600" />
                              Informacoes da Carona
                            </h4>

                            {ride.notes && (
                              <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-700">{ride.notes}</p>
                              </div>
                            )}

                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Tipo de veiculo:</span>
                                <span className="font-medium text-gray-900 flex items-center gap-2">
                                  {vehicleIcons[ride.vehicleType]}
                                  {ride.vehicleType === "car" && "Carro"}
                                  {ride.vehicleType === "suv" && "SUV/Van"}
                                  {ride.vehicleType === "motorcycle" && "Moto"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Modelo:</span>
                                <span className="font-medium text-gray-900">{ride.vehicleModel}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Placa:</span>
                                <span className="font-medium text-gray-900">{ride.licensePlate}</span>
                              </div>

                              {ride.type === "driver" && (
                                <>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Assentos totais:</span>
                                    <span className="font-medium text-gray-900">{ride.totalSeats}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Assentos ocupados:</span>
                                    <span className="font-medium text-gray-900">
                                      {ride.participants?.length || 0} / {ride.availableSeats.length}
                                    </span>
                                  </div>
                                </>
                              )}

                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Contribuicao por pessoa:</span>
                                <span className="font-medium text-gray-900">R$ {ride.price.toFixed(2)}</span>
                              </div>

                              {ride.type === "driver" && ride.participants && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Total arrecadado:</span>
                                  <span className="font-medium text-green-600">R$ {(ride.price * ride.participants.length).toFixed(2)}</span>
                                </div>
                              )}

                              {ride.status === "completed" && ride.completedTime && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Concluida em:</span>
                                  <span className="font-medium text-gray-900">{ride.completedTime}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <Users className="w-5 h-5 text-green-600" />
                              {ride.type === "driver" ? "Passageiros" : "Motorista"}
                            </h4>

                            <div className="space-y-3">
                              {ride.type === "driver" && ride.participants && ride.participants.length > 0 ? (
                                ride.participants.map((participant) => (
                                  <div key={participant.id} className="bg-white rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-start gap-3">
                                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {participant.initials}
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-medium text-gray-900 mb-1">{participant.name}</div>
                                        <div className="text-sm text-gray-600 mb-2">Assento #{participant.seat}</div>
                                        <div className="flex flex-wrap gap-1 mb-2">
                                          {participant.badges.map((badge) => {
                                            const info = badgeInfo[badge];
                                            return (
                                              <div
                                                key={badge}
                                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${info.color}`}
                                              >
                                                {info.icon}
                                                {info.label}
                                              </div>
                                            );
                                          })}
                                        </div>
                                        <div className="text-xs text-gray-500">{participant.trips} viagens realizadas</div>
                                      </div>
                                    </div>
                                    {ride.status !== "completed" && (
                                      <button
                                        onClick={() => handleWhatsAppContact(participant.phone, participant.name)}
                                        className="w-full mt-3 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                                      >
                                        <PhoneCall className="w-4 h-4" />
                                        Entrar em Contato
                                      </button>
                                    )}
                                  </div>
                                ))
                              ) : ride.type === "driver" ? (
                                <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                  <p className="text-sm text-gray-600">Ainda nao ha passageiros confirmados para esta carona</p>
                                </div>
                              ) : ride.driverName ? (
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                  <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                      {ride.driverInitials}
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900 mb-1">{ride.driverName}</div>
                                      <div className="text-sm text-gray-600 mb-2">Motorista</div>
                                      {ride.driverBadges && (
                                        <div className="flex flex-wrap gap-1">
                                          {ride.driverBadges.map((badge) => {
                                            const info = badgeInfo[badge];
                                            return (
                                              <div
                                                key={badge}
                                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${info.color}`}
                                              >
                                                {info.icon}
                                                {info.label}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {ride.status !== "completed" && ride.whatsapp && (
                                    <button
                                      onClick={() => handleWhatsAppContact(ride.whatsapp as string, ride.driverName as string)}
                                      className="w-full mt-3 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                                    >
                                      <PhoneCall className="w-4 h-4" />
                                      Entrar em Contato
                                    </button>
                                  )}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {showStartConfirm === ride.id && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white rounded-xl p-6 max-w-md w-full"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Play className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Iniciar Trajeto</h3>
                              <p className="text-sm text-gray-600">Confirme o inicio da carona</p>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-6">
                            Ao iniciar o trajeto, todos os passageiros serão notificados. Certifique-se de que todos estão
                            presentes antes de partir.
                          </p>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setShowStartConfirm(null)}
                              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleStartRide(ride.id)}
                              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all"
                            >
                              Iniciar Agora
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {showFinishConfirm === ride.id && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white rounded-xl p-6 max-w-md w-full"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Finalizar Carona</h3>
                              <p className="text-sm text-gray-600">Confirme a conclusão</p>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-6">
                            Ao finalizar a carona, todos os passageiros serão notificados e a viagem será marcada como
                            concluída. Esta ação não pode ser desfeita.
                          </p>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setShowFinishConfirm(null)}
                              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleFinishRide(ride.id)}
                              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all"
                            >
                              Finalizar
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/criar-carona"
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg text-center"
              >
                Criar Nova Carona
              </Link>
              <Link
                to="/caronas"
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all text-center"
              >
                Encontrar Caronas
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}