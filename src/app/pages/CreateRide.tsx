import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Car,
  CheckCircle2,
  DollarSign,
  Sparkles,
  Navigation,
  User,
  Bike,
  CreditCard,
  Tag,
  Map,
  X
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export function CreateRide() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    date: "",
    time: "",
    vehicleType: "car",
    vehicleModel: "",
    licensePlate: "",
    totalSeats: 4,
    availableSeats: [] as number[],
    price: "",
    exclusiveTo: "none", // "none" | "women" | "men"
    recurringDays: [] as string[],
    notes: "",
    whatsapp: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [showMapModal, setShowMapModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação dos campos obrigatórios
    const requiredFields = ['origin', 'destination', 'date', 'time', 'vehicleModel', 'licensePlate', 'price', 'whatsapp'];
    const newErrors: string[] = [];
    
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors.push(field);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);
    console.log("Carona criada com sucesso:", formData);
    toast.custom(() => (
      <div className="pointer-events-auto flex w-[min(24rem,calc(100vw-2rem))] items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_18px_45px_-24px_rgba(5,150,105,0.5)]">
        <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
        </span>
        <span className="flex flex-col gap-1">
          <span className="font-medium text-gray-900">Carona criada com sucesso!</span>
          <span className="text-xs leading-relaxed text-gray-500">
            Visualize e acompanhe sua carona
          </span>
        </span>
      </div>
    ), {
      duration: 3500,
      unstyled: true,
    });
    navigate("/acompanhar-carona");
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.includes(field)) {
      setErrors(errors.filter(e => e !== field));
    }
  };

  // Máscara do WhatsApp: (XX) XXXXX-XXXX
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
    
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); // Coloca parênteses
      value = value.replace(/(\d)(\d{4})$/, "$1-$2");    // Coloca hífen
    }
    
    handleInputChange('whatsapp', value);
  };

  const toggleRecurringDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      recurringDays: prev.recurringDays.includes(day)
        ? prev.recurringDays.filter(d => d !== day)
        : [...prev.recurringDays, day]
    }));
  };

  const toggleSeat = (seatNumber: number) => {
    setFormData(prev => ({
      ...prev,
      availableSeats: prev.availableSeats.includes(seatNumber)
        ? prev.availableSeats.filter(s => s !== seatNumber)
        : [...prev.availableSeats, seatNumber]
    }));
  };

  const adjustCarSeats = (direction: "increase" | "decrease") => {
    setFormData((prev) => {
      if (prev.vehicleType !== "car") return prev;
      const nextTotalSeats = direction === "increase" ? Math.min(prev.totalSeats + 1, 7) : Math.max(prev.totalSeats - 1, 4);
      return {
        ...prev,
        totalSeats: nextTotalSeats,
        availableSeats: prev.availableSeats.filter((seat) => seat <= nextTotalSeats),
      };
    });
  };

  const toggleExclusivity = (type: "women" | "men") => {
    setFormData(prev => ({
      ...prev,
      exclusiveTo: prev.exclusiveTo === type ? "none" : type
    }));
  };

  const getFieldClass = (fieldName: string, baseClass: string) => {
    const hasError = errors.includes(fieldName);
    return `${baseClass} border transition-colors duration-300 ${
      hasError 
        ? 'border-red-400 bg-red-50/30' 
        : 'border-gray-200 focus-within:border-green-500 bg-gray-50'
    }`;
  };

  const weekDays = [
    { id: "seg", label: "Seg" }, { id: "ter", label: "Ter" },
    { id: "qua", label: "Qua" }, { id: "qui", label: "Qui" }, { id: "sex", label: "Sex" },
  ];

  const passengerSeatCount = formData.vehicleType === "motorcycle" ? 1 : formData.totalSeats;
  const estimatedPassengers = formData.availableSeats.length;

  const impactVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.2 }
    }
  };

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 200, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 font-sans relative overflow-x-hidden flex flex-col">
      <Header />
      
      {/* Estilo embutido para remover os ícones nativos de calendário e relógio */}
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          opacity: 0;
          position: absolute;
          right: 0;
          width: 100%;
        }
      `}</style>

      {/* Conteúdo Principal (Formulário) */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex justify-center flex-grow relative z-10">
        <div className="w-full max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                Oferecer Carona
              </h1>
              <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
                Compartilhe seu trajeto e conecte-se com outros estudantes
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-5 sm:p-8 border border-white relative z-10">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                
                {/* BLOCO 1: ROTA */}
                <div className="relative">
                  <div className="absolute left-[31px] top-[40px] bottom-[40px] w-0.5 bg-gray-200 rounded-full z-0 hidden sm:block"></div>
                  <div className="space-y-3 relative z-10">
                    
                    {/* Origem */}
                    <div className={getFieldClass('origin', 'relative flex flex-col sm:flex-row sm:items-center rounded-2xl p-2')}>
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm text-green-600 shrink-0 hidden sm:flex border border-gray-100">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="flex-1 px-4 py-2 sm:py-0">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Origem</label>
                        <input
                          type="text" value={formData.origin}
                          onChange={(e) => handleInputChange('origin', e.target.value)}
                          placeholder="Ex: Centro - Campinas"
                          className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 placeholder-gray-400 font-medium outline-none"
                        />
                      </div>
                    </div>

                    <div className="absolute right-4 top-[50%] -translate-y-1/2 z-20 hidden sm:block">
                      <button 
                        type="button" onClick={() => setShowMapModal(true)}
                        className="p-3 bg-white rounded-full shadow-md border border-gray-100 text-green-600 hover:text-white hover:bg-green-600 transition-colors hover:scale-105 active:scale-95 group flex items-center gap-2"
                        title="Escolher no mapa"
                      >
                        <Map className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Destino */}
                    <div className={getFieldClass('destination', 'relative flex flex-col sm:flex-row sm:items-center rounded-2xl p-2 mt-2 sm:mt-0')}>
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-600 text-white shadow-sm shrink-0 hidden sm:flex">
                        <Navigation className="w-5 h-5" />
                      </div>
                      <div className="flex-1 px-4 py-2 sm:py-0">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Destino</label>
                        <input
                          type="text" value={formData.destination}
                          onChange={(e) => handleInputChange('destination', e.target.value)}
                          placeholder="Ex: USF Sagrado"
                          className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 placeholder-gray-400 font-medium outline-none"
                        />
                      </div>
                    </div>

                    <button 
                      type="button" onClick={() => setShowMapModal(true)}
                      className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 sm:hidden text-sm font-semibold"
                    >
                      <Map className="w-4 h-4" /> Abrir Mapa
                    </button>
                  </div>
                </div>

                {/* BLOCO 2: DATA E HORA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={getFieldClass('date', 'rounded-2xl px-4 py-3.5 flex items-center gap-3 relative')}>
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Data</label>
                      <input
                        type="date" value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none relative z-10"
                      />
                    </div>
                  </div>

                  <div className={getFieldClass('time', 'rounded-2xl px-4 py-3.5 flex items-center gap-3 relative')}>
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Horário de Partida</label>
                      <input
                        type="time" value={formData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none relative z-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-gray-100" />

                {/* BLOCO 3: VEÍCULO */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Qual veículo você vai utilizar?</label>
                    <div className="relative z-10 grid w-full max-w-sm grid-cols-2 rounded-full bg-gray-100 p-1.5 shadow-inner">
                      <div
                        className={`absolute bottom-1.5 left-1.5 top-1.5 w-[calc(50%-6px)] rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
                          formData.vehicleType === "motorcycle" ? "translate-x-full" : "translate-x-0"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, vehicleType: "car", totalSeats: 4, availableSeats: [] })}
                        className={`relative z-10 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold transition-colors ${
                          formData.vehicleType === "car" ? "text-green-600" : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Car className="w-4 h-4" /> Carro
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, vehicleType: "motorcycle", totalSeats: 1, availableSeats: [] })}
                        className={`relative z-10 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold transition-colors ${
                          formData.vehicleType === "motorcycle" ? "text-green-600" : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Bike className="w-4 h-4" /> Moto
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={getFieldClass('vehicleModel', 'rounded-2xl px-4 py-3')}>
                      <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1"><Tag className="w-3 h-3"/> Modelo</label>
                      <input
                        type="text" value={formData.vehicleModel}
                        onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                        placeholder="Ex: Honda Fit"
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none"
                      />
                    </div>
                    <div className={getFieldClass('licensePlate', 'rounded-2xl px-4 py-3')}>
                      <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1"><CreditCard className="w-3 h-3"/> Placa</label>
                      <input
                        type="text" value={formData.licensePlate}
                        onChange={(e) => handleInputChange('licensePlate', e.target.value.toUpperCase())}
                        placeholder="ABC1D23" maxLength={8}
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* BLOCO 4: ASSENTOS */}
                <div className="bg-gray-50 rounded-3xl p-5 border border-gray-200">
                  <label className="text-sm font-semibold text-gray-700 mb-4 block">Quais assentos estão livres? Selecione abaixo</label>
                  {formData.vehicleType === "motorcycle" ? (
                    <button
                      type="button"
                      onClick={() => toggleSeat(1)}
                      className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        formData.availableSeats.includes(1)
                          ? "bg-green-600 text-white border border-green-600"
                          : "bg-white border border-gray-300 text-gray-700 hover:border-green-600 hover:text-green-600"
                      }`}
                    >
                      <Bike className="w-4 h-4" />
                      {formData.availableSeats.includes(1) ? "Garupa Disponível" : "Liberar Garupa"}
                    </button>
                  ) : (
                    <div>
                      <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                        <div className="flex-shrink-0 inline-flex items-center gap-2 bg-gray-200/70 text-gray-600 px-4 py-3 rounded-2xl text-sm font-semibold border border-transparent">
                          <User className="w-4 h-4" /> Motorista
                        </div>
                        {Array.from({ length: passengerSeatCount }, (_, i) => i + 1).map((seatNum) => {
                          const isAvailable = formData.availableSeats.includes(seatNum);
                          return (
                            <button
                              key={seatNum} type="button" onClick={() => toggleSeat(seatNum)}
                              className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all text-sm font-bold ${
                                isAvailable
                                  ? "border-green-600 bg-green-50 text-green-600"
                                  : "border-gray-300 bg-white text-gray-500 hover:border-green-400 hover:text-green-600"
                              }`}
                            >
                              <Users className={`w-4 h-4 ${isAvailable ? "text-green-600" : "text-gray-400"}`} />
                              Vaga {seatNum}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 px-1">
                        <button
                          type="button" onClick={() => adjustCarSeats("increase")} disabled={formData.totalSeats === 7}
                          className="text-xs font-semibold text-green-600 hover:text-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          + Adicionar assento extra
                        </button>
                        {formData.totalSeats > 4 && (
                          <button
                            type="button" onClick={() => adjustCarSeats("decrease")}
                            className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                          >
                            Remover último
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-px w-full bg-gray-100" />

                {/* BLOCO 5: EXTRAS */}
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Carona Exclusiva (Opcional)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                      <button
                        type="button" onClick={() => toggleExclusivity("women")}
                        className={`py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                          formData.exclusiveTo === "women"
                            ? "bg-pink-50 border-pink-300 text-pink-700"
                            : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100 border-gray-200"
                        }`}
                      >
                        <User className="w-4 h-4" />
                        <span className="font-bold text-sm">Apenas Mulheres</span>
                      </button>
                      <button
                        type="button" onClick={() => toggleExclusivity("men")}
                        className={`py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                          formData.exclusiveTo === "men"
                            ? "bg-blue-50 border-blue-300 text-blue-700"
                            : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100 border-gray-200"
                        }`}
                      >
                        <User className="w-4 h-4" />
                        <span className="font-bold text-sm">Apenas Homens</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Dias Recorrentes (Opcional)</label>
                    <div className="flex flex-wrap gap-2 relative z-10">
                      {weekDays.map((day) => (
                        <button
                          key={day.id} type="button" onClick={() => toggleRecurringDay(day.id)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                            formData.recurringDays.includes(day.id)
                              ? "bg-green-600 border-green-600 text-white"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                    <div className={getFieldClass('price', 'rounded-2xl px-4 py-3')}>
                      <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1"><DollarSign className="w-3 h-3"/> Contribuição (R$)</label>
                      <input
                        type="number" min="0" step="0.50" value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="Ex: 5.00"
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none"
                      />
                    </div>
                    <div className={getFieldClass('whatsapp', 'rounded-2xl px-4 py-3')}>
                      <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">WhatsApp</label>
                      <input
                        type="tel" 
                        value={formData.whatsapp}
                        maxLength={15}
                        onChange={handleWhatsappChange}
                        placeholder="(19) 99999-9999"
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 focus-within:border-green-500 rounded-2xl px-4 py-3 transition-colors duration-300 relative z-10">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Observações</label>
                    <input
                      type="text" value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Ex: Ponto de encontro, ar-condicionado..."
                      className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm font-medium outline-none"
                    />
                  </div>
                </div>

                {/* Mensagem de Erro */}
                <AnimatePresence>
                  {errors.length > 0 && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-sm font-medium text-center"
                    >
                      Por favor, preencha os campos destacados em vermelho.
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* BOTÕES FINAIS */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 relative z-10">
                  <Link
                    to="/caronas"
                    className="w-full sm:flex-1 py-3.5 border border-gray-300 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors text-center"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    className="w-full sm:flex-[2] text-sm font-semibold tracking-wide text-green-600 py-3.5 rounded-full border border-green-200 bg-green-50 transition-all duration-300 hover:bg-green-600 hover:border-green-600 hover:text-white hover:shadow-md active:scale-[0.98]"
                  >
                    Publicar Carona
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      <div aria-hidden="true" className="relative z-10 -mt-10 flex justify-center px-4">
        <div className="flex flex-col items-center">
          <span className="h-12 w-px rounded-full bg-gray-300 sm:h-14" />
        </div>
      </div>

      {/* IMPACTO SUSTENTÁVEL COM ANIMAÇÃO EM LARGURA TOTAL */}
      <motion.div
        variants={impactVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="w-full relative pt-6 pb-20 overflow-hidden"
      >
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-6 text-center">
            <Sparkles className="w-5 h-5 text-green-600 hidden sm:block" />
            <h3 className="text-gray-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs">
              Impacto Estimado desta Carona
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <motion.div variants={numberVariants} className="text-center px-2">
              <div className="text-3xl font-black text-green-600 mb-1">{estimatedPassengers}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Universitários</div>
            </motion.div>
            <motion.div variants={numberVariants} className="text-center px-2">
              <div className="text-3xl font-black text-green-600 mb-1">{(estimatedPassengers * 3.5).toFixed(1)}<span className="text-sm font-bold text-green-600/50 ml-1">kg</span></div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">CO₂ Evitado</div>
            </motion.div>
            <motion.div variants={numberVariants} className="text-center px-2">
              <div className="text-3xl font-black text-green-600 mb-1"><span className="text-sm font-bold text-green-600/50 mr-1">R$</span>{(Number(formData.price || 0) * estimatedPassengers).toFixed(2)}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Economia</div>
            </motion.div>
          </div>
        </div>

        {/* ANIMAÇÃO EM SVG EM FAIXA PRÓPRIA ABAIXO DAS INFORMAÇÕES */}
        <div className="relative left-1/2 mt-8 h-[280px] w-screen -translate-x-1/2 pointer-events-none sm:h-[340px]">
          <div className="absolute inset-0 flex items-end justify-center opacity-80 overflow-hidden">
            <svg className="h-full w-full" preserveAspectRatio="xMidYMax slice" viewBox="0 0 1200 280">
            
            <defs>
              {/* Caminho da estrada - Curvas suaves */}
              <path id="rotaCarro" d="M -120 168 C 160 246, 380 84, 700 168 C 930 246, 1060 88, 1320 168" />
              
              {/* Árvore Estilo Desenho (Menor e verde claro) */}
              <g id="cuteTree">
                <rect x="-3" y="10" width="6" height="15" rx="2" fill="#b45309" />
                <circle cx="0" cy="-5" r="14" fill="#4ade80" />
                <circle cx="-7" cy="5" r="10" fill="#22c55e" />
                <circle cx="7" cy="5" r="10" fill="#22c55e" />
                <circle cx="0" cy="8" r="11" fill="#16a34a" />
              </g>

              {/* Estrelinha que pisca */}
              <g id="star">
                <path d="M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5 Z" fill="#facc15" />
                <animateTransform attributeName="transform" type="scale" values="0; 1; 0" dur="2s" repeatCount="indefinite" begin="0s" />
                <animate attributeName="opacity" values="0; 1; 0" dur="2s" repeatCount="indefinite" begin="0s" />
              </g>
            </defs>

            {/* Linha Tracejada (Estrada) */}
            <use xlinkHref="#rotaCarro" fill="none" stroke="#9ca3af" strokeWidth="3" strokeDasharray="10 10" opacity="0.6" />

            {/* Árvores posicionadas nas partes mais estreitas da curva, não no centro das barrigas */}
            <use xlinkHref="#cuteTree" transform="translate(500, 236) scale(0.88)" />
            <use xlinkHref="#cuteTree" transform="translate(220, 72) scale(1.05)" />
            <use xlinkHref="#cuteTree" transform="translate(920, 76) scale(0.96)" />

            {/* Chuva de Estrelinhas Comemorativas */}
            <use xlinkHref="#star" transform="translate(110, 128) scale(1.3)" />
            
            <use xlinkHref="#star" transform="translate(330, 212)" >
              <animateTransform attributeName="transform" type="scale" values="0; 1.5; 0" dur="2.5s" repeatCount="indefinite" begin="0.5s" additive="sum" />
            </use>
            
            <use xlinkHref="#star" transform="translate(520, 50) scale(1.2)" >
              <animateTransform attributeName="transform" type="scale" values="0; 0.8; 0" dur="1.8s" repeatCount="indefinite" begin="1s" additive="sum" />
            </use>
            
            <use xlinkHref="#star" transform="translate(690, 104) scale(1.35)" >
              <animateTransform attributeName="transform" type="scale" values="0; 1.3; 0" dur="3s" repeatCount="indefinite" begin="0.2s" additive="sum" />
            </use>

            <use xlinkHref="#star" transform="translate(830, 144) scale(0.95)" />

            <use xlinkHref="#star" transform="translate(1040, 30) scale(1.2)" >
               <animateTransform attributeName="transform" type="scale" values="0; 0.9; 0" dur="2.2s" repeatCount="indefinite" begin="1.5s" additive="sum" />
            </use>

            <use xlinkHref="#star" transform="translate(1125, 220) scale(1.3)" />

            {/* Carrinho Amarelo */}
            <g>
              <rect x="-13" y="-8" width="30" height="20" rx="5" fill="rgba(0,0,0,0.15)" />
              <rect x="-15" y="-10" width="30" height="20" rx="6" fill="#facc15" />
              <rect x="-7" y="-8" width="14" height="16" rx="2" fill="#1f2937" />
              <rect x="-4" y="-7" width="8" height="14" fill="#facc15" />
              <rect x="13" y="-8" width="3" height="4" rx="1" fill="#fef08a" />
              <rect x="13" y="4" width="3" height="4" rx="1" fill="#fef08a" />
              <rect x="-15" y="-8" width="2" height="4" rx="1" fill="#ef4444" />
              <rect x="-15" y="4" width="2" height="4" rx="1" fill="#ef4444" />

              <animateMotion dur="12s" repeatCount="indefinite" rotate="auto">
                <mpath xlinkHref="#rotaCarro" />
              </animateMotion>
            </g>
          </svg>
        </div>
        </div>
      </motion.div>

      {/* MODAL DO MAPA */}
      <AnimatePresence>
        {showMapModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-100 flex flex-col h-[70vh] sm:h-[80vh]"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10 relative">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                  <Map className="w-5 h-5 text-green-600" /> Escolha sua Rota no Mapa
                </h3>
                <button onClick={() => setShowMapModal(false)} className="p-2 text-gray-400 hover:text-gray-700 bg-gray-50 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 bg-gray-200 relative flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-20"></div>
                <div className="text-center z-10 p-5 sm:p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 w-full max-w-sm">
                  <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-800 text-base sm:text-lg">Integração Maps</h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Arraste os pinos para definir Origem e Destino exatos.</p>
                  <button onClick={() => setShowMapModal(false)} className="mt-4 w-full py-2.5 bg-green-600 text-white font-semibold rounded-full hover:bg-green-600 transition-colors text-sm">
                    Confirmar Trajeto
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}