import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Calendar, Clock, Users, Shield, Navigation, 
  User, TrendingUp, Search, Check, Car, Bike, X, Map, Lock, DollarSign, Sparkles, CheckCircle2
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import React from "react";
import { toast } from "sonner";
import { saveRequestedRide } from "../rideRequests";
import { RideMatchGame } from "../components/RideMatchGame";

// Mock data focado apenas na rota (identidade oculta e apenas carro/moto)
const availableRides = [
  {
    id: 1,
    from: "Centro - Campinas",
    to: "USF Sagrado",
    date: "2026-03-21",
    time: "07:30",
    vehicleType: "car",
    totalSeats: 4,
    availableSeats: [1, 3],
    price: 5.00,
    exclusiveTo: "none",
    notes: "Ponto de encontro: em frente ao Parque Portugal. Saio pontualmente.",
    recommended: true, // Sugestão inteligente antes da busca
  },
  {
    id: 2,
    from: "Shopping Iguatemi",
    to: "USF Sagrado",
    date: "2026-03-21",
    time: "07:45",
    vehicleType: "car",
    totalSeats: 4,
    availableSeats: [2],
    price: 4.50,
    exclusiveTo: "women",
    notes: "Carona exclusiva para mulheres. Costumo ir ouvindo um podcast levinho.",
    recommended: false,
  },
  {
    id: 3,
    from: "Taquaral",
    to: "USF Sagrado",
    date: "2026-03-21",
    time: "08:00",
    vehicleType: "car",
    totalSeats: 4,
    availableSeats: [3],
    price: 6.00,
    exclusiveTo: "none",
    notes: "Ar-condicionado sempre ligado.",
    recommended: false,
  },
  {
    id: 4,
    from: "Cambuí",
    to: "USF Sagrado",
    date: "2026-03-21",
    time: "07:15",
    vehicleType: "motorcycle",
    totalSeats: 1,
    availableSeats: [1],
    price: 5.50,
    exclusiveTo: "none",
    notes: "Tenho capacete extra. Apenas garupa.",
    recommended: true, // Sugestão inteligente antes da busca
  },
];

const vehicleIcons: Record<string, any> = {
  car: Car,
  motorcycle: Bike,
};

type AvailableRide = (typeof availableRides)[number];

export function FindRides() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    date: "",
    time: "",
    exclusiveTo: "none",
  });

  const [selectedRide, setSelectedRide] = useState<AvailableRide | null>(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [carFinalX, setCarFinalX] = useState(160);
  const carTrackRef = useRef<HTMLDivElement | null>(null);

  const isSearching = filters.origin || filters.destination || filters.date || filters.time || filters.exclusiveTo !== "none";

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

  // Lógica Inteligente: Se buscou, filtra exato. Se não buscou, mostra as recomendadas pelo perfil.
  const recommendedRides = isSearching 
    ? availableRides.filter((ride) => {
        if (filters.origin && !ride.from.toLowerCase().includes(filters.origin.toLowerCase())) return false;
        if (filters.destination && !ride.to.toLowerCase().includes(filters.destination.toLowerCase())) return false;
        if (filters.date && ride.date !== filters.date) return false;
        if (filters.time && ride.time !== filters.time) return false;
        if (filters.exclusiveTo !== "none" && ride.exclusiveTo !== filters.exclusiveTo) return false;
        return true;
      })
    : availableRides.filter((ride) => ride.recommended);

  const otherRides = availableRides.filter(ride => !recommendedRides.includes(ride));

  const toggleExclusivity = (type: "women" | "men") => {
    setFilters(prev => ({
      ...prev,
      exclusiveTo: prev.exclusiveTo === type ? "none" : type
    }));
  };

  const handleRideRequest = (ride: AvailableRide) => {
    const { created } = saveRequestedRide({
      externalRideId: ride.id,
      from: ride.from,
      to: ride.to,
      date: ride.date,
      time: ride.time,
      vehicleType: ride.vehicleType as "car" | "motorcycle",
      totalSeats: ride.totalSeats,
      availableSeats: ride.availableSeats,
      price: ride.price,
      notes: ride.notes,
    });

    toast.custom(() => (
      <div className="pointer-events-auto flex w-[min(24rem,calc(100vw-2rem))] items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_18px_45px_-24px_rgba(5,150,105,0.5)]">
        <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
        </span>
        <span className="flex flex-col gap-1">
          <span className="font-medium text-gray-900">
            {created ? "Solicitação enviada!" : "Solicitação já registrada"}
          </span>
          <span className="text-xs leading-relaxed text-gray-500">
            Aguarde a aprovação do motorista.
          </span>
        </span>
      </div>
    ), {
      duration: 3500,
      unstyled: true,
    });

    setSelectedRide(null);
    navigate("/acompanhar-carona?tipo=solicitadas");
  };

  const RideCard = ({ ride, isRecommended }: { ride: AvailableRide, isRecommended: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-green-400 cursor-pointer relative group"
      onClick={() => setSelectedRide(ride)}
    >
      {/* Rota e Badge de Match */}
      <div className="flex items-start justify-between gap-2 mb-5">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center mt-1">
            <div className="w-3 h-3 rounded-full border-2 border-gray-300 bg-white z-10"></div>
            <div className="w-0.5 h-8 bg-gray-200 -my-1"></div>
            <MapPin className="w-4 h-4 text-green-600 z-10" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-sm font-bold text-gray-900 truncate">{ride.from}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 truncate">{ride.to}</p>
            </div>
          </div>
        </div>
        
        {/* Match Exato ou Recomendada à direita */}
        {isRecommended ? (
          <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-green-100 flex-shrink-0">
            <TrendingUp className="w-3 h-3" /> {isSearching ? "MATCH EXATO" : "RECOMENDADA"}
          </div>
        ) : (
          <div className="text-right flex flex-col items-end gap-1">
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
      <div className="flex items-end justify-between mt-auto">
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
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
                  <input
                    type="text" value={filters.origin} onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                    placeholder="Sua localização atual"
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 placeholder-gray-400 font-medium outline-none"
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
                  <input
                    type="text" value={filters.destination} onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                    placeholder="Ex: USF Sagrado"
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 placeholder-gray-400 font-medium outline-none"
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
        </motion.div>

        {/* CONTEÚDO PRINCIPAL: CARONAS ALINHADAS COM O FILTRO */}
        <div className="w-full space-y-8">
          
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
          
          {recommendedRides.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-600" /> 
                {isSearching ? "Matches Exatos" : "Recomendadas para você"}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {recommendedRides.map((ride) => <RideCard key={ride.id} ride={ride} isRecommended={true} />)}
              </div>
            </div>
          )}

          {isSearching && recommendedRides.length === 0 && (
            <div className="py-6 text-center flex flex-col items-center">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Nenhuma carona exata encontrada</h3>
              <p className="text-sm text-gray-500">Não encontramos uma carona com esses filtros exatos, mas confira as opções ativas abaixo!</p>
            </div>
          )}

          {otherRides.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4 text-gray-500">
                {isSearching ? "Outras Opções Ativas" : "Todas as caronas disponíveis"}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {otherRides.map((ride) => <RideCard key={ride.id} ride={ride} isRecommended={false} />)}
              </div>
            </div>
          )}

          {availableRides.length === 0 && (
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
                
                <h3 className="font-bold text-gray-900 text-2xl mb-8 mt-2 pr-12">Detalhes do Trajeto</h3>

                <div className="grid sm:grid-cols-2 gap-8">
                  {/* Lado Esquerdo do Modal (Rota e Mapa) */}
                  <div className="space-y-6">
                    {/* Bloco Mapa (Placeholder) */}
                    <div className="w-full h-40 bg-gray-100 rounded-2xl relative overflow-hidden flex items-center justify-center border border-gray-200">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-30"></div>
                      <div className="relative z-10 px-4 py-2 bg-white/80 backdrop-blur border border-gray-200 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                        <Map className="w-4 h-4 text-green-600" /> Integração Maps (Em Breve)
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
                  <span className="text-3xl font-black text-green-600">R$ {selectedRide.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => handleRideRequest(selectedRide)}
                  className="w-full sm:w-auto px-10 py-3.5 bg-green-600 text-white rounded-full font-bold text-sm hover:bg-green-700 active:scale-95 transition-all"
                >
                  Solicitar Vaga
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