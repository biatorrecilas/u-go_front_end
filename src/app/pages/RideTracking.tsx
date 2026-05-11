import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Calendar, Clock, Users, DollarSign, CheckCircle, Play, Flag, Info,
  User, MessageCircle, Shield, Navigation, Car, Bike, Bus, Award, TrendingUp,
  Leaf, Route, PhoneCall, Check, X, AlertCircle, Share2, CheckCircle2, Edit3, BellRing, Bell,
  HeartHandshake, Smile, HandHeart, Star
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getRequestedRides } from "../rideRequests";
import { toast } from "sonner";
import Spline from '@splinetool/react-spline';

// --- TIPAGENS E DADOS MOCKADOS ---
type BadgeKey = "punctual" | "friendly" | "reliable" | "polite" | "patient" | "exemplary";
type RideType = "driver" | "passenger";
type RideStatus = "scheduled" | "in_progress" | "completed";
type VehicleType = "car" | "motorcycle";
type RequestStatus = "pending_driver" | "approved_by_driver" | "confirmed" | "rejected_by_driver" | "declined_by_passenger";

interface RideParticipant { id: number; name: string; initials: string; seat: number; badges: BadgeKey[]; trips: number; phone: string; }
interface RideRequest { id: number; name: string; initials: string; seat: number; badges: BadgeKey[]; trips: number; phone: string; requestedAt: string; status: Exclude<RequestStatus, "confirmed" | "declined_by_passenger">; }
interface Ride { id: number; type: RideType; status: RideStatus; requestStatus?: RequestStatus; from: string; to: string; date: string; time: string; vehicleType: VehicleType; vehicleModel: string; licensePlate: string; totalSeats: number; availableSeats: number[]; price: number; distance: string; duration: string; womenOnly?: boolean; genderPreference?: "none" | "women_preferred" | "men_preferred"; startTime?: string; participants?: RideParticipant[]; pendingRequests?: RideRequest[]; notes?: string; whatsapp?: string; driverName?: string; driverInitials?: string; driverBadges?: BadgeKey[]; mySeat?: number; completedTime?: string; contactUnlocked?: boolean; evaluated?: boolean; }

const badgeInfo: Record<BadgeKey, { label: string; icon: ReactNode; color: string; border: string }> = {
  punctual: { 
    label: "Pontual", 
    icon: <Clock className="w-4 h-4" />, 
    color: "bg-blue-50 text-blue-600", 
    border: "border-blue-200" 
  },
  friendly: { 
    label: "Amigável", 
    icon: <Smile className="w-4 h-4" />, 
    color: "bg-purple-50 text-purple-600", 
    border: "border-purple-200" 
  },
  reliable: { 
    label: "Confiável", 
    icon: <Shield className="w-4 h-4" />, 
    color: "bg-indigo-50 text-indigo-600", 
    border: "border-indigo-200" 
  },
  patient: { 
    label: "Paciente", 
    icon: <HandHeart className="w-4 h-4" />, 
    color: "bg-teal-50 text-teal-600", 
    border: "border-teal-200" 
  },
  polite: { 
    label: "Educado", 
    icon: <HeartHandshake className="w-4 h-4" />, 
    color: "bg-pink-50 text-pink-600", 
    border: "border-pink-200" // Ajustado para rosa
  },
  exemplary: { 
    label: "Exemplar", 
    icon: <Star className="w-4 h-4" />, 
    color: "bg-amber-50 text-amber-600", 
    border: "border-amber-200" 
  },
};

const initialRides: Ride[] = [
  { id: 1, type: "driver", status: "scheduled", from: "Centro - Campinas", to: "USF Sagrado", date: "2026-03-20", time: "14:30", vehicleType: "car", vehicleModel: "Honda Fit 2022", licensePlate: "ABC1D23", totalSeats: 4, availableSeats: [1, 3], price: 5.0, distance: "12 km", duration: "25 min", womenOnly: false, genderPreference: "none", pendingRequests: [{ id: 101, name: "Ana Silva", initials: "AS", seat: 1, badges: ["patient", "punctual"], trips: 45, phone: "19999999999", requestedAt: "Hoje, 13:50", status: "pending_driver" }], participants: [], notes: "Ponto de encontro: em frente ao Parque Portugal", whatsapp: "19999999999" },
  { id: 2, type: "driver", status: "in_progress", from: "Shopping Iguatemi", to: "USF Sagrado", date: "2026-03-21", time: "07:45", vehicleType: "car", vehicleModel: "Chevrolet Spin 2021", licensePlate: "DEF4G56", totalSeats: 6, availableSeats: [2, 4, 5], price: 4.5, distance: "8 km", duration: "18 min", womenOnly: true, genderPreference: "women_preferred", startTime: "07:43", participants: [{ id: 201, name: "Maria Santos", initials: "MS", seat: 2, badges: ["polite"], trips: 78, phone: "19977777777" }], pendingRequests: [], notes: "Carona exclusiva para mulheres. Música ambiente.", whatsapp: "19988888888" },
  { id: 3, type: "passenger", status: "scheduled", requestStatus: "confirmed", from: "Taquaral", to: "USF Sagrado", date: "2026-03-22", time: "08:00", vehicleType: "car", vehicleModel: "Hyundai HB20 2020", licensePlate: "GHI7J89", totalSeats: 4, availableSeats: [1, 2, 3, 4], driverName: "Carlos Oliveira", driverInitials: "CO", driverBadges: ["reliable", "punctual"], price: 6.0, distance: "10 km", duration: "22 min", mySeat: 3, notes: "Ar-condicionado sempre ligado", whatsapp: "19966666666", contactUnlocked: true },
  { id: 4, type: "passenger", status: "completed", requestStatus: "confirmed", from: "Cambuí", to: "USF Sagrado", date: "2026-03-18", time: "07:15", vehicleType: "motorcycle", vehicleModel: "Yamaha Fazer 250", licensePlate: "JKL2M34", totalSeats: 1, availableSeats: [1], driverName: "Marcos Vinícius", driverInitials: "MV", driverBadges: ["patient"], price: 5.5, distance: "11 km", duration: "20 min", completedTime: "07:40", contactUnlocked: true, evaluated: false },
  { id: 5, type: "driver", status: "completed", from: "Barão Geraldo", to: "Shopping Parque das Bandeiras", date: "2026-03-19", time: "18:00", vehicleType: "car", vehicleModel: "Volkswagen Gol 2019", licensePlate: "MNO4P56", totalSeats: 4, availableSeats: [1, 2, 3, 4], price: 5.5, distance: "15 km", duration: "30 min", participants: [{ id: 301, name: "Paula Mendes", initials: "PM", seat: 2, badges: ["patient"], trips: 23, phone: "19955555555" }], completedTime: "18:35", notes: "Ponto de encontro: portaria principal", whatsapp: "19955555555" },
];

const vehicleIcons: Record<VehicleType, ReactNode> = { car: <Car className="w-4 h-4" />, motorcycle: <Bike className="w-4 h-4" /> };
const statusLabels: Record<RideStatus, { label: string; badgeColor: string }> = { 
  scheduled: { label: "Agendada", badgeColor: "bg-blue-50 border-blue-200 text-blue-700" }, 
  in_progress: { label: "No Caminho", badgeColor: "bg-green-50 border-green-200 text-green-700" }, 
  completed: { label: "Concluída", badgeColor: "bg-gray-50 border-gray-200 text-gray-600" } 
};
const requestLabels: Record<RequestStatus, { label: string; color: string; description: string }> = { pending_driver: { label: "Aguardando motorista", color: "text-gray-500", description: "Sua solicitação foi enviada." }, approved_by_driver: { label: "Sua vez de confirmar", color: "text-sky-600", description: "A motorista aprovou." }, confirmed: { label: "Confirmada", color: "text-green-600", description: "Contato liberado." }, rejected_by_driver: { label: "Recusada", color: "text-rose-600", description: "Não aprovada." }, declined_by_passenger: { label: "Não confirmada", color: "text-gray-500", description: "Você cancelou." } };

const rideTypeToParam: Record<"all" | RideType, string> = { all: "todas", driver: "oferecidas", passenger: "solicitadas" };
const statusToParam: Record<"all" | RideStatus, string> = { all: "todas", scheduled: "agendadas", in_progress: "em-andamento", completed: "concluidas" };

function getRideTypeFilterFromSearchParams(searchParams: URLSearchParams): "all" | RideType {
  const rideType = searchParams.get("tipo");
  if (rideType === "oferecidas") return "driver";
  if (rideType === "solicitadas") return "passenger";
  return "all";
}

function getRideStatusFilterFromSearchParams(searchParams: URLSearchParams): "all" | RideStatus {
  const rideStatus = searchParams.get("status");
  if (rideStatus === "agendadas") return "scheduled";
  if (rideStatus === "em-andamento") return "in_progress";
  if (rideStatus === "concluidas") return "completed";
  return "all";
}

function buildRequestedPassengerRides(): Ride[] {
  return getRequestedRides().map((ride) => ({
    id: ride.requestId,
    type: "passenger",
    status: "scheduled",
    requestStatus: "pending_driver",
    from: ride.from,
    to: ride.to,
    date: ride.date,
    time: ride.time,
    vehicleType: ride.vehicleType,
    vehicleModel: ride.vehicleType === "car" ? "Veículo a confirmar" : "Moto a confirmar",
    licensePlate: "A confirmar",
    totalSeats: ride.totalSeats,
    availableSeats: ride.availableSeats,
    price: ride.price,
    distance: "A confirmar",
    duration: "A confirmar",
    notes: ride.notes,
    driverInitials: "?",
    contactUnlocked: false,
  }));
}

export function RideTracking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rides, setRides] = useState<Ride[]>(() => [...buildRequestedPassengerRides(), ...initialRides]);
  const [filter, setFilter] = useState<"all" | RideType>(() => getRideTypeFilterFromSearchParams(searchParams));
  const [statusFilter, setStatusFilter] = useState<"all" | RideStatus>(() => getRideStatusFilterFromSearchParams(searchParams));
  
  // Modais
  const [manageRideId, setManageRideId] = useState<number | null>(null);
  const [showStartConfirm, setShowStartConfirm] = useState<number | null>(null);
  const [showFinishConfirm, setShowFinishConfirm] = useState<number | null>(null);
  const [evaluatingRideId, setEvaluatingRideId] = useState<number | null>(null);
  const [selectedBadges, setSelectedBadges] = useState<BadgeKey[]>([]);

  // Avaliação do motorista sobre passageiros (fluxo pós-finalização)
  const [driverEvalQueue, setDriverEvalQueue] = useState<{ rideId: number; passengers: RideParticipant[] } | null>(null);
  const [driverEvalIndex, setDriverEvalIndex] = useState(0);
  const [driverSelectedBadges, setDriverSelectedBadges] = useState<BadgeKey[]>([]);
  
  // Edição de Carona
  const [editingRide, setEditingRide] = useState<Ride | null>(null);

  useEffect(() => {
    const nextFilter = getRideTypeFilterFromSearchParams(searchParams);
    const nextStatusFilter = getRideStatusFilterFromSearchParams(searchParams);
    setFilter((currentFilter) => currentFilter === nextFilter ? currentFilter : nextFilter);
    setStatusFilter((currentStatusFilter) => currentStatusFilter === nextStatusFilter ? currentStatusFilter : nextStatusFilter);
  }, [searchParams]);

  const updateFilters = (nextFilter: "all" | RideType, nextStatusFilter: "all" | RideStatus) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    if (nextFilter === "all") nextSearchParams.delete("tipo");
    else nextSearchParams.set("tipo", rideTypeToParam[nextFilter]);

    if (nextStatusFilter === "all") nextSearchParams.delete("status");
    else nextSearchParams.set("status", statusToParam[nextStatusFilter]);

    setFilter(nextFilter);
    setStatusFilter(nextStatusFilter);
    setSearchParams(nextSearchParams);
  };

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
    const ride = rides.find(r => r.id === rideId);
    setRides((prev) => prev.map((r) => (r.id === rideId ? { ...r, status: "completed", completedTime: now } : r)));
    setShowFinishConfirm(null);
    setManageRideId(null);
    // Se houver passageiros, abre o fluxo de avaliação para o motorista
    if (ride?.participants && ride.participants.length > 0) {
      setDriverEvalQueue({ rideId, passengers: ride.participants });
      setDriverEvalIndex(0);
      setDriverSelectedBadges([]);
    }
  };

  const handleShareRoute = (ride: Ride) => {
    const driverLine = ride.type === "driver"
      ? `\n🚗 *${ride.vehicleModel}* — Placa: *${ride.licensePlate}*`
      : ride.driverName
        ? `\n👤 Motorista: *${ride.driverName}* | 🚗 *${ride.vehicleModel}* — Placa: *${ride.licensePlate}*`
        : "";
    const trackingUrl = `https://usfcaronas.app/rastreio/${ride.id}`;
    const text = encodeURIComponent(
      `📍 Estou em uma carona de *${ride.from}* para *${ride.to}*.${driverLine}\n\nAcompanhe minha localização em tempo real pelo app USF Caronas: ${trackingUrl}`
    );
    // 1) Abre o WhatsApp com a mensagem de texto
    window.open(`https://wa.me/?text=${text}`, "_blank");

    // 2) Tenta obter a localização atual e abre um segundo share com o link de maps
    // Nota: o WhatsApp Web não suporta envio programático de localização ao vivo.
    // A solução mais confiável é enviar o link do Google Maps com as coords atuais,
    // que atualiza conforme o usuário se move quando aberto no celular.
    // Para localização *realmente* ao vivo, implemente um endpoint no seu backend
    // que receba coords via POST (ex: a cada 10s via setInterval) e sirva a página
    // /rastreio/:id com essas coords atualizadas em tempo real (WebSocket ou polling).
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
        const locationText = encodeURIComponent(`📡 Minha localização atual: ${mapsUrl}`);
        setTimeout(() => {
          window.open(`https://wa.me/?text=${locationText}`, "_blank");
        }, 1500); // pequeno delay para não bloquear o popup anterior
      });
    }
  };

  const submitEvaluation = () => {
    if (evaluatingRideId) {
      setRides((prev) => prev.map((ride) => ride.id === evaluatingRideId ? { ...ride, evaluated: true } : ride));
      setEvaluatingRideId(null);
      setSelectedBadges([]);
    }
  };

  const advanceDriverEval = (skip = false) => {
    if (!driverEvalQueue) return;
    const nextIndex = driverEvalIndex + 1;
    if (nextIndex >= driverEvalQueue.passengers.length) {
      setDriverEvalQueue(null);
    } else {
      setDriverEvalIndex(nextIndex);
      setDriverSelectedBadges([]);
    }
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRide) return;
    setRides((prev) => prev.map(r => r.id === editingRide.id ? editingRide : r));
    setEditingRide(null);

    toast.custom(() => (
      <div className="pointer-events-auto flex w-[min(24rem,calc(100vw-2rem))] items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_18px_45px_-24px_rgba(5,150,105,0.5)]">
        <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
        </span>
        <span className="flex flex-col gap-1">
          <span className="font-medium text-gray-900">Carona atualizada com sucesso!</span>
          <span className="text-xs leading-relaxed text-gray-500 flex items-center gap-1">
            <BellRing className="w-3 h-3"/> Passageiros vinculados foram notificados.
          </span>
        </span>
      </div>
    ), { duration: 4000, unstyled: true });
  };

  const handleDriverDecision = (rideId: number, requestId: number, decision: "approve" | "reject") => {
    setRides((prev) => prev.map((ride) => {
      if (ride.id !== rideId) return ride;
      return { ...ride, pendingRequests: ride.pendingRequests?.map((req) => req.id === requestId ? { ...req, status: decision === "approve" ? "approved_by_driver" : "rejected_by_driver" } : req) ?? [] };
    }));
  };

  const handlePassengerConfirmation = (rideId: number, confirmed: boolean) => {
    setRides((prev) => prev.map((ride) => {
      if (ride.id !== rideId) return ride;
      return { ...ride, requestStatus: confirmed ? "confirmed" : "declined_by_passenger", contactUnlocked: confirmed };
    }));
  };

  const handleWhatsAppContact = (phone: string, name: string) => {
    const sanitizedPhone = phone.replace(/\D/g, "");
    window.open(`https://wa.me/55${sanitizedPhone}?text=${encodeURIComponent(`Olá ${name}, estou entrando em contato sobre nossa carona!`)}`, "_blank");
  };

  const activeRide = rides.find(r => r.id === manageRideId);
  const evaluatingRide = rides.find(r => r.id === evaluatingRideId);
  const activeRidePassengerStatusDescription = activeRide?.type === "passenger" && activeRide.requestStatus
    ? activeRide.requestStatus === "confirmed" ? "Contato liberado"
      : activeRide.requestStatus === "approved_by_driver" ? "A motorista aprovou. Confirme para liberar os detalhes."
        : activeRide.requestStatus === "pending_driver" ? "Solicitação enviada. Aguarde a aprovação."
          : requestLabels[activeRide.requestStatus].description
    : "Aguardando confirmação mútua para liberar detalhes";

  return (
    <div className="min-h-screen font-sans relative flex flex-col">
      <div className="fixed inset-0 z-[-1] w-full h-full pointer-events-none">
        <Spline scene="https://prod.spline.design/CZOj8f3zLV7j9s-r/scene.splinecode?v=2" />
      </div>

      <Header />

      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex-grow w-full relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          
          <div className="text-center mb-10">
            {/* Mudou para text-white e adicionou drop-shadow-lg */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">Acompanhe suas Caronas</h1>
            {/* Mudou para text-gray-200, adicionou drop-shadow-md e font-medium */}
            <p className="text-sm sm:text-base text-gray-200 max-w-xl mx-auto drop-shadow-md font-medium">
              Gerencie solicitações, confirme matchs, edite sua rota e viaje em tempo real.
            </p>
          </div>

          {/* Filtros Padronizados */}
          <div className="bg-white/90 backdrop-blur-md rounded-[2rem] p-5 sm:p-6 mb-8 border border-white/40 shadow-xl">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-3">Sua Função</label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => updateFilters("all", statusFilter)} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${filter === "all" ? "bg-green-600 text-white border-green-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>Todas</button>
                  <button onClick={() => updateFilters("driver", statusFilter)} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${filter === "driver" ? "bg-green-600 text-white border-green-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>Motorista</button>
                  <button onClick={() => updateFilters("passenger", statusFilter)} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${filter === "passenger" ? "bg-green-600 text-white border-green-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>Passageiro</button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-3">Progresso</label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => updateFilters(filter, "all")} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${statusFilter === "all" ? "bg-green-600 text-white border-green-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>Todas</button>
                  <button onClick={() => updateFilters(filter, "scheduled")} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${statusFilter === "scheduled" ? "bg-green-600 text-white border-green-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>Agendadas</button>
                  <button onClick={() => updateFilters(filter, "in_progress")} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${statusFilter === "in_progress" ? "bg-green-600 text-white border-green-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>No Caminho</button>
                  <button onClick={() => updateFilters(filter, "completed")} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${statusFilter === "completed" ? "bg-green-600 text-white border-green-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>Finalizadas</button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed de Caronas - Grid Compacto */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRides.length === 0 ? (
              <div className="col-span-full bg-white rounded-[2rem] p-12 text-center border border-gray-200 shadow-sm mt-2">
                <Route className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma carona encontrada</h3>
                <p className="text-sm text-gray-500 mb-6">Ajuste os filtros ou ofereça uma nova viagem.</p>
                <Link to="/criar-carona" className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors text-sm">
                  Oferecer Carona
                </Link>
              </div>
            ) : (
              filteredRides.map((ride) => {
                const pendingCount = ride.pendingRequests?.filter(req => req.status === "pending_driver").length || 0;
                const requiresDriverAction = ride.type === "driver" && pendingCount > 0;
                const requiresPassengerAction = ride.type === "passenger" && ride.requestStatus === "approved_by_driver";
                const waitingDriverApproval = ride.type === "passenger" && ride.requestStatus === "pending_driver";
                const isUrgent = requiresDriverAction || requiresPassengerAction;

                return (
                  <motion.div key={ride.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                    className="flex flex-col bg-white/95 backdrop-blur-sm rounded-[1.5rem] p-5 shadow-lg border border-white/50 hover:border-green-300 hover:shadow-md transition-all gap-4"
                  >
                    
                    {/* Header do Card (Badges + Sino Notificação) */}
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border ${ride.type === 'driver' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                          {ride.type === 'driver' ? 'Motorista' : 'Passageiro'}
                        </span>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusLabels[ride.status].badgeColor}`}>
                          {statusLabels[ride.status].label}
                        </span>
                      </div>
                      
                      {/* Sino Chamativo (Red Dot) */}
                      {isUrgent && (
                        <div className="relative p-1.5 bg-red-50 text-red-500 rounded-full" title="Você tem pendências!">
                           <BellRing className="w-4 h-4" />
                           <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-[1.5px] border-white"></span>
                        </div>
                      )}
                      {!isUrgent && waitingDriverApproval && (
                        <div className="relative p-1.5 bg-gray-50 text-gray-400 rounded-full" title="Aguardando aprovação do motorista">
                           <Clock className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Rota (Origem -> Destino) */}
                    <div className="flex items-start gap-3 mt-1">
                      <div className="flex flex-col items-center mt-1">
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-300 bg-white z-10"></div>
                        <div className="w-px h-6 bg-gray-200 -my-0.5"></div>
                        <MapPin className="w-3.5 h-3.5 text-green-600 z-10" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-bold text-gray-900 truncate" title={ride.from}>{ride.from}</p>
                        <p className="text-sm font-bold text-gray-900 truncate" title={ride.to}>{ride.to}</p>
                      </div>
                    </div>

                    <div className="h-px w-full bg-gray-100 my-1" />

                    {/* Info Inferior (Data/Hora e Preço) */}
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                         <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                           <Calendar className="w-3.5 h-3.5 text-gray-400"/> {new Date(ride.date).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' })}
                         </span>
                         <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5 mt-1">
                           <Clock className="w-3.5 h-3.5 text-gray-400"/> {ride.time}
                         </span>
                      </div>
                      <div className="text-right flex flex-col items-end">
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Valor</span>
                         <span className="text-base font-black text-green-600">R$ {ride.price.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Botão de Ação Primário/Secundário */}
                    <div className="flex gap-2 mt-1">
                      {isUrgent ? (
                         <button onClick={() => setManageRideId(ride.id)} className="w-full py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition-colors shadow-sm border border-transparent">
                           Resolver Pendência
                         </button>
                      ) : (
                         <button onClick={() => setManageRideId(ride.id)} className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors">
                           Acessar Painel
                         </button>
                      )}
                    </div>

                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>

      {/* --- MODAL EDITAR CARONA --- */}
      <AnimatePresence>
        {editingRide && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
             <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
             >
               <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                 <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg px-2">
                   <Edit3 className="w-5 h-5 text-green-600" /> Editar Carona
                 </h3>
                 <button onClick={() => setEditingRide(null)} className="p-2 text-gray-400 hover:text-gray-700 bg-gray-50 rounded-full transition-colors">
                   <X className="w-5 h-5" />
                 </button>
               </div>

               <form onSubmit={handleEditSave} className="p-6 space-y-6 bg-gray-50">
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                    <Info className="w-5 h-5 text-blue-500 shrink-0" />
                    <p className="text-xs text-blue-800 font-medium leading-relaxed">
                      Ao salvar, os passageiros já aprovados receberão uma notificação com as novas informações da carona.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 focus-within:border-green-500 rounded-2xl px-4 py-3 transition-colors duration-300">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Horário</label>
                      <input 
                        type="time" 
                        value={editingRide.time} 
                        onChange={e => setEditingRide({...editingRide, time: e.target.value})}
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none" 
                      />
                    </div>
                    <div className="bg-white border border-gray-200 focus-within:border-green-500 rounded-2xl px-4 py-3 transition-colors duration-300">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Valor (R$)</label>
                      <input 
                        type="number" step="0.50"
                        value={editingRide.price} 
                        onChange={e => setEditingRide({...editingRide, price: parseFloat(e.target.value)})}
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none" 
                      />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 focus-within:border-green-500 rounded-2xl px-4 py-3 transition-colors duration-300">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Observações</label>
                    <input 
                      type="text" 
                      value={editingRide.notes || ""} 
                      onChange={e => setEditingRide({...editingRide, notes: e.target.value})}
                      className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none" 
                    />
                  </div>

                  <div className="pt-2">
                    <button type="submit" className="w-full py-3.5 bg-green-600 text-white rounded-full font-bold text-sm hover:bg-green-700 active:scale-95 transition-all">
                      Salvar Alterações
                    </button>
                  </div>
               </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL DE GERENCIAMENTO (PAINEL DA VIAGEM) --- */}
      <AnimatePresence>
        {activeRide && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 py-8 sm:py-12 bg-gray-900/40 backdrop-blur-sm">
           <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} 
             className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh] border border-gray-100 relative"
           >
             <button onClick={() => setManageRideId(null)} className="absolute top-5 right-5 z-20 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors">
               <X className="w-5 h-5" />
             </button>

             <div className="p-6 sm:p-8 pb-0 overflow-y-auto hide-scrollbar">
               <div className="flex items-center gap-3 mb-8 mt-2 pr-12">
                 <h3 className="font-bold text-gray-900 text-2xl">Painel da Viagem</h3>
                 <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusLabels[activeRide.status].badgeColor}`}>
                    {statusLabels[activeRide.status].label}
                 </span>
               </div>

               <div className="space-y-8 pb-8">
                 
                 {/* AÇÕES EXTRAS DO MOTORISTA (Botões rápidos no topo) */}
                 {activeRide.type === "driver" && activeRide.status !== "completed" && (
                   <div className="flex flex-wrap gap-3">
                     {activeRide.status === "scheduled" && (
                       <>
                         <button onClick={() => setShowStartConfirm(activeRide.id)} className="flex-1 min-w-[140px] py-3 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl hover:bg-emerald-100 flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                           <Play className="w-4 h-4" /> Iniciar Trajeto
                         </button>
                         <button onClick={() => setEditingRide(activeRide)} className="flex-1 min-w-[140px] py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                           <Edit3 className="w-4 h-4" /> Editar
                         </button>
                       </>
                     )}
                     {activeRide.status === "in_progress" && (
                       <>
                         <button onClick={() => handleShareRoute(activeRide)} className="flex-1 min-w-[140px] py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                            <Share2 className="w-4 h-4" /> Compartilhar Rota
                         </button>
                         <button onClick={() => setShowFinishConfirm(activeRide.id)} className="flex-1 min-w-[140px] py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center justify-center gap-2 text-xs font-bold transition-colors shadow-sm">
                            <Flag className="w-4 h-4" /> Finalizar
                          </button>
                       </>
                     )}
                   </div>
                 )}

                 {/* AÇÃO AVALIAR (Passageiro concluído) */}
                 {activeRide.type === "passenger" && activeRide.status === "completed" && !activeRide.evaluated && (
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-green-600"><Award className="w-5 h-5"/></div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Carona Concluída</p>
                          <p className="text-xs text-gray-500">Avalie sua experiência e libere badges para o motorista.</p>
                        </div>
                      </div>
                      <button onClick={() => setEvaluatingRideId(activeRide.id)} className="w-full sm:w-auto px-6 py-2.5 bg-green-600 text-white rounded-full text-xs font-bold hover:bg-green-700 transition-colors">
                         Avaliar Agora
                      </button>
                    </div>
                 )}

                 {/* APROVAÇÕES / CONFIRMAÇÕES */}
                 {activeRide.type === "driver" && activeRide.pendingRequests && activeRide.pendingRequests.filter(req => req.status === "pending_driver").length > 0 && (
                   <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                     <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wider">
                       <div className="relative">
                         <BellRing className="w-4 h-4 text-red-500" />
                         <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                       </div>
                       Aprovações Pendentes
                     </h4>
                     <div className="space-y-3">
                       {activeRide.pendingRequests.filter(req => req.status === "pending_driver").map((request) => (
                         <div key={request.id} className="rounded-xl bg-gray-50 p-4 border border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">{request.initials}</div>
                             <div>
                               <div className="font-bold text-gray-900 text-sm">{request.name} <span className="text-xs font-medium text-gray-500">(Vaga #{request.seat})</span></div>
                               <div className="flex flex-wrap gap-1 mt-1.5">
                                 {request.badges.map(badge => (
                                   <span key={badge} className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold border ${badgeInfo[badge].border} ${badgeInfo[badge].color}`}>{badgeInfo[badge].label}</span>
                                 ))}
                               </div>
                             </div>
                           </div>
                           <div className="flex w-full sm:w-auto gap-2">
                             <button onClick={() => handleDriverDecision(activeRide.id, request.id, "reject")} className="flex-1 sm:flex-none px-4 py-2 text-xs border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all flex justify-center items-center">Recusar</button>
                             <button onClick={() => handleDriverDecision(activeRide.id, request.id, "approve")} className="flex-1 sm:flex-none px-4 py-2 text-xs bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-1.5"><Check className="w-4 h-4" /> Aprovar</button>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}

                 {activeRide.type === "passenger" && activeRide.requestStatus === "approved_by_driver" && (
                   <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 text-center relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                     <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                       <CheckCircle2 className="w-6 h-6" />
                     </div>
                     <h4 className="mb-2 text-lg font-bold text-gray-900">Sua vaga foi garantida!</h4>
                     <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">O motorista aprovou seu pedido. Confirme para acessar os detalhes e liberar o contato.</p>
                     <div className="flex gap-3 justify-center">
                       <button onClick={() => handlePassengerConfirmation(activeRide.id, false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-50 transition-all">Desistir</button>
                       <button onClick={() => handlePassengerConfirmation(activeRide.id, true)} className="px-6 py-2.5 bg-green-600 text-white rounded-full text-xs font-bold hover:bg-green-700 transition-all">Confirmar Carona</button>
                     </div>
                   </div>
                 )}

                 {/* PARTICIPANTES / MOTORISTA */}
                 <div>
                   <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">{activeRide.type === "driver" ? "Passageiros Confirmados" : "Motorista Responsável"}</h4>
                   
                   {activeRide.type === "driver" && activeRide.participants && activeRide.participants.length > 0 ? (
                     <div className="grid gap-3">
                       {activeRide.participants.map(p => (
                         <div key={p.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-200">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white border border-gray-200 text-gray-700 rounded-full flex items-center justify-center font-bold text-sm">{p.initials}</div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">{p.name}</p>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mt-0.5">Vaga #{p.seat} • {p.trips} viagens</p>
                              </div>
                            </div>
                            <button onClick={() => handleWhatsAppContact(p.phone, p.name)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full hover:border-green-500 hover:text-green-600 transition-colors text-xs font-bold flex items-center gap-2">
                              <MessageCircle className="w-4 h-4" /> <span className="hidden sm:inline">WhatsApp</span>
                            </button>
                         </div>
                       ))}
                     </div>
                   ) : activeRide.type === "driver" ? (
                     <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200 border-dashed">
                       <p className="text-sm text-gray-500 font-medium">Nenhum passageiro confirmado até o momento.</p>
                     </div>
                   ) : null}

                   {activeRide.type === "passenger" && (
                     <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-5 rounded-2xl border border-gray-200 gap-4">
                       <div className="flex items-center gap-4 w-full sm:w-auto">
                         <div className="w-12 h-12 bg-white border border-gray-200 text-gray-700 rounded-full flex items-center justify-center font-bold shrink-0">{activeRide.driverInitials}</div>
                         <div>
                           <p className="text-base font-bold text-gray-900">{activeRide.driverName ?? "Identidade Protegida"}</p>
                           <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mt-1">{activeRidePassengerStatusDescription}</p>
                         </div>
                       </div>
                       {activeRide.requestStatus === "confirmed" && activeRide.whatsapp && activeRide.driverName && (
                         <button onClick={() => handleWhatsAppContact(activeRide.whatsapp!, activeRide.driverName!)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-full text-xs font-bold hover:bg-green-700 transition-colors">
                           <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
                         </button>
                       )}
                     </div>
                   )}
                 </div>

                 {/* DETALHES DO VEÍCULO E VIAGEM */}
                 <div>
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Resumo do Trajeto</h4>
                    <div className="bg-white rounded-2xl p-5 border border-gray-200 grid grid-cols-2 gap-y-6 gap-x-4">
                       <div>
                         <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Veículo</span>
                         <span className="font-bold text-sm text-gray-900 flex items-center gap-1.5">{vehicleIcons[activeRide.vehicleType]} {activeRide.vehicleModel}</span>
                       </div>
                       <div>
                         <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Placa</span>
                         <span className="font-bold text-sm text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">{(activeRide.type === "driver" || activeRide.contactUnlocked) ? activeRide.licensePlate : "Protegida"}</span>
                       </div>
                       <div>
                         <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Custo Total</span>
                         <span className="font-black text-lg text-green-600">R$ {activeRide.price.toFixed(2)}</span>
                       </div>
                       <div>
                         <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Previsão</span>
                         <span className="font-bold text-sm text-gray-900">{activeRide.duration} ({activeRide.distance})</span>
                       </div>
                       {activeRide.notes && (
                         <div className="col-span-2 bg-gray-50 p-4 rounded-xl">
                            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Condições Adicionais</span>
                            <span className="text-sm text-gray-700 font-medium">"{activeRide.notes}"</span>
                         </div>
                       )}
                    </div>
                 </div>

               </div>
             </div>
           </motion.div>
         </div>
        )}
      </AnimatePresence>

      {/* --- MODAL DE AVALIAÇÃO (BADGES) --- */}
      <AnimatePresence>
        {evaluatingRide && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900 text-2xl mb-2">Como foi a carona?</h3>
                <p className="text-sm text-gray-500">
                  Reconheça o perfil de <strong>{evaluatingRide.driverName}</strong> selecionando badges de destaque!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {(Object.keys(badgeInfo) as BadgeKey[]).map((badge) => {
                  const info = badgeInfo[badge];
                  const isSelected = selectedBadges.includes(badge);
                  return (
                    <button
                      key={badge}
                      onClick={() => {
                        setSelectedBadges(prev => isSelected ? prev.filter(b => b !== badge) : [...prev, badge]);
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        isSelected ? `bg-gray-50 ${info.border}` : "border-gray-100 hover:border-green-200 bg-white"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${info.color}`}>
                        {info.icon}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-gray-700 text-center">{info.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setEvaluatingRideId(null)} className="flex-1 py-3 text-gray-500 text-xs uppercase tracking-wider font-bold hover:bg-gray-50 rounded-full transition-all">Pular</button>
                <button onClick={submitEvaluation} disabled={selectedBadges.length === 0} className="flex-[2] py-3 bg-green-600 text-white text-xs uppercase tracking-wider font-bold rounded-full hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Enviar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODALS DE INÍCIO/FIM */}
      {showStartConfirm && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] p-8 max-w-sm w-full border border-gray-100 shadow-2xl text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"><Play className="w-8 h-8 ml-1" /></div>
            <h3 className="font-bold text-gray-900 text-xl mb-2">Iniciar Trajeto</h3>
            <p className="text-sm text-gray-500 mb-8">Avisaremos aos passageiros que você está a caminho. O compartilhamento de rota será ativado.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleStartRide(showStartConfirm)} className="w-full py-3 bg-green-600 text-white rounded-full text-xs uppercase tracking-wider font-bold hover:bg-green-700">Começar Agora</button>
              <button onClick={() => setShowStartConfirm(null)} className="w-full py-3 text-gray-500 rounded-full text-xs uppercase tracking-wider font-bold hover:bg-gray-50">Cancelar</button>
            </div>
          </motion.div>
        </div>
      )}

      {showFinishConfirm && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] p-8 max-w-sm w-full border border-gray-100 shadow-2xl text-center">
            <div className="w-16 h-16 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mx-auto mb-4"><Flag className="w-8 h-8" /></div>
            <h3 className="font-bold text-gray-900 text-xl mb-2">Finalizar Carona</h3>
            <p className="text-sm text-gray-500 mb-8">Ótimo trabalho! A viagem será concluída e os passageiros poderão te avaliar.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleFinishRide(showFinishConfirm)} className="w-full py-3 bg-green-600 text-white rounded-full text-xs uppercase tracking-wider font-bold hover:bg-green-700 transition-all">Finalizar Viagem</button>
              <button onClick={() => setShowFinishConfirm(null)} className="w-full py-3 text-gray-500 rounded-full text-xs uppercase tracking-wider font-bold hover:bg-gray-50 transition-all">Cancelar</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* --- MODAL DE AVALIAÇÃO DO MOTORISTA SOBRE PASSAGEIROS --- */}
      <AnimatePresence>
        {driverEvalQueue && (() => {
          const passenger = driverEvalQueue.passengers[driverEvalIndex];
          const total = driverEvalQueue.passengers.length;
          const current = driverEvalIndex + 1;
          return (
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
              <motion.div
                key={passenger.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100"
              >
                {/* Progresso */}
                {total > 1 && (
                  <div className="flex items-center gap-2 mb-6">
                    {driverEvalQueue.passengers.map((_, i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < current ? "bg-green-500" : "bg-gray-100"}`} />
                    ))}
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-lg">
                    {passenger.initials}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {total > 1 ? `Passageiro ${current} de ${total}` : "Passageiro"}
                  </p>
                  <h3 className="font-bold text-gray-900 text-2xl mb-1">{passenger.name}</h3>
                  <p className="text-sm text-gray-500">Reconheça o perfil deste passageiro com badges!</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {(Object.keys(badgeInfo) as BadgeKey[]).map((badge) => {
                    const info = badgeInfo[badge];
                    const isSelected = driverSelectedBadges.includes(badge);
                    return (
                      <button
                        key={badge}
                        onClick={() => setDriverSelectedBadges(prev =>
                          isSelected ? prev.filter(b => b !== badge) : [...prev, badge]
                        )}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                          isSelected ? `bg-gray-50 ${info.border}` : "border-gray-100 hover:border-green-200 bg-white"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${info.color}`}>
                          {info.icon}
                        </div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-700 text-center">{info.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => advanceDriverEval(true)}
                    className="flex-1 py-3 text-gray-500 text-xs uppercase tracking-wider font-bold hover:bg-gray-50 rounded-full transition-all"
                  >
                    Pular
                  </button>
                  <button
                    onClick={() => advanceDriverEval(false)}
                    disabled={driverSelectedBadges.length === 0}
                    className="flex-[2] py-3 bg-green-600 text-white text-xs uppercase tracking-wider font-bold rounded-full hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {current < total ? "Próximo →" : "Concluir"}
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      <Footer />
    </div>
  );
}