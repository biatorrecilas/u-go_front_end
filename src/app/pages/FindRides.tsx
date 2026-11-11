import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Calendar, Clock, Users, Shield, Navigation, 
  User, TrendingUp, Search, Check, Car, Bike, X, Map, Lock, DollarSign, Sparkles, CheckCircle2
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import React from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { toast } from "sonner";
import { RideMatchGame } from "../components/RideMatchGame";
import {
  createRideRequest,
  fetchCurrentUser,
  fetchPublicRides,
  recordRideSearch,
  type CurrentUserRecord,
  type RidePublicRecord,
  type RideVehicleType,
} from "../auth";

const vehicleIcons: Record<string, any> = {
  car: Car,
  motorcycle: Bike,
};

type RideAudienceFilter = "none" | "women" | "men" | "profile";

interface AvailableRide {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  vehicleType: RideVehicleType;
  totalSeats: number;
  availableSeats: number[];
  price: number;
  exclusiveTo: RideAudienceFilter;
  notes?: string | null;
  distance?: string;
  duration?: string;
  matchScore: number;
  isRecommended: boolean;
  matchReasons: string[];
  originDistanceKm?: number | null;
  destinationDistanceKm?: number | null;
  timeDifferenceMinutes?: number | null;
}

interface PlaceCoordinates {
  lat: number;
  lng: number;
}

const placesLibraries: ("places")[] = ["places"];
const googleMapsApiKey = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_GOOGLE_MAPS_API_KEY ?? "";

function AddressInput({ value, placeholder, onChange, onPlaceSelected }: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onPlaceSelected: (value: string, coordinates: PlaceCoordinates | null) => void;
}) {
  if (!googleMapsApiKey) {
    return (
      <input type="text" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder}
        className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 placeholder-gray-400 font-medium outline-none" />
    );
  }
  return <GoogleAddressInput value={value} placeholder={placeholder} onChange={onChange} onPlaceSelected={onPlaceSelected} />;
}

function GoogleAddressInput({ value, placeholder, onChange, onPlaceSelected }: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onPlaceSelected: (value: string, coordinates: PlaceCoordinates | null) => void;
}) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: "ugo-google-places",
    googleMapsApiKey,
    libraries: placesLibraries,
  });
  const input = (
    <input type="text" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder}
      className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 placeholder-gray-400 font-medium outline-none" />
  );
  if (!isLoaded) return input;
  return (
    <Autocomplete
      onLoad={(instance) => { autocompleteRef.current = instance; }}
      onPlaceChanged={() => {
        const place = autocompleteRef.current?.getPlace();
        const location = place?.geometry?.location;
        if (place && location) {
          onPlaceSelected(place.formatted_address || place.name || value, { lat: location.lat(), lng: location.lng() });
        }
      }}
      fields={["formatted_address", "geometry", "name"]}
    >
      {input}
    </Autocomplete>
  );
}

function toInputDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function toClockTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function mapRideToViewModel(ride: RidePublicRecord): AvailableRide {
  return {
    id: ride.id,
    from: ride.origin_text,
    to: ride.destination_text,
    date: toInputDate(ride.scheduled_start_at),
    time: toClockTime(ride.scheduled_start_at),
    vehicleType: ride.vehicle_type,
    totalSeats: ride.seat_capacity,
    availableSeats: ride.available_seat_numbers,
    price: Number(ride.price_amount ?? 0),
    exclusiveTo:
      ride.gender_restriction === "women_only"
        ? "women"
        : ride.gender_restriction === "men_only"
          ? "men"
          : ride.gender_restriction === "none" ? "none" : "profile",
    notes: ride.notes,
    distance: ride.distance_km ? `${Number(ride.distance_km).toFixed(1)} km` : "A confirmar",
    duration: ride.duration_minutes ? `${ride.duration_minutes} min` : "A confirmar",
    matchScore: ride.match_score ?? 0,
    isRecommended: ride.is_recommended,
    matchReasons: ride.match_reasons ?? [],
    originDistanceKm: ride.match_details?.origin_distance_km,
    destinationDistanceKm: ride.match_details?.destination_distance_km,
    timeDifferenceMinutes: ride.match_details?.departure_time_difference_minutes,
  };
}

export function FindRides() {
  const navigate = useNavigate();
  const [availableRides, setAvailableRides] = useState<AvailableRide[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUserRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isRequestingRideId, setIsRequestingRideId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    date: "",
    time: "",
    exclusiveTo: "none",
    originLat: null as number | null,
    originLng: null as number | null,
    destinationLat: null as number | null,
    destinationLng: null as number | null,
    vehicleType: "" as RideVehicleType | "",
    preferDeviation: null as boolean | null,
    maxDistanceKm: 8,
    timeFlexibilityMinutes: 90,
  });

  const [selectedRide, setSelectedRide] = useState<AvailableRide | null>(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [carFinalX, setCarFinalX] = useState(160);
  const carTrackRef = useRef<HTMLDivElement | null>(null);

  const isSearching = Boolean(filters.origin || filters.destination || filters.date || filters.time || filters.exclusiveTo !== "none"
    || filters.vehicleType || filters.preferDeviation !== null);

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentUser() {
      try {
        const user = await fetchCurrentUser();
        if (isMounted) setCurrentUser(user);
      } catch {
        if (isMounted) setCurrentUser(null);
      }
    }
    void loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      setLoadError(null);
      const genderRestriction = filters.exclusiveTo === "women" ? "women_only"
        : filters.exclusiveTo === "men" ? "men_only" : "none";
      try {
        const rides = await fetchPublicRides({
          status: "scheduled",
          smart_match: true,
          origin: filters.origin.trim(),
          destination: filters.destination.trim(),
          date: filters.date,
          time: filters.time,
          gender_restriction: genderRestriction,
          origin_lat: filters.originLat,
          origin_lng: filters.originLng,
          destination_lat: filters.destinationLat,
          destination_lng: filters.destinationLng,
          vehicle_type: filters.vehicleType,
          prefer_deviation: filters.preferDeviation,
          max_distance_km: filters.maxDistanceKm,
          time_flexibility_minutes: filters.timeFlexibilityMinutes,
        });
        if (!isMounted) return;
        setAvailableRides(rides
          .filter((ride) => filters.exclusiveTo === "none"
            || ride.gender_restriction === (filters.exclusiveTo === "women" ? "women_only" : "men_only"))
          .filter((ride) => ride.available_seat_count > 0)
          .sort((left, right) => (right.match_score - left.match_score)
            || (new Date(left.scheduled_start_at).getTime() - new Date(right.scheduled_start_at).getTime()))
          .map(mapRideToViewModel));
      } catch (error) {
        if (isMounted) setLoadError(error instanceof Error ? error.message : "Não foi possível carregar as caronas disponíveis.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }, 350);
    return () => {
      isMounted = false;
      window.clearTimeout(timer);
    };
  }, [filters]);

  useEffect(() => {
    if (!currentUser || !isSearching) return undefined;

    const timer = window.setTimeout(() => {
      const genderRestriction = filters.exclusiveTo === "women"
        ? "women_only"
        : filters.exclusiveTo === "men"
          ? "men_only"
          : "none";
      void recordRideSearch({
        origin_text: filters.origin.trim(),
        destination_text: filters.destination.trim(),
        requested_date: filters.date || null,
        requested_time: filters.time || null,
        gender_restriction: genderRestriction,
        origin_lat: filters.originLat,
        origin_lng: filters.originLng,
        destination_lat: filters.destinationLat,
        destination_lng: filters.destinationLng,
        vehicle_type: filters.vehicleType,
        prefer_deviation: filters.preferDeviation,
        max_distance_km: filters.maxDistanceKm,
        time_flexibility_minutes: filters.timeFlexibilityMinutes,
      }).catch(() => undefined);
    }, 1_200);

    return () => window.clearTimeout(timer);
  }, [currentUser, filters, isSearching]);

  useEffect(() => {
    const container = carTrackRef.current;
    if (!container) {
      return;
    }

    const updateCarPosition = () => {
      const nextFinalX = Math.max(container.offsetWidth / 2 - 100, 56);
      setCarFinalX(nextFinalX);
    };

    updateCarPosition();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => updateCarPosition());
      observer.observe(container);

      return () => observer.disconnect();
    }

    window.addEventListener("resize", updateCarPosition);
    return () => window.removeEventListener("resize", updateCarPosition);
  }, []);

  const recommendedRides = useMemo(() => {
    return availableRides.filter((ride) => ride.isRecommended).sort((left, right) => right.matchScore - left.matchScore);
  }, [availableRides]);

  const otherRides = useMemo(() => {
    const recommendedIds = new Set(recommendedRides.map((ride) => ride.id));
    return availableRides.filter((ride) => !recommendedIds.has(ride.id));
  }, [availableRides, recommendedRides]);

  const toggleExclusivity = (type: "women" | "men") => {
    setFilters(prev => ({
      ...prev,
      exclusiveTo: prev.exclusiveTo === type ? "none" : type
    }));
  };

  const handleRideRequest = async (ride: AvailableRide) => {
    setIsRequestingRideId(ride.id);

    try {
      await createRideRequest({ ride: ride.id });

      toast.custom(() => (
        <div className="pointer-events-auto flex w-[min(24rem,calc(100vw-2rem))] items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_18px_45px_-24px_rgba(5,150,105,0.5)]">
          <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <span className="flex flex-col gap-1">
            <span className="font-medium text-gray-900">Solicitação enviada!</span>
            <span className="text-xs leading-relaxed text-gray-500">Aguarde a aprovação do motorista.</span>
          </span>
        </div>
      ), {
        duration: 3500,
        unstyled: true,
      });

      setSelectedRide(null);
      navigate("/acompanhar-carona?tipo=solicitadas");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível solicitar esta vaga.");
    } finally {
      setIsRequestingRideId(null);
    }
  };

  const RideCard = ({ ride, isRecommended }: { ride: AvailableRide, isRecommended: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="flex h-full min-w-0 flex-col rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-green-400 hover:shadow-md cursor-pointer relative group sm:p-6"
      onClick={() => setSelectedRide(ride)}
    >
      {/* Rota e Badge de Match */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 basis-[13rem] items-start gap-3 sm:gap-4">
          <div className="mt-1 flex shrink-0 flex-col items-center">
            <div className="w-3 h-3 rounded-full border-2 border-gray-300 bg-white z-10"></div>
            <div className="w-0.5 h-8 bg-gray-200 -my-1"></div>
            <MapPin className="w-4 h-4 text-green-600 z-10" />
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <p className="break-words text-sm font-bold text-gray-900 [overflow-wrap:anywhere]">{ride.from}</p>
            </div>
            <div>
              <p className="break-words text-sm font-bold text-gray-900 [overflow-wrap:anywhere]">{ride.to}</p>
            </div>
          </div>
        </div>
        
        {/* Match Exato ou Recomendada à direita */}
        {isRecommended ? (
          <div className="flex shrink-0 items-center gap-1 rounded-lg border border-green-100 bg-green-50 px-3 py-1 text-[10px] font-bold text-green-700">
            <TrendingUp className="w-3 h-3" /> {ride.matchScore}% COMPATÍVEL
          </div>
        ) : (
          <div className="flex shrink-0 flex-col items-end gap-1 text-right">
            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs font-bold">
              <Clock className="w-3 h-3" /> {ride.time}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 block">
               Data: {ride.date.split('-').reverse().join('/')}
            </span>
          </div>
        )}
      </div>

      <div className="h-px w-full bg-gray-100 mb-4" />

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-6">
         {isRecommended && ride.matchReasons.map((reason) => (
           <span key={reason} className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-100">
             {reason}
           </span>
         ))}
         {ride.exclusiveTo === "women" && (
            <span className="px-3 py-1 bg-pink-50 text-pink-700 text-[10px] font-bold uppercase rounded-full flex items-center gap-1 border border-pink-100">
              <User className="w-3 h-3" /> Apenas Mulheres
            </span>
         )}
         {ride.exclusiveTo === "men" && (
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded-full flex items-center gap-1 border border-blue-100">
              <User className="w-3 h-3" /> Apenas Homens
            </span>
         )}
         {ride.exclusiveTo === "profile" && (
            <span className="px-3 py-1 bg-violet-50 text-violet-700 text-[10px] font-bold uppercase rounded-full flex items-center gap-1 border border-violet-100">
              <Shield className="w-3 h-3" /> Exclusiva para seu perfil
            </span>
         )}
         <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full flex items-center gap-1 border ${
           ride.availableSeats.length > 0 ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"
         }`}>
           <Users className="w-3 h-3" /> {ride.availableSeats.length} vagas
         </span>
         <span className="px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase rounded-full flex items-center gap-1 border border-gray-200">
           {React.createElement(vehicleIcons[ride.vehicleType] || Car, { className: "w-3 h-3" })}
           {ride.vehicleType === "car" ? "Carro" : "Moto"}
         </span>
      </div>

      {/* Footer do Card */}
      <div className="mt-auto flex flex-wrap items-end justify-between gap-3">
        <div>
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Contribuição</span>
           <span className="text-xl font-black text-green-600">R$ {ride.price.toFixed(2)}</span>
        </div>
        <button className="text-sm font-bold text-gray-500 group-hover:text-green-600 transition-colors flex items-center gap-1">
          Ver detalhes <span className="text-lg leading-none group-hover:translate-x-1 transition-transform">&rarr;</span>
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 font-sans relative flex flex-col">
      <Header />
      
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0; position: absolute; right: 0; width: 100%; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* CONTAINER PRINCIPAL ALINHADO (max-w-5xl) */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex-grow w-full relative z-10">
        
        {/* CABEÇALHO */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            Caronas Disponíveis para Você
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
            Encontre caronas compartilhadas na sua rota e economize enquanto ajuda o planeta
          </p>
        </motion.div>

        {/* ÁREA DE BUSCA (Mesma largura do grid de caronas abaixo) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-[2rem] shadow-xl p-5 sm:p-8 border border-white w-full mb-12 relative z-10"
        >
          {/* BLOCO DE ROTA */}
          <div className="relative mb-6">
            <div className="absolute left-[31px] top-[40px] bottom-[40px] w-0.5 bg-gray-200 rounded-full z-0 hidden sm:block"></div>
            <div className="space-y-3 relative z-10">
              
              {/* Origem */}
              <div className="relative flex flex-col sm:flex-row sm:items-center rounded-2xl p-2 bg-gray-50 border border-gray-200 focus-within:border-green-500 transition-colors duration-300">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm text-green-600 shrink-0 hidden sm:flex border border-gray-100">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 px-4 py-2 sm:py-0">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Origem</label>
                  <AddressInput
                    value={filters.origin}
                    onChange={(value) => setFilters({ ...filters, origin: value, originLat: null, originLng: null })}
                    onPlaceSelected={(value, coordinates) => setFilters({
                      ...filters, origin: value, originLat: coordinates?.lat ?? null, originLng: coordinates?.lng ?? null,
                    })}
                    placeholder="Sua localização atual"
                  />
                </div>
              </div>

              {/* Destino */}
              <div className="relative flex flex-col sm:flex-row sm:items-center rounded-2xl p-2 mt-2 sm:mt-0 bg-gray-50 border border-gray-200 focus-within:border-green-500 transition-colors duration-300">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-600 text-white shadow-sm shrink-0 hidden sm:flex">
                  <Navigation className="w-5 h-5" />
                </div>
                <div className="flex-1 px-4 py-2 sm:py-0">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Destino</label>
                  <AddressInput
                    value={filters.destination}
                    onChange={(value) => setFilters({ ...filters, destination: value, destinationLat: null, destinationLng: null })}
                    onPlaceSelected={(value, coordinates) => setFilters({
                      ...filters, destination: value, destinationLat: coordinates?.lat ?? null, destinationLng: coordinates?.lng ?? null,
                    })}
                    placeholder="Ex: USF Sagrado"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-gray-100 mb-6" />

          {/* DATA E HORA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 border border-gray-200 focus-within:border-green-500 rounded-2xl px-4 py-3.5 flex items-center gap-3 transition-colors duration-300">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Data</label>
                <input
                  type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none relative z-10"
                />
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 focus-within:border-green-500 rounded-2xl px-4 py-3.5 flex items-center gap-3 transition-colors duration-300">
              <Clock className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Horário</label>
                <input
                  type="time" value={filters.time} onChange={(e) => setFilters({ ...filters, time: e.target.value })}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none relative z-10"
                />
              </div>
            </div>
          </div>

          {/* Apenas Mulheres / Apenas Homens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
            <button
              type="button" onClick={() => toggleExclusivity("women")}
              className={`py-3.5 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                filters.exclusiveTo === "women"
                  ? "bg-pink-50 border-pink-300 text-pink-700"
                  : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100 border-gray-200"
              }`}
            >
              <User className="w-4 h-4" />
              <span className="font-bold text-sm">Apenas Mulheres</span>
            </button>
            <button
              type="button" onClick={() => toggleExclusivity("men")}
              className={`py-3.5 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                filters.exclusiveTo === "men"
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100 border-gray-200"
              }`}
            >
              <User className="w-4 h-4" />
              <span className="font-bold text-sm">Apenas Homens</span>
            </button>
          </div>

          <details className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <summary className="cursor-pointer text-sm font-bold text-gray-700">Preferências da recomendação</summary>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold text-gray-600">
                Flexibilidade de horário
                <select value={filters.timeFlexibilityMinutes} onChange={(event) => setFilters({ ...filters, timeFlexibilityMinutes: Number(event.target.value) })}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500">
                  <option value={30}>Até 30 minutos</option>
                  <option value={60}>Até 1 hora</option>
                  <option value={90}>Até 1h30</option>
                  <option value={120}>Até 2 horas</option>
                </select>
              </label>
              <label className="text-xs font-bold text-gray-600">
                Distância máxima dos pontos
                <select value={filters.maxDistanceKm} onChange={(event) => setFilters({ ...filters, maxDistanceKm: Number(event.target.value) })}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500">
                  <option value={2}>Até 2 km</option>
                  <option value={5}>Até 5 km</option>
                  <option value={8}>Até 8 km</option>
                  <option value={15}>Até 15 km</option>
                </select>
              </label>
              <label className="text-xs font-bold text-gray-600">
                Veículo preferido
                <select value={filters.vehicleType} onChange={(event) => setFilters({ ...filters, vehicleType: event.target.value as RideVehicleType | "" })}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500">
                  <option value="">Tanto faz</option>
                  <option value="car">Carro</option>
                  <option value="motorcycle">Moto</option>
                </select>
              </label>
              <label className="text-xs font-bold text-gray-600">
                Desvio de rota
                <select value={filters.preferDeviation == null ? "" : String(filters.preferDeviation)}
                  onChange={(event) => setFilters({ ...filters, preferDeviation: event.target.value === "" ? null : event.target.value === "true" })}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500">
                  <option value="">Tanto faz</option>
                  <option value="true">Prefiro que aceite desvio</option>
                  <option value="false">Não preciso de desvio</option>
                </select>
              </label>
            </div>
            {!googleMapsApiKey ? (
              <p className="mt-3 text-[11px] leading-relaxed text-gray-500">
                A proximidade por quilômetros fica disponível quando a chave do Google Maps é configurada; sem ela, a rota é comparada pelo endereço informado.
              </p>
            ) : null}
          </details>
        </motion.div>

        {/* CONTEÚDO PRINCIPAL: CARONAS ALINHADAS COM O FILTRO */}
        <div className="w-full space-y-8">
          {loadError ? (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {loadError}
            </div>
          ) : null}
          
          {/* Header com ícone de privacidade garantida à direita */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              {isSearching ? "Resultados da Busca" : "Visão Geral"}
            </h2>
            <button 
              onClick={() => setShowSecurityModal(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" /> Privacidade Garantida
            </button>
          </div>

          {isLoading ? (
            <div className="rounded-[2rem] border border-gray-200 bg-white px-6 py-12 text-center text-sm font-medium text-gray-500 shadow-sm">
              Carregando caronas disponíveis...
            </div>
          ) : null}
          
          {!isLoading && recommendedRides.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-600" /> 
                {isSearching ? "Caronas recomendadas" : "Recomendadas para você"}
              </h2>
              <div className="grid min-w-0 gap-4 xl:grid-cols-2">
                {recommendedRides.map((ride) => <RideCard key={ride.id} ride={ride} isRecommended={true} />)}
              </div>
            </div>
          )}

          {!isLoading && isSearching && recommendedRides.length === 0 && (
            <div className="py-6 text-center flex flex-col items-center">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Não encontramos carona compatível</h3>
              <p className="text-sm text-gray-500">Ainda assim, você pode conferir todas as outras caronas ativas abaixo.</p>
            </div>
          )}

          {!isLoading && (isSearching || otherRides.length > 0) && (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4 text-gray-500">
                {isSearching ? "Outras opções disponíveis" : "Todas as caronas disponíveis"}
              </h2>
              {otherRides.length > 0 ? (
                <div className="grid min-w-0 gap-4 xl:grid-cols-2">
                  {otherRides.map((ride) => <RideCard key={ride.id} ride={ride} isRecommended={false} />)}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center text-sm text-gray-500">Não há outras caronas ativas neste momento.</div>
              )}
            </div>
          )}

          {!isLoading && availableRides.length === 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-12 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">O feed está vazio</h3>
                <p className="text-sm text-gray-500 mb-6">Nenhuma carona foi oferecida ainda. Seja o primeiro!</p>
                <Link to="/criar-carona" className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors">
                  Oferecer Carona
                </Link>
              </div>
          )}
        </div>
      </div>

      {/* MODAL DETALHES DO TRAJETO */}
      <AnimatePresence>
        {selectedRide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 relative"
            >
              <button 
                onClick={() => setSelectedRide(null)} 
                className="absolute top-5 right-5 z-20 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 sm:p-8 pb-0 overflow-y-auto hide-scrollbar">
                
                <h3 className="font-bold text-gray-900 text-xl mb-8 mt-2 pr-12">Detalhes do Trajeto</h3>

                <div className="grid sm:grid-cols-2 gap-8">
                  {/* Lado Esquerdo do Modal (Rota e Mapa) */}
                  <div className="space-y-6">
                    <div className="w-full h-44 rounded-2xl relative overflow-hidden border border-green-200 bg-[linear-gradient(to_right,#d1fae5_1px,transparent_1px),linear-gradient(to_bottom,#d1fae5_1px,transparent_1px)] bg-[size:22px_22px] bg-green-50" aria-label={`Prévia do trajeto de ${selectedRide.from} até ${selectedRide.to}`}>
                      <div className="absolute left-[18%] top-[28%] h-3 w-3 rounded-full border-2 border-white bg-gray-500 shadow-md" />
                      <div className="absolute left-[22%] top-[35%] h-1 w-[54%] origin-left rotate-[18deg] rounded-full bg-gradient-to-r from-gray-400 via-green-500 to-emerald-600 shadow-sm" />
                      <div className="absolute bottom-[22%] right-[18%] flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl border border-white/70 bg-white/90 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-600 shadow-sm backdrop-blur">
                        <span className="flex items-center gap-1"><Map className="h-3.5 w-3.5 text-green-600" /> Trajeto previsto</span>
                        <span>{selectedRide.duration} · {selectedRide.distance}</span>
                      </div>
                    </div>

                    {/* Rota Textual */}
                    <div className="flex items-start gap-4 px-2">
                      <div className="flex flex-col items-center mt-1">
                        <div className="w-3 h-3 rounded-full border-2 border-gray-400 bg-white"></div>
                        <div className="w-0.5 h-12 bg-gray-200 my-1"></div>
                        <MapPin className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 space-y-6">
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Saindo de</p>
                          <p className="font-bold text-gray-900 text-base">{selectedRide.from}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Chegando em</p>
                          <p className="font-bold text-gray-900 text-base">{selectedRide.to}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lado Direito do Modal (Regras, Vagas, Info) */}
                  <div className="space-y-5">
                    <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4 border border-gray-200">
                       <span className="text-sm font-bold text-gray-600 flex items-center gap-2"><Clock className="w-4 h-4"/> Horário de Partida</span>
                       <span className="text-base font-black text-gray-900">{selectedRide.time}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex flex-col justify-center items-center">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Vagas Livres</span>
                        <div className="flex gap-1.5 justify-center">
                          {Array.from({ length: selectedRide.totalSeats }, (_, i) => i + 1).map((seatNum) => (
                            <div key={seatNum} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                                selectedRide.availableSeats.includes(seatNum) ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"
                              }`}
                            >
                              {seatNum}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex flex-col justify-center items-center">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Veículo</span>
                        <div className="flex items-center gap-1.5 text-gray-900 font-bold text-sm">
                           {React.createElement(vehicleIcons[selectedRide.vehicleType] || Car, { className: "w-5 h-5 text-gray-500" })}
                           {selectedRide.vehicleType === "car" ? "Carro" : "Moto"}
                        </div>
                      </div>
                    </div>

                    {selectedRide.notes && (
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Condições da Viagem</span>
                        <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-200 font-medium leading-relaxed">
                          "{selectedRide.notes}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 mb-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                  <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-blue-900 mb-1">Contato Protegido</p>
                    <p className="text-sm text-blue-800 font-medium leading-relaxed">
                      Ao realizar a solicitação, seu perfil será informado ao motorista.
                    </p>
                  </div>
                </div>

              </div>

              {/* Rodapé CTA */}
              <div className="p-6 sm:px-8 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider"><DollarSign className="w-4 h-4"/> Contribuição</span>
                  <span className="text-2xl font-black text-green-600">R$ {selectedRide.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => void handleRideRequest(selectedRide)}
                  disabled={isRequestingRideId === selectedRide.id}
                  className="w-full sm:w-auto px-10 py-3.5 bg-green-600 text-white rounded-full font-bold text-sm hover:bg-green-700 active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isRequestingRideId === selectedRide.id ? "Solicitando..." : "Solicitar Vaga"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DE PRIVACIDADE E SEGURANÇA (EXPLICAÇÃO DO FLUXO) */}
      <AnimatePresence>
        {showSecurityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden p-6 sm:p-8 relative border border-gray-100"
            >
              <button 
                onClick={() => setShowSecurityModal(false)} 
                className="absolute top-5 right-5 z-20 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Como funciona?</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center font-bold text-sm shrink-0 text-gray-600">1</div>
                  <div>
                    <h4 className="font-bold text-sm mb-0.5 text-gray-900">Visibilidade Restrita</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      A carona fica pública apenas no nível de rota e condições da viagem (origem, destino, data, hora, vagas, valor e restrições).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center font-bold text-sm shrink-0 text-gray-600">2</div>
                  <div>
                    <h4 className="font-bold text-sm mb-0.5 text-gray-900">Solicitação</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Você solicita a carona. O motorista recebe uma notificação com a informação de quem solicitou e pode aprovar ou recusar.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center font-bold text-sm shrink-0 text-gray-600">3</div>
                  <div>
                    <h4 className="font-bold text-sm mb-0.5 text-gray-900">Revelação e Decisão</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Se o motorista aprovar, o solicitante recebe uma notificação com o perfil do motorista e pode confirmar ou desistir.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-green-50 border border-green-200 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-0.5 text-green-700">Match Fechado!</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Só depois da dupla confirmação o match é fechado e os dois podem acessar o contato por WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
              
              <button onClick={() => setShowSecurityModal(false)} className="w-full mt-8 py-3 bg-gray-100 text-gray-900 font-bold rounded-full hover:bg-gray-200 transition-colors">
                Entendi
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* MINI-GAME: MATCH DE CARONAS */}
      <RideMatchGame />
      <Footer />
    </div>
  );
}
