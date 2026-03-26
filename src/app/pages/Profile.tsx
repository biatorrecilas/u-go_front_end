import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { 
  Award, 
  MapPin, 
  Calendar, 
  Leaf, 
  Users, 
  TrendingUp,
  Car,
  Clock,
  Sparkles,
  Target,
  Trophy,
  Star
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";
import { Progress } from "../components/ui/progress";

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: typeof Leaf;
  color: string;
  earned: boolean;
  progress?: number;
  target?: number;
}

interface Stats {
  totalRides: number;
  co2Saved: number;
  moneySaved: number;
  treesEquivalent: number;
}

export function Profile() {
  // Mock user data
  const user = {
    name: "Ana Silva",
    university: "USF Sagrado",
    course: "Engenharia Ambiental",
    memberSince: "Janeiro 2025",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "Apaixonada por sustentabilidade e tecnologia. Sempre buscando formas de contribuir para um futuro mais verde! 🌱",
  };

  const stats: Stats = {
    totalRides: 47,
    co2Saved: 156.8,
    moneySaved: 890.50,
    treesEquivalent: 12,
  };

  const badges: Badge[] = [
    {
      id: "1",
      title: "Eco Iniciante",
      description: "Completou 10 caronas",
      icon: Leaf,
      color: "from-green-400 to-emerald-500",
      earned: true,
    },
    {
      id: "2",
      title: "Protetor Ambiental",
      description: "Economizou 100kg de CO₂",
      icon: Award,
      color: "from-blue-400 to-cyan-500",
      earned: true,
    },
    {
      id: "3",
      title: "Viajante Regular",
      description: "30 caronas compartilhadas",
      icon: Car,
      color: "from-purple-400 to-pink-500",
      earned: true,
    },
    {
      id: "4",
      title: "Pontual",
      description: "Sempre no horário em 20 viagens",
      icon: Clock,
      color: "from-orange-400 to-red-500",
      earned: true,
    },
    {
      id: "5",
      title: "Colaborador Estrela",
      description: "Avaliação média 4.8+",
      icon: Star,
      color: "from-yellow-400 to-orange-500",
      earned: true,
    },
    {
      id: "6",
      title: "Eco Mestre",
      description: "100 caronas compartilhadas",
      icon: Trophy,
      color: "from-green-500 to-emerald-600",
      earned: false,
      progress: 47,
      target: 100,
    },
    {
      id: "7",
      title: "Guardião do Planeta",
      description: "Economize 500kg de CO₂",
      icon: Sparkles,
      color: "from-teal-400 to-green-500",
      earned: false,
      progress: 156.8,
      target: 500,
    },
    {
      id: "8",
      title: "Líder Comunitário",
      description: "Ajude 50 pessoas diferentes",
      icon: Users,
      color: "from-indigo-400 to-purple-500",
      earned: false,
      progress: 23,
      target: 50,
    },
  ];

  const recentRides = [
    {
      id: "1",
      from: "Barão Geraldo",
      to: "USF Sagrado",
      date: "15 Mar 2026",
      type: "Carona oferecida",
      passengers: 3,
    },
    {
      id: "2",
      from: "Centro",
      to: "USF Sagrado",
      date: "14 Mar 2026",
      type: "Carona recebida",
      passengers: 1,
    },
    {
      id: "3",
      from: "Cambuí",
      to: "USF Sagrado",
      date: "13 Mar 2026",
      type: "Carona oferecida",
      passengers: 2,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Header />
      
      {/* Hero Section */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="relative h-48 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute -bottom-16 left-8">
                <div className="relative">
                  <ImageWithFallback
                    src={user.avatar}
                    alt={user.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </div>
            </div>

            <div className="pt-20 pb-8 px-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-600 mt-1">{user.course} • {user.university}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Membro desde {user.memberSince}</span>
                  </div>
                  <p className="mt-4 text-gray-700 max-w-2xl">{user.bio}</p>
                </div>
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm whitespace-nowrap">
                  Editar Perfil
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Caronas Totais</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalRides}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Car className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+12 este mês</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-emerald-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">CO₂ Economizado</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.co2Saved}kg</p>
                </div>
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <Leaf className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm text-emerald-600">
                <Target className="w-4 h-4" />
                <span>Meta: 200kg</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Economia Total</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">R$ {stats.moneySaved.toFixed(2)}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-blue-600">
                <span>≈ R$ 18,94/carona</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-teal-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Árvores Equivalentes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.treesEquivalent}</p>
                </div>
                <div className="bg-teal-100 p-3 rounded-lg">
                  <Leaf className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-teal-600">
                <span>Impacto positivo! 🌳</span>
              </div>
            </div>
          </motion.div>

          {/* Badges Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Conquistas</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="w-5 h-5" />
                <span>{badges.filter(b => b.earned).length} de {badges.length} conquistadas</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {badges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={`bg-white rounded-xl shadow-lg p-6 relative overflow-hidden ${
                      !badge.earned ? "opacity-60" : ""
                    }`}
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${badge.color} opacity-10 rounded-full -mr-16 -mt-16`}></div>
                    
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center mb-4 relative z-10`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-1">{badge.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                    
                    {badge.earned ? (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                        <Trophy className="w-4 h-4" />
                        <span>Conquistada!</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Progresso</span>
                          <span>{badge.progress}/{badge.target}</span>
                        </div>
                        <Progress 
                          value={(badge.progress! / badge.target!) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Rides */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Caronas Recentes</h2>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {recentRides.map((ride, index) => (
                  <motion.div
                    key={ride.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          ride.type === "Carona oferecida" 
                            ? "bg-green-100" 
                            : "bg-blue-100"
                        }`}>
                          <Car className={`w-6 h-6 ${
                            ride.type === "Carona oferecida"
                              ? "text-green-600"
                              : "text-blue-600"
                          }`} />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{ride.from}</span>
                            <span className="text-gray-400">→</span>
                            <span className="font-medium text-gray-900">{ride.to}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{ride.date}</span>
                            <span>•</span>
                            <span>{ride.type}</span>
                            {ride.type === "Carona oferecida" && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {ride.passengers} passageiros
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                        Ver detalhes
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
