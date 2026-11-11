import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  BellRing,
  Bike,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  Flag,
  Info,
  MapPin,
  MessageCircle,
  Play,
  Route,
  Share2,
  Shield,
  Smile,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import {
  approveRideRequest,
  cancelRide,
  cancelRideRequest,
  completeRide,
  confirmRideRequest,
  declineRideRequest,
  fetchBadges,
  fetchCurrentUser,
  fetchRideFeedback,
  fetchTrackingRides,
  getInitials,
  rejectRideRequest,
  startRide,
  submitRideFeedback,
  updateRide,
  type BadgeRecord,
  type CurrentUserRecord,
  type RideFeedbackRecord,
  type RideGenderRestriction,
  type RideRequestStatus,
  type RideStatus,
  type RideTrackingRecord,
  type RideVehicleType,
} from "../auth";

type RideType = "driver" | "passenger";

interface RideParticipant {
  id: string;
  userId: string;
  name: string;
  initials: string;
  seat: number;
  phone?: string | null;
}

interface RideRequestView {
  id: string;
  userId?: string;
  name: string;
  initials: string;
  seat?: number;
  status: RideRequestStatus;
  requestedAt: string;
}

interface FeedbackBadgeOption {
  id: string;
  label: string;
  icon: ReactNode;
  color: string;
  border: string;
}

interface RideView {
  id: string;
  type: RideType;
  status: RideStatus;
  requestStatus?: RideRequestStatus;
  myRequestId?: string | null;
  from: string;
  to: string;
  date: string;
  time: string;
  rawDate: string;
  scheduledStartAt: string;
  vehicleType: RideVehicleType;
  vehicleModel: string;
  licensePlate?: string | null;
  totalSeats: number;
  genderRestriction: RideGenderRestriction;
  availableSeats: number[];
  price: number;
  distance: string;
  duration: string;
  participants: RideParticipant[];
  pendingRequests: RideRequestView[];
  notes?: string | null;
  driverName?: string;
  driverId?: string;
  driverInitials?: string;
  driverContactPhone?: string | null;
  contactUnlocked: boolean;
  evaluated: boolean;
  raw: RideTrackingRecord;
}

const vehicleIcons: Record<RideVehicleType, ReactNode> = {
  car: <Car className="w-4 h-4" />,
  motorcycle: <Bike className="w-4 h-4" />,
};

const statusLabels: Record<RideStatus, { label: string; badgeColor: string }> = {
  scheduled: { label: "Agendada", badgeColor: "bg-blue-50 border-blue-200 text-blue-700" },
  in_progress: { label: "No Caminho", badgeColor: "bg-green-50 border-green-200 text-green-700" },
  completed: { label: "Concluída", badgeColor: "bg-gray-50 border-gray-200 text-gray-600" },
  cancelled: { label: "Cancelada", badgeColor: "bg-rose-50 border-rose-200 text-rose-700" },
};

const requestLabels: Record<RideRequestStatus, { label: string; description: string }> = {
  pending_driver: { label: "Aguardando motorista", description: "Sua solicitação foi enviada e ainda depende da aprovação do motorista." },
  approved_by_driver: { label: "Aguardando sua confirmação", description: "O motorista aprovou seu pedido. Confirme para liberar o contato e os detalhes finais." },
  confirmed: { label: "Confirmada", description: "Contato liberado e carona pronta para seguir." },
  rejected_by_driver: { label: "Recusada", description: "O motorista não aprovou esta solicitação." },
  declined_by_passenger: { label: "Não confirmada", description: "Você desistiu da vaga antes da confirmação final." },
  cancelled_by_passenger: { label: "Participação cancelada", description: "Sua vaga foi liberada e o motorista recebeu o aviso." },
};

const rideTypeToParam: Record<"all" | RideType, string> = { all: "todas", driver: "oferecidas", passenger: "solicitadas" };
const statusToParam: Record<"all" | RideStatus, string> = { all: "todas", scheduled: "agendadas", in_progress: "em-andamento", completed: "concluidas", cancelled: "canceladas" };

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
  if (rideStatus === "canceladas") return "cancelled";
  return "all";
}

function formatInputDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function formatDisplayDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function formatDisplayTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function buildFeedbackBadgeOptions(badges: BadgeRecord[]) {
  const palette = [
    { color: "bg-blue-50 text-blue-600", border: "border-blue-200" },
    { color: "bg-purple-50 text-purple-600", border: "border-purple-200" },
    { color: "bg-emerald-50 text-emerald-600", border: "border-emerald-200" },
    { color: "bg-pink-50 text-pink-600", border: "border-pink-200" },
    { color: "bg-amber-50 text-amber-600", border: "border-amber-200" },
    { color: "bg-teal-50 text-teal-600", border: "border-teal-200" },
  ];

  return badges.map((badge, index) => {
    const lowerName = `${badge.code} ${badge.name}`.toLowerCase();
    let icon: ReactNode = <Star className="w-4 h-4" />;

    if (lowerName.includes("pontual") || lowerName.includes("time")) {
      icon = <Clock className="w-4 h-4" />;
    } else if (lowerName.includes("amig") || lowerName.includes("simp")) {
      icon = <Smile className="w-4 h-4" />;
    } else if (lowerName.includes("segur") || lowerName.includes("confi")) {
      icon = <Shield className="w-4 h-4" />;
    } else if (lowerName.includes("grupo") || lowerName.includes("comun")) {
      icon = <Users className="w-4 h-4" />;
    }

    return {
      id: badge.id,
      label: badge.name,
      icon,
      ...palette[index % palette.length],
    } satisfies FeedbackBadgeOption;
  });
}

function hasRideFeedback(feedback: RideFeedbackRecord[], rideId: string, giverUserId: string, receiverUserId: string) {
  return feedback.some((item) => item.ride === rideId && item.giver_user === giverUserId && item.receiver_user === receiverUserId);
}

function mapRideRecord(ride: RideTrackingRecord, type: RideType, currentUserId: string, feedback: RideFeedbackRecord[]) {
  const participants: RideParticipant[] = ride.passengers.map((passenger) => ({
    id: passenger.id,
    userId: passenger.passenger_user.id,
    name: passenger.passenger_user.full_name,
    initials: getInitials(passenger.passenger_user.full_name),
    seat: passenger.seat_number,
    phone: passenger.contact_phone,
  }));

  const pendingRequests: RideRequestView[] = ride.requests.map((request) => ({
    id: request.id,
    userId: request.passenger_user?.id,
    name: request.passenger_user?.full_name ?? "Solicitante U-Go",
    initials: getInitials(request.passenger_user?.full_name ?? "U-Go"),
    seat: request.seat_number ?? undefined,
    status: request.status,
    requestedAt: request.requested_at,
  }));

  const requestStatus = ride.my_request?.status;
  const driverName = type === "passenger" ? ride.driver_user?.full_name ?? "Motorista protegido" : undefined;
  const driverId = ride.driver_user?.id;
  const evaluated = type === "passenger"
    ? Boolean(driverId && hasRideFeedback(feedback, ride.id, currentUserId, driverId))
    : participants.length > 0 && participants.every((participant) => hasRideFeedback(feedback, ride.id, currentUserId, participant.userId));

  return {
    id: ride.id,
    type,
    status: ride.status,
    requestStatus,
    myRequestId: ride.my_request?.id ?? null,
    from: ride.origin_text,
    to: ride.destination_text,
    date: formatDisplayDate(ride.scheduled_start_at),
    time: formatDisplayTime(ride.scheduled_start_at),
    rawDate: formatInputDate(ride.scheduled_start_at),
    scheduledStartAt: ride.scheduled_start_at,
    vehicleType: ride.vehicle_type,
    vehicleModel: ride.vehicle_model,
    licensePlate: ride.vehicle_plate ?? null,
    totalSeats: ride.seat_capacity,
    genderRestriction: ride.gender_restriction,
    availableSeats: ride.available_seat_numbers,
    price: Number(ride.price_amount ?? 0),
    distance: ride.distance_km ? `${Number(ride.distance_km).toFixed(1)} km` : "A confirmar",
    duration: ride.duration_minutes ? `${ride.duration_minutes} min` : "A confirmar",
    participants,
    pendingRequests,
    notes: ride.notes,
    driverName,
    driverId,
    driverInitials: driverName && driverName !== "Motorista protegido" ? getInitials(driverName) : "?",
    driverContactPhone: ride.driver_contact_phone ?? null,
    contactUnlocked: Boolean(ride.can_view_contact),
    evaluated,
    raw: ride,
  } satisfies RideView;
}

function FeedbackBadgeGrid({
  options,
  selectedIds,
  onToggle,
}: {
  options: FeedbackBadgeOption[];
  selectedIds: string[];
  onToggle: (badgeId: string) => void;
}) {
  // Keep the feedback choices focused; this badge is intentionally omitted from the modal.
  const visibleOptions = options.filter((badge) => badge.label.trim().toLocaleLowerCase("pt-BR") !== "viagem segura");

  if (visibleOptions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm font-medium text-gray-500">
        Nenhum badge de feedback foi cadastrado no backend ainda.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
      {visibleOptions.map((badge) => {
        const isSelected = selectedIds.includes(badge.id);
        return (
          <button
            key={badge.id}
            onClick={() => onToggle(badge.id)}
            className={`flex min-h-24 flex-col items-center justify-center rounded-2xl border-2 p-3 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 sm:p-3.5 ${
              isSelected ? `bg-gray-50 ${badge.border}` : "border-gray-100 hover:border-green-200 bg-white"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${badge.color}`}>{badge.icon}</div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-700 text-center">{badge.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function RideTracking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentUser, setCurrentUser] = useState<CurrentUserRecord | null>(null);
  const [rides, setRides] = useState<RideView[]>([]);
  const [feedbackRecords, setFeedbackRecords] = useState<RideFeedbackRecord[]>([]);
  const [feedbackBadges, setFeedbackBadges] = useState<FeedbackBadgeOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionKey, setActionKey] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | RideType>(() => getRideTypeFilterFromSearchParams(searchParams));
  const [statusFilter, setStatusFilter] = useState<"all" | RideStatus>(() => getRideStatusFilterFromSearchParams(searchParams));
  const [manageRideId, setManageRideId] = useState<string | null>(null);
  const [showStartConfirm, setShowStartConfirm] = useState<string | null>(null);
  const [showFinishConfirm, setShowFinishConfirm] = useState<string | null>(null);
  const [editingRide, setEditingRide] = useState<RideView | null>(null);
  const [evaluatingRideId, setEvaluatingRideId] = useState<string | null>(null);
  const [selectedBadgeIds, setSelectedBadgeIds] = useState<string[]>([]);
  const [driverEvalQueue, setDriverEvalQueue] = useState<{ rideId: string; passengers: RideParticipant[] } | null>(null);
  const [driverEvalIndex, setDriverEvalIndex] = useState(0);
  const [driverSelectedBadgeIds, setDriverSelectedBadgeIds] = useState<string[]>([]);

  async function loadRideData() {
    setIsLoading(true);
    setLoadError(null);

    try {
      const [user, driverRides, passengerRides, badges, feedback] = await Promise.all([
        fetchCurrentUser(),
        fetchTrackingRides("driver"),
        fetchTrackingRides("passenger"),
        fetchBadges("feedback"),
        fetchRideFeedback(),
      ]);

      const mappedRides = [
        ...driverRides.map((ride) => mapRideRecord(ride, "driver", user.id, feedback)),
        ...passengerRides.map((ride) => mapRideRecord(ride, "passenger", user.id, feedback)),
      ].sort((left, right) => new Date(right.scheduledStartAt).getTime() - new Date(left.scheduledStartAt).getTime());

      setCurrentUser(user);
      setFeedbackRecords(feedback);
      setFeedbackBadges(buildFeedbackBadgeOptions(badges));
      setRides(mappedRides);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Não foi possível carregar suas caronas.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadRideData();
  }, []);

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

  const filteredRides = useMemo(() => rides.filter((ride) => {
    if (filter !== "all" && ride.type !== filter) return false;
    if (statusFilter !== "all" && ride.status !== statusFilter) return false;
    return true;
  }), [filter, rides, statusFilter]);

  const activeRide = rides.find((ride) => ride.id === manageRideId) ?? null;
  const evaluatingRide = rides.find((ride) => ride.id === evaluatingRideId) ?? null;
  const pendingPassengerEvaluations = activeRide && activeRide.type === "driver"
    ? activeRide.participants.filter((participant) => currentUser ? !hasRideFeedback(feedbackRecords, activeRide.id, currentUser.id, participant.userId) : false)
    : [];

  const activeRidePassengerStatusDescription = activeRide?.type === "passenger" && activeRide.requestStatus
    ? requestLabels[activeRide.requestStatus].description
    : "Aguardando confirmação mútua para liberar detalhes.";

  const runAction = async (key: string, action: () => Promise<void>, successMessage?: string) => {
    setActionKey(key);
    try {
      await action();
      if (successMessage) {
        toast.success(successMessage);
      }
      await loadRideData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível concluir a ação.");
    } finally {
      setActionKey(null);
    }
  };

  const handleStartRide = async (rideId: string) => {
    await runAction(`start:${rideId}`, async () => {
      await startRide(rideId);
      setShowStartConfirm(null);
    }, "Trajeto iniciado.");
  };

  const handleFinishRide = async (rideId: string) => {
    await runAction(`complete:${rideId}`, async () => {
      await completeRide(rideId);
      setShowFinishConfirm(null);
    }, "Carona finalizada.");
  };

  const canChangeAtLeastDayBefore = (ride: RideView) => (
    ride.status === "scheduled" && new Date(ride.scheduledStartAt).getTime() >= Date.now() + 24 * 60 * 60 * 1000
  );

  const handleCancelRide = async (ride: RideView) => {
    if (!window.confirm("Cancelar esta carona? Todos os usuários vinculados serão notificados.")) return;
    await runAction(`cancel-ride:${ride.id}`, async () => {
      await cancelRide(ride.id);
      setManageRideId(null);
    }, "Carona cancelada e participantes notificados.");
  };

  const handleCancelParticipation = async (ride: RideView) => {
    if (!ride.myRequestId || !window.confirm("Cancelar sua participação? A vaga será liberada imediatamente.")) return;
    await runAction(`cancel-request:${ride.myRequestId}`, async () => {
      await cancelRideRequest(ride.myRequestId!);
      setManageRideId(null);
    }, "Participação cancelada; o motorista foi notificado.");
  };

  const handleShareRoute = (ride: RideView) => {
    const vehicleLine = `\n🚗 *${ride.vehicleModel}*${ride.licensePlate ? ` — Placa: *${ride.licensePlate}*` : ""}`;
    const text = encodeURIComponent(`📍 Minha carona U-Go está em andamento: *${ride.from}* → *${ride.to}*.${vehicleLine}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRide) {
      return;
    }

    await runAction(`edit:${editingRide.id}`, async () => {
      await updateRide(editingRide.id, {
        scheduled_start_at: `${editingRide.rawDate}T${editingRide.time}:00`,
        vehicle_model: editingRide.vehicleModel,
        vehicle_plate: editingRide.licensePlate ?? "",
        seat_capacity: editingRide.totalSeats,
        gender_restriction: editingRide.genderRestriction,
        price_amount: editingRide.price.toFixed(2),
        notes: editingRide.notes ?? "",
      });
      setEditingRide(null);
    }, "Carona atualizada com sucesso.");
  };

  const handleDriverDecision = async (rideRequestId: string, decision: "approve" | "reject") => {
    await runAction(`${decision}:${rideRequestId}`, async () => {
      if (decision === "approve") {
        await approveRideRequest(rideRequestId);
      } else {
        await rejectRideRequest(rideRequestId);
      }
    }, decision === "approve" ? "Solicitação aprovada." : "Solicitação recusada.");
  };

  const handlePassengerConfirmation = async (rideRequestId: string, confirmed: boolean) => {
    await runAction(`${confirmed ? "confirm" : "decline"}:${rideRequestId}`, async () => {
      if (confirmed) {
        await confirmRideRequest(rideRequestId);
      } else {
        await declineRideRequest(rideRequestId);
      }
    }, confirmed ? "Carona confirmada." : "Solicitação cancelada.");
  };

  const handleWhatsAppContact = (phone: string, name: string) => {
    const sanitizedPhone = phone.replace(/\D/g, "");
    const internationalPhone = sanitizedPhone.startsWith("55") ? sanitizedPhone : `55${sanitizedPhone}`;
    window.open(`https://wa.me/${internationalPhone}?text=${encodeURIComponent(`Olá ${name}, estou entrando em contato sobre nossa carona!`)}`, "_blank", "noopener,noreferrer");
  };

  const submitPassengerEvaluation = async () => {
    if (!evaluatingRide || !currentUser || !evaluatingRide.raw.driver_user?.id || selectedBadgeIds.length === 0) {
      return;
    }

    await runAction(`feedback:${evaluatingRide.id}`, async () => {
      await Promise.all(
        selectedBadgeIds.map((badgeId) => submitRideFeedback({
          ride: evaluatingRide.id,
          receiver_user: evaluatingRide.raw.driver_user!.id,
          badge: badgeId,
        })),
      );
      setEvaluatingRideId(null);
      setSelectedBadgeIds([]);
    }, "Avaliação enviada.");
  };

  const openDriverEvaluation = () => {
    if (!activeRide || pendingPassengerEvaluations.length === 0) {
      return;
    }

    setDriverEvalQueue({ rideId: activeRide.id, passengers: pendingPassengerEvaluations });
    setDriverEvalIndex(0);
    setDriverSelectedBadgeIds([]);
  };

  const advanceDriverEval = async (skip = false) => {
    if (!driverEvalQueue || !currentUser) {
      return;
    }

    const passenger = driverEvalQueue.passengers[driverEvalIndex];
    const isLast = driverEvalIndex === driverEvalQueue.passengers.length - 1;

    await runAction(`driver-feedback:${driverEvalQueue.rideId}:${passenger.userId}`, async () => {
      if (!skip && driverSelectedBadgeIds.length > 0) {
        await Promise.all(
          driverSelectedBadgeIds.map((badgeId) => submitRideFeedback({
            ride: driverEvalQueue.rideId,
            receiver_user: passenger.userId,
            badge: badgeId,
          })),
        );
      }

      if (isLast) {
        setDriverEvalQueue(null);
      } else {
        setDriverEvalIndex((current) => current + 1);
        setDriverSelectedBadgeIds([]);
      }
    }, skip ? undefined : "Feedback registrado.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 font-sans relative flex flex-col">
      <Header />

      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex-grow w-full relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 tracking-tight">Acompanhe suas Caronas</h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
              Gerencie solicitações, confirme matches, edite sua rota e viaje com acompanhamento em tempo real.
            </p>
          </div>

          {loadError ? (
            <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {loadError}
            </div>
          ) : null}

          <div className="bg-white rounded-[2rem] p-5 sm:p-6 mb-8 border border-white shadow-xl">
            <div className="grid gap-6 lg:grid-cols-[minmax(250px,.75fr)_minmax(0,1.45fr)] lg:items-end">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-3">Sua Função</label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => updateFilters("all", statusFilter)} className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${filter === "all" ? "bg-green-600 text-white border-green-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>Todas</button>
                  <button onClick={() => updateFilters("driver", statusFilter)} className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${filter === "driver" ? "bg-green-600 text-white border-green-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>Motorista</button>
                  <button onClick={() => updateFilters("passenger", statusFilter)} className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${filter === "passenger" ? "bg-green-600 text-white border-green-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>Passageiro</button>
                </div>
              </div>
              <div className="min-w-0">
                <label className="mb-3 block text-[10px] font-bold uppercase tracking-wider text-gray-500">Progresso</label>
                <div className="hide-scrollbar -mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 pb-1">
                  <button onClick={() => updateFilters(filter, "all")} className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${statusFilter === "all" ? "bg-green-600 text-white border-green-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>Todas</button>
                  <button onClick={() => updateFilters(filter, "scheduled")} className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${statusFilter === "scheduled" ? "bg-green-600 text-white border-green-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>Agendadas</button>
                  <button onClick={() => updateFilters(filter, "in_progress")} className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${statusFilter === "in_progress" ? "bg-green-600 text-white border-green-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>No Caminho</button>
                  <button onClick={() => updateFilters(filter, "completed")} className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${statusFilter === "completed" ? "bg-green-600 text-white border-green-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>Finalizadas</button>
                  <button onClick={() => updateFilters(filter, "cancelled")} className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${statusFilter === "cancelled" ? "bg-rose-600 text-white border-rose-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>Canceladas</button>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-200 shadow-sm mt-2 text-sm font-medium text-gray-500">
              Carregando suas caronas...
            </div>
          ) : (
            <div className="grid min-w-0 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
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
                  const pendingCount = ride.pendingRequests.filter((request) => request.status === "pending_driver").length;
                  const requiresDriverAction = ride.type === "driver" && pendingCount > 0;
                  const requiresPassengerAction = ride.type === "passenger" && ride.requestStatus === "approved_by_driver";
                  const waitingDriverApproval = ride.type === "passenger" && ride.requestStatus === "pending_driver";
                  const isUrgent = requiresDriverAction || requiresPassengerAction;

                  return (
                    <motion.div
                      key={ride.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex min-w-0 flex-col bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-200 hover:border-green-300 hover:shadow-md transition-all gap-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex min-w-0 flex-wrap gap-2">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border ${ride.type === "driver" ? "bg-green-50 text-green-700 border-green-200" : "bg-purple-50 text-purple-700 border-purple-200"}`}>
                            {ride.type === "driver" ? "Motorista" : "Passageiro"}
                          </span>
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusLabels[ride.status].badgeColor}`}>
                            {statusLabels[ride.status].label}
                          </span>
                        </div>

                        {isUrgent ? (
                          <div className="relative p-1.5 bg-red-50 text-red-500 rounded-full" title="Você tem pendências.">
                            <BellRing className="w-4 h-4" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-[1.5px] border-white"></span>
                          </div>
                        ) : waitingDriverApproval ? (
                          <div className="relative p-1.5 bg-gray-50 text-gray-400 rounded-full" title="Aguardando aprovação do motorista.">
                            <Clock className="w-4 h-4" />
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-1 flex min-w-0 items-start gap-3">
                        <div className="mt-1 flex shrink-0 flex-col items-center">
                          <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-300 bg-white z-10"></div>
                          <div className="w-px h-6 bg-gray-200 -my-0.5"></div>
                          <MapPin className="w-3.5 h-3.5 text-green-600 z-10" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-2">
                          <p className="break-words text-sm font-bold text-gray-900 [overflow-wrap:anywhere]" title={ride.from}>{ride.from}</p>
                          <p className="break-words text-sm font-bold text-gray-900 [overflow-wrap:anywhere]" title={ride.to}>{ride.to}</p>
                        </div>
                      </div>

                      <div className="h-px w-full bg-gray-100 my-1" />

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" /> {ride.date}
                          </span>
                          <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5 mt-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" /> {ride.time}
                          </span>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Valor</span>
                          <span className="text-base font-black text-green-600">R$ {ride.price.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-1">
                        <button onClick={() => setManageRideId(ride.id)} className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${isUrgent ? "bg-green-600 text-white hover:bg-green-700 shadow-sm border border-transparent" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"}`}>
                          {isUrgent ? "Resolver Pendência" : "Acessar Painel"}
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {editingRide ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg px-2">
                  <Edit3 className="w-5 h-5 text-green-600" /> Editar Carona
                </h3>
                <button onClick={() => setEditingRide(null)} className="p-2 text-gray-400 hover:text-gray-700 bg-gray-50 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => void handleEditSave(e)} className="p-6 space-y-6 bg-gray-50">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                  <Info className="w-5 h-5 text-blue-500 shrink-0" />
                  <p className="text-xs text-blue-800 font-medium leading-relaxed">
                    Ao salvar, os passageiros já confirmados passam a ver as novas informações da carona no painel.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 focus-within:border-green-500 rounded-2xl px-4 py-3 transition-colors duration-300">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Data</label>
                    <input type="date" value={editingRide.rawDate} onChange={(e) => setEditingRide({ ...editingRide, rawDate: e.target.value })} className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none" />
                  </div>
                  <div className="bg-white border border-gray-200 focus-within:border-green-500 rounded-2xl px-4 py-3 transition-colors duration-300">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Horário</label>
                    <input type="time" value={editingRide.time} onChange={(e) => setEditingRide({ ...editingRide, time: e.target.value })} className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none" />
                  </div>
                  <div className="bg-white border border-gray-200 focus-within:border-green-500 rounded-2xl px-4 py-3 transition-colors duration-300">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Valor (R$)</label>
                    <input type="number" step="0.50" min="0" value={editingRide.price} onChange={(e) => setEditingRide({ ...editingRide, price: Number(e.target.value) })} className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none" />
                  </div>
                  <div className="bg-white border border-gray-200 focus-within:border-green-500 rounded-2xl px-4 py-3 transition-colors duration-300">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Modelo</label>
                    <input type="text" value={editingRide.vehicleModel} onChange={(e) => setEditingRide({ ...editingRide, vehicleModel: e.target.value })} className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none" />
                  </div>
                  <div className="bg-white border border-gray-200 focus-within:border-green-500 rounded-2xl px-4 py-3 transition-colors duration-300">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Placa</label>
                    <input type="text" maxLength={10} value={editingRide.licensePlate ?? ""} onChange={(e) => setEditingRide({ ...editingRide, licensePlate: e.target.value.toUpperCase() })} className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none" />
                  </div>
                  <div className="bg-white border border-gray-200 focus-within:border-green-500 rounded-2xl px-4 py-3 transition-colors duration-300">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Quantidade de vagas</label>
                    <input type="number" min={editingRide.vehicleType === "motorcycle" ? 1 : 4} max={editingRide.vehicleType === "motorcycle" ? 1 : 7} value={editingRide.totalSeats} onChange={(e) => setEditingRide({ ...editingRide, totalSeats: Number(e.target.value) })} className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none" />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Exclusividade</label>
                  <select value={editingRide.genderRestriction} onChange={(e) => setEditingRide({ ...editingRide, genderRestriction: e.target.value as RideGenderRestriction })} className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none">
                    <option value="none">Sem exclusividade</option>
                    <option value="women_only">Exclusiva para mulheres</option>
                    <option value="men_only">Exclusiva para homens</option>
                    <option value="non_binary_only">Exclusiva para pessoas não binárias</option>
                    <option value="other_only">Exclusiva para outros perfis</option>
                  </select>
                </div>

                <div className="bg-white border border-gray-200 focus-within:border-green-500 rounded-2xl px-4 py-3 transition-colors duration-300">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Observações</label>
                  <input type="text" value={editingRide.notes || ""} onChange={(e) => setEditingRide({ ...editingRide, notes: e.target.value })} className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none" />
                </div>

                <button type="submit" disabled={actionKey === `edit:${editingRide.id}`} className="w-full py-3.5 bg-green-600 text-white rounded-full font-bold text-sm hover:bg-green-700 active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-60">
                  {actionKey === `edit:${editingRide.id}` ? "Salvando..." : "Salvar Alterações"}
                </button>
              </form>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {activeRide ? (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 py-8 sm:py-12 bg-gray-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh] border border-gray-100 relative">
              <button onClick={() => setManageRideId(null)} className="absolute top-5 right-5 z-20 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 sm:p-8 pb-0 overflow-y-auto hide-scrollbar">
                <div className="flex items-center gap-3 mb-8 mt-2 pr-12">
                  <h3 className="font-bold text-gray-900 text-xl">Painel da Viagem</h3>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusLabels[activeRide.status].badgeColor}`}>
                    {statusLabels[activeRide.status].label}
                  </span>
                </div>

                <div className="space-y-8 pb-8">
                  {activeRide.type === "driver" && ["scheduled", "in_progress"].includes(activeRide.status) ? (
                    <div className="flex flex-wrap gap-3">
                      {activeRide.status === "scheduled" ? (
                        <>
                          <button onClick={() => setShowStartConfirm(activeRide.id)} className="flex-1 min-w-[140px] py-3 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl hover:bg-emerald-100 flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                            <Play className="w-4 h-4" /> Iniciar Trajeto
                          </button>
                          <button onClick={() => setEditingRide(activeRide)} disabled={!canChangeAtLeastDayBefore(activeRide)} title={!canChangeAtLeastDayBefore(activeRide) ? "Edição permitida somente com 1 dia de antecedência" : undefined} className="flex-1 min-w-[140px] py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center gap-2 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-45">
                            <Edit3 className="w-4 h-4" /> Editar
                          </button>
                          <button onClick={() => void handleCancelRide(activeRide)} disabled={!canChangeAtLeastDayBefore(activeRide) || actionKey === `cancel-ride:${activeRide.id}`} title={!canChangeAtLeastDayBefore(activeRide) ? "Cancelamento permitido somente com 1 dia de antecedência" : undefined} className="flex-1 min-w-[140px] py-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl hover:bg-rose-100 flex items-center justify-center gap-2 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-45">
                            <Trash2 className="w-4 h-4" /> Cancelar
                          </button>
                        </>
                      ) : (
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
                  ) : null}

                  {activeRide.type === "passenger" && activeRide.status === "scheduled" && activeRide.myRequestId && ["pending_driver", "approved_by_driver", "confirmed"].includes(activeRide.requestStatus ?? "") ? (
                    <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                      <div>
                        <p className="text-sm font-bold text-rose-900">Precisa cancelar sua participação?</p>
                        <p className="mt-1 text-xs text-rose-700">Disponível até 1 dia antes; o motorista será avisado e a vaga será liberada na hora.</p>
                      </div>
                      <button onClick={() => void handleCancelParticipation(activeRide)} disabled={!canChangeAtLeastDayBefore(activeRide) || actionKey === `cancel-request:${activeRide.myRequestId}`} className="mt-3 w-full rounded-full border border-rose-200 bg-white px-5 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-45 sm:mt-0 sm:w-auto">
                        Cancelar participação
                      </button>
                    </div>
                  ) : null}

                  {activeRide.type === "passenger" && activeRide.status === "completed" && !activeRide.evaluated ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-green-600"><Award className="w-5 h-5" /></div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Carona concluída</p>
                          <p className="text-xs text-gray-500">Avalie sua experiência com badges reais do sistema.</p>
                        </div>
                      </div>
                      <button onClick={() => setEvaluatingRideId(activeRide.id)} className="w-full sm:w-auto px-6 py-2.5 bg-green-600 text-white rounded-full text-xs font-bold hover:bg-green-700 transition-colors">
                        Avaliar Agora
                      </button>
                    </div>
                  ) : null}

                  {activeRide.type === "driver" && activeRide.status === "completed" && pendingPassengerEvaluations.length > 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-green-600"><Award className="w-5 h-5" /></div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Feedback pendente</p>
                          <p className="text-xs text-gray-500">Avalie os passageiros confirmados desta carona.</p>
                        </div>
                      </div>
                      <button onClick={openDriverEvaluation} className="w-full sm:w-auto px-6 py-2.5 bg-green-600 text-white rounded-full text-xs font-bold hover:bg-green-700 transition-colors">
                        Avaliar Passageiros
                      </button>
                    </div>
                  ) : null}

                  {activeRide.type === "driver" && activeRide.pendingRequests.filter((request) => request.status === "pending_driver").length > 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                      <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wider">
                        <div className="relative">
                          <BellRing className="w-4 h-4 text-red-500" />
                          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        </div>
                        Aprovações Pendentes
                      </h4>
                      <div className="space-y-3">
                        {activeRide.pendingRequests.filter((request) => request.status === "pending_driver").map((request) => (
                          <div key={request.id} className="rounded-xl bg-gray-50 p-4 border border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">{request.initials}</div>
                              <div>
                                {request.userId ? <Link to={`/perfil/${request.userId}`} className="font-bold text-gray-900 text-sm hover:text-green-700 hover:underline">{request.name}</Link> : <div className="font-bold text-gray-900 text-sm">{request.name}</div>}
                                <div className="text-xs font-medium text-gray-500 mt-1">Vaga #{request.seat ?? "a definir"}</div>
                              </div>
                            </div>
                            <div className="flex w-full sm:w-auto gap-2">
                              <button onClick={() => void handleDriverDecision(request.id, "reject")} disabled={actionKey === `reject:${request.id}`} className="flex-1 sm:flex-none px-4 py-2 text-xs border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all flex justify-center items-center disabled:cursor-not-allowed disabled:opacity-60">Recusar</button>
                              <button onClick={() => void handleDriverDecision(request.id, "approve")} disabled={actionKey === `approve:${request.id}`} className="flex-1 sm:flex-none px-4 py-2 text-xs bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-60"><Check className="w-4 h-4" /> Aprovar</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {activeRide.type === "passenger" && activeRide.requestStatus === "approved_by_driver" && activeRide.myRequestId ? (
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                      <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="mb-2 text-lg font-bold text-gray-900">Sua vaga foi aprovada</h4>
                      <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">Confirme agora para liberar os dados do motorista e do veículo.</p>
                      <div className="flex gap-3 justify-center">
                        <button onClick={() => void handlePassengerConfirmation(activeRide.myRequestId!, false)} disabled={actionKey === `decline:${activeRide.myRequestId}`} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-50 transition-all disabled:cursor-not-allowed disabled:opacity-60">Desistir</button>
                        <button onClick={() => void handlePassengerConfirmation(activeRide.myRequestId!, true)} disabled={actionKey === `confirm:${activeRide.myRequestId}`} className="px-6 py-2.5 bg-green-600 text-white rounded-full text-xs font-bold hover:bg-green-700 transition-all disabled:cursor-not-allowed disabled:opacity-60">Confirmar Carona</button>
                      </div>
                    </div>
                  ) : null}

                  <div>
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">{activeRide.type === "driver" ? "Passageiros Confirmados" : "Motorista Responsável"}</h4>

                    {activeRide.type === "driver" ? (
                      activeRide.participants.length > 0 ? (
                        <div className="grid gap-3">
                          {activeRide.participants.map((participant) => (
                            <div key={participant.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-200">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white border border-gray-200 text-gray-700 rounded-full flex items-center justify-center font-bold text-sm">{participant.initials}</div>
                                <div>
                                  <Link to={`/perfil/${participant.userId}`} className="text-sm font-bold text-gray-900 hover:text-green-700 hover:underline">{participant.name}</Link>
                                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mt-0.5">Vaga #{participant.seat}</p>
                                </div>
                              </div>
                              {participant.phone ? (
                                <button onClick={() => handleWhatsAppContact(participant.phone!, participant.name)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full hover:border-green-500 hover:text-green-600 transition-colors text-xs font-bold flex items-center gap-2">
                                  <MessageCircle className="w-4 h-4" /> <span className="hidden sm:inline">WhatsApp</span>
                                </button>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200 border-dashed">
                          <p className="text-sm text-gray-500 font-medium">Nenhum passageiro confirmado até o momento.</p>
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-5 rounded-2xl border border-gray-200 gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="w-12 h-12 bg-white border border-gray-200 text-gray-700 rounded-full flex items-center justify-center font-bold shrink-0">{activeRide.driverInitials}</div>
                          <div>
                            {activeRide.driverId && activeRide.driverName !== "Motorista protegido" ? <Link to={`/perfil/${activeRide.driverId}`} className="text-base font-bold text-gray-900 hover:text-green-700 hover:underline">{activeRide.driverName}</Link> : <p className="text-base font-bold text-gray-900">Motorista protegido</p>}
                            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mt-1">{activeRidePassengerStatusDescription}</p>
                          </div>
                        </div>
                        {activeRide.contactUnlocked && activeRide.driverContactPhone && activeRide.driverName ? (
                          <button onClick={() => handleWhatsAppContact(activeRide.driverContactPhone!, activeRide.driverName!)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-full text-xs font-bold hover:bg-green-700 transition-colors">
                            <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
                          </button>
                        ) : null}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Resumo do Trajeto</h4>
                    <div className="bg-white rounded-2xl p-5 border border-gray-200 grid grid-cols-2 gap-y-6 gap-x-4">
                      <div>
                        <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Veículo</span>
                        <span className="font-bold text-sm text-gray-900 flex items-center gap-1.5">{vehicleIcons[activeRide.vehicleType]} {activeRide.vehicleModel}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Placa</span>
                        <span className="font-bold text-sm text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">{activeRide.licensePlate ?? "Protegida"}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Valor</span>
                        <span className="font-black text-lg text-green-600">R$ {activeRide.price.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Previsão</span>
                        <span className="font-bold text-sm text-gray-900">{activeRide.duration} ({activeRide.distance})</span>
                      </div>
                      {activeRide.notes ? (
                        <div className="col-span-2 bg-gray-50 p-4 rounded-xl">
                          <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Condições Adicionais</span>
                          <span className="text-sm text-gray-700 font-medium">"{activeRide.notes}"</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {evaluatingRide ? (
          <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-gray-900/40 p-3 backdrop-blur-sm sm:p-6">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-gray-100 bg-white p-5 shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-2">Como foi a carona?</h3>
                <p className="text-sm text-gray-500">Reconheça o perfil de {evaluatingRide.driverId ? <Link to={`/perfil/${evaluatingRide.driverId}`} className="font-bold text-green-700 hover:underline">{evaluatingRide.driverName}</Link> : <strong>{evaluatingRide.driverName}</strong>} selecionando badges de destaque.</p>
              </div>

              <FeedbackBadgeGrid options={feedbackBadges} selectedIds={selectedBadgeIds} onToggle={(badgeId) => setSelectedBadgeIds((current) => current.includes(badgeId) ? current.filter((item) => item !== badgeId) : [...current, badgeId])} />

              <div className="flex gap-3 mt-8">
                <button onClick={() => setEvaluatingRideId(null)} className="flex-1 py-3 text-gray-500 text-xs uppercase tracking-wider font-bold hover:bg-gray-50 rounded-full transition-all">Pular</button>
                <button onClick={() => void submitPassengerEvaluation()} disabled={selectedBadgeIds.length === 0 || actionKey === `feedback:${evaluatingRide.id}` || feedbackBadges.length === 0} className="flex-[2] py-3 bg-green-600 text-white text-xs uppercase tracking-wider font-bold rounded-full hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {actionKey === `feedback:${evaluatingRide.id}` ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {showStartConfirm ? (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] p-8 max-w-sm w-full border border-gray-100 shadow-2xl text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"><Play className="w-8 h-8 ml-1" /></div>
            <h3 className="font-bold text-gray-900 text-xl mb-2">Iniciar Trajeto</h3>
            <p className="text-sm text-gray-500 mb-8">Os passageiros passarão a ver a viagem como em andamento.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => void handleStartRide(showStartConfirm)} disabled={actionKey === `start:${showStartConfirm}`} className="w-full py-3 bg-green-600 text-white rounded-full text-xs uppercase tracking-wider font-bold hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60">{actionKey === `start:${showStartConfirm}` ? "Iniciando..." : "Começar Agora"}</button>
              <button onClick={() => setShowStartConfirm(null)} className="w-full py-3 text-gray-500 rounded-full text-xs uppercase tracking-wider font-bold hover:bg-gray-50">Cancelar</button>
            </div>
          </motion.div>
        </div>
      ) : null}

      {showFinishConfirm ? (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] p-8 max-w-sm w-full border border-gray-100 shadow-2xl text-center">
            <div className="w-16 h-16 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mx-auto mb-4"><Flag className="w-8 h-8" /></div>
            <h3 className="font-bold text-gray-900 text-xl mb-2">Finalizar Carona</h3>
            <p className="text-sm text-gray-500 mb-8">A viagem será concluída e as avaliações ficarão disponíveis.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => void handleFinishRide(showFinishConfirm)} disabled={actionKey === `complete:${showFinishConfirm}`} className="w-full py-3 bg-green-600 text-white rounded-full text-xs uppercase tracking-wider font-bold hover:bg-green-700 transition-all disabled:cursor-not-allowed disabled:opacity-60">{actionKey === `complete:${showFinishConfirm}` ? "Finalizando..." : "Finalizar Viagem"}</button>
              <button onClick={() => setShowFinishConfirm(null)} className="w-full py-3 text-gray-500 rounded-full text-xs uppercase tracking-wider font-bold hover:bg-gray-50 transition-all">Cancelar</button>
            </div>
          </motion.div>
        </div>
      ) : null}

      <AnimatePresence>
        {driverEvalQueue ? (() => {
          const passenger = driverEvalQueue.passengers[driverEvalIndex];
          const total = driverEvalQueue.passengers.length;
          const current = driverEvalIndex + 1;
          const actionId = `driver-feedback:${driverEvalQueue.rideId}:${passenger.userId}`;

          return (
            <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-gray-900/50 p-3 backdrop-blur-sm sm:p-6">
              <motion.div key={passenger.id} initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-gray-100 bg-white p-5 shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:p-8">
                {total > 1 ? (
                  <div className="flex items-center gap-2 mb-6">
                    {driverEvalQueue.passengers.map((_, index) => (
                      <div key={index} className={`h-1.5 flex-1 rounded-full transition-all ${index < current ? "bg-green-500" : "bg-gray-100"}`} />
                    ))}
                  </div>
                ) : null}

                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-lg">
                    {passenger.initials}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{total > 1 ? `Passageiro ${current} de ${total}` : "Passageiro"}</p>
                  <Link to={`/perfil/${passenger.userId}`} className="font-bold text-gray-900 text-xl mb-1 hover:text-green-700 hover:underline">{passenger.name}</Link>
                  <p className="text-sm text-gray-500">Reconheça o perfil deste passageiro com badges.</p>
                </div>

                <FeedbackBadgeGrid options={feedbackBadges} selectedIds={driverSelectedBadgeIds} onToggle={(badgeId) => setDriverSelectedBadgeIds((currentIds) => currentIds.includes(badgeId) ? currentIds.filter((item) => item !== badgeId) : [...currentIds, badgeId])} />

                <div className="flex gap-3 mt-8">
                  <button onClick={() => void advanceDriverEval(true)} disabled={actionKey === actionId} className="flex-1 py-3 text-gray-500 text-xs uppercase tracking-wider font-bold hover:bg-gray-50 rounded-full transition-all disabled:cursor-not-allowed disabled:opacity-60">Pular</button>
                  <button onClick={() => void advanceDriverEval(false)} disabled={driverSelectedBadgeIds.length === 0 || actionKey === actionId || feedbackBadges.length === 0} className="flex-[2] py-3 bg-green-600 text-white text-xs uppercase tracking-wider font-bold rounded-full hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {actionKey === actionId ? "Enviando..." : current < total ? "Próximo" : "Concluir"}
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })() : null}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
