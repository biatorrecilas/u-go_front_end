import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { motion } from "motion/react";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Car,
  DollarSign,
  Shield,
  Sparkles,
  Navigation,
  User,
  Bike,
  Bus,
  Truck,
  CreditCard,
  Tag
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export function CreateRide() {
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
    womenOnly: false,
    recurringDays: [] as string[],
    notes: "",
    whatsapp: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Carona criada:", formData);
    // Aqui seria a lógica para salvar a carona
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

  const weekDays = [
    { id: "seg", label: "Seg" },
    { id: "ter", label: "Ter" },
    { id: "qua", label: "Qua" },
    { id: "qui", label: "Qui" },
    { id: "sex", label: "Sex" },
  ];

  const vehicleTypes = [
    { id: "car", label: "Carro", icon: Car, seats: 4 },
    { id: "suv", label: "SUV/Van", icon: Bus, seats: 20 },
    { id: "motorcycle", label: "Moto", icon: Bike, seats: 1 },
  ];

  const currentVehicle = vehicleTypes.find(v => v.id === formData.vehicleType) || vehicleTypes[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
                <Car className="w-4 h-4" />
                <span className="text-sm font-medium">Oferecer Carona</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Crie sua carona universitária
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Compartilhe seu trajeto, ajude outros estudantes e contribua para um planeta mais sustentável
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Origem e Destino */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      Origem
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      placeholder="Ex: Centro - Campinas"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Navigation className="w-4 h-4 text-green-600" />
                      Destino
                    </label>
                    <select
                      required
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Selecione o destino</option>
                      {/* <option value="USF Sagrado">USF Sagrado</option>
                      <option value="PUC-Campinas">PUC-Campinas</option>
                      <option value="FACAMP">FACAMP</option> */}
                      <option value="USF Sagrado">USF Sagrado</option>
                    </select>
                  </div>
                </div>

                {/* Data e Horário */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      Data
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      Horário
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Tipo de Veículo */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Tipo de Veículo
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {vehicleTypes.map((vehicle) => {
                      const Icon = vehicle.icon;
                      return (
                        <button
                          key={vehicle.id}
                          type="button"
                          onClick={() => setFormData({ 
                            ...formData, 
                            vehicleType: vehicle.id, 
                            totalSeats: vehicle.seats,
                            availableSeats: []
                          })}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            formData.vehicleType === vehicle.id
                              ? "border-green-500 bg-green-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <Icon className={`w-8 h-8 mx-auto mb-2 ${
                            formData.vehicleType === vehicle.id ? "text-green-600" : "text-gray-600"
                          }`} />
                          <div className="text-sm font-medium text-gray-900">{vehicle.label}</div>
                          <div className="text-xs text-gray-500">{vehicle.seats} {vehicle.seats === 1 ? 'assento' : 'assentos'}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Modelo e Placa */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      Modelo do veículo
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.vehicleModel}
                      onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                      placeholder="Ex: Honda Fit 2022"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <CreditCard className="w-4 h-4 text-green-600" />
                      Placa do veículo
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.licensePlate}
                      onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                      placeholder="Ex: ABC1D23"
                      maxLength={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Seletor Visual de Assentos */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Selecione os assentos disponíveis para passageiros
                  </label>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    {formData.vehicleType === "motorcycle" ? (
                      <div className="text-center">
                        <Bike className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">Moto possui apenas 1 assento para passageiro</p>
                        <button
                          type="button"
                          onClick={() => toggleSeat(1)}
                          className={`mt-4 px-6 py-3 rounded-lg font-medium transition-all ${
                            formData.availableSeats.includes(1)
                              ? "bg-green-500 text-white"
                              : "bg-white border-2 border-gray-300 text-gray-700 hover:border-green-500"
                          }`}
                        >
                          {formData.availableSeats.includes(1) ? "Assento Disponível ✓" : "Tornar Disponível"}
                        </button>
                      </div>
                    ) : (
                      <div className="max-w-sm mx-auto">
                        {/* Motorista */}
                        <div className="mb-6 text-center">
                          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg">
                            <User className="w-4 h-4" />
                            <span className="text-sm font-medium">Motorista</span>
                          </div>
                        </div>
                        
                        {/* Assentos */}
                        <div className="grid grid-cols-2 gap-4">
                          {Array.from({ length: currentVehicle.seats }, (_, i) => i + 1).map((seatNum) => (
                            <button
                              key={seatNum}
                              type="button"
                              onClick={() => toggleSeat(seatNum)}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                formData.availableSeats.includes(seatNum)
                                  ? "border-green-500 bg-green-500 text-white"
                                  : "border-gray-300 bg-white text-gray-700 hover:border-green-500"
                              }`}
                            >
                              <Users className="w-6 h-6 mx-auto mb-1" />
                              <div className="text-sm font-medium">Assento {seatNum}</div>
                              <div className="text-xs mt-1">
                                {formData.availableSeats.includes(seatNum) ? "Disponível" : "Indisponível"}
                              </div>
                            </button>
                          ))}
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-4 text-center">
                          {formData.availableSeats.length} de {currentVehicle.seats} assentos disponíveis
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Carona Recorrente */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Carona Recorrente (opcional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {weekDays.map((day) => (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => toggleRecurringDay(day.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          formData.recurringDays.includes(day.id)
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Selecione os dias da semana em que essa carona se repete
                  </p>
                </div>

                {/* Valor e WhatsApp */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      Contribuição por pessoa (R$)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.50"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Ex: 5.00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      WhatsApp para contato
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="Ex: (19) 99999-9999"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Opção Exclusiva para Mulheres */}
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.womenOnly}
                      onChange={(e) => setFormData({ ...formData, womenOnly: e.target.checked })}
                      className="mt-1 w-5 h-5 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-pink-600" />
                        <span className="font-medium text-gray-900">Carona exclusiva para mulheres</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Apenas passageiras do sexo feminino poderão solicitar esta carona
                      </p>
                    </div>
                  </label>
                </div>

                {/* Observações */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Observações (opcional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Ex: Ponto de encontro, preferências de música, ar-condicionado, etc."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Security Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Sua privacidade está protegida</h4>
                      <p className="text-sm text-gray-600">
                        Seus dados pessoais permanecem anônimos até que você aceite uma solicitação de carona.
                        Apenas após a confirmação mútua os nomes e contatos são revelados.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link
                    to="/caronas"
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Publicar Carona
                  </button>
                </div>
              </form>
            </div>

            {/* Impact Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white"
            >
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Impacto Estimado desta Carona
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">~{formData.seats || "0"}</div>
                  <div className="text-sm opacity-90">Pessoas ajudadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">~{(Number(formData.seats || 0) * 3.5).toFixed(1)} kg</div>
                  <div className="text-sm opacity-90">CO₂ evitado</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">R$ {(Number(formData.price || 0) * Number(formData.seats || 0)).toFixed(2)}</div>
                  <div className="text-sm opacity-90">Você economiza</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}