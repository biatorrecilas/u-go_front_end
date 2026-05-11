import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { 
  Award, 
  Calendar, 
  Leaf, 
  Users, 
  TrendingUp,
  Car,
  Clock,
  Sparkles,
  Target,
  Trophy,
  Star,
  Pencil,
  X,
  Camera,
  Image as ImageIcon,
  CheckCircle2
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import { Progress } from "../components/ui/progress";
import { useAuthSession } from "../auth";
import { useState } from "react";
import { toast } from "sonner";

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
  const session = useAuthSession();
  
  // Pegamos o nome vindo do login/sessão
  const userName = session?.name ?? "Ana Silva";
  
  // Geramos a URL com as iniciais dinâmicas baseadas no nome
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=e2e8f0&color=64748b&font-size=0.33`;

  const [user, setUser] = useState({
    name: userName,
    university: session?.university ?? "USF Sagrado",
    course: session?.course ?? "Engenharia de Computação",
    memberSince: "Abril 2026",
    avatar: session?.avatar || defaultAvatar,
    coverPhoto: "", 
    bio:
      session != null
        ? `Estudante de ${session.course} na ${session.university}, conectando trajetos com mais segurança e praticidade.`
        : "Apaixonada por sustentabilidade e tecnologia. Sempre buscando formas de contribuir para um futuro mais verde! 🌱",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    avatar: user.avatar,
    coverPhoto: user.coverPhoto,
    bio: user.bio,
  });

  const handleSaveProfile = () => {
    setUser({ ...user, ...editForm });
    setIsEditModalOpen(false);

    // Notificação seguindo o mesmo padrão do FindRides
    toast.custom(() => (
      <div className="pointer-events-auto flex w-[min(24rem,calc(100vw-2rem))] items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_18px_45px_-24px_rgba(5,150,105,0.5)]">
        <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
        </span>
        <span className="flex flex-col gap-1">
          <span className="font-medium text-gray-900">
            Perfil atualizado!
          </span>
          <span className="text-xs leading-relaxed text-gray-500">
            Suas informações foram salvas com sucesso.
          </span>
        </span>
      </div>
    ), {
      duration: 3500,
      unstyled: true,
    });
  };

  const stats: Stats = {
    totalRides: 47,
    co2Saved: 156.8,
    moneySaved: 890.50,
    treesEquivalent: 12,
  };

  const badges: Badge[] = [
    { id: "1", title: "Eco Iniciante", description: "Completou 10 caronas", icon: Leaf, color: "from-green-400 to-emerald-500", earned: true },
    { id: "2", title: "Protetor Ambiental", description: "Economizou 100kg de CO₂", icon: Award, color: "from-blue-400 to-cyan-500", earned: true },
    { id: "3", title: "Viajante Regular", description: "30 caronas compartilhadas", icon: Car, color: "from-purple-400 to-pink-500", earned: true },
    { id: "4", title: "Pontual", description: "Sempre no horário em 20 viagens", icon: Clock, color: "from-orange-400 to-red-500", earned: true },
    { id: "5", title: "Colaborador Estrela", description: "Avaliação média 4.8+", icon: Star, color: "from-yellow-400 to-orange-500", earned: true },
    { id: "6", title: "Eco Mestre", description: "100 caronas compartilhadas", icon: Trophy, color: "from-green-500 to-emerald-600", earned: false, progress: 47, target: 100 },
    { id: "7", title: "Guardião do Planeta", description: "Economize 500kg de CO₂", icon: Sparkles, color: "from-teal-400 to-green-500", earned: false, progress: 156.8, target: 500 },
    { id: "8", title: "Líder Comunitário", description: "Ajude 50 pessoas diferentes", icon: Users, color: "from-indigo-400 to-purple-500", earned: false, progress: 23, target: 50 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Header />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="relative">
              <div className="relative h-48 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500">
                {user.coverPhoto && (
                  <img src={user.coverPhoto} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/10"></div>
              </div>

              {/* Avatar */}
              <div className="absolute -bottom-16 left-8 z-20">
                <div className="relative">
                  <ImageWithFallback
                    src={user.avatar}
                    alt={user.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
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
                
                <button 
                  onClick={() => {
                    setEditForm({ avatar: user.avatar, coverPhoto: user.coverPhoto, bio: user.bio });
                    setIsEditModalOpen(true);
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-500 rounded-full hover:bg-green-50 hover:text-green-600 border border-gray-200 hover:border-green-200 transition-all shadow-sm"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

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
                <div className="bg-green-100 p-3 rounded-lg"><Car className="w-6 h-6 text-green-600" /></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-emerald-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">CO₂ Economizado</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.co2Saved}kg</p>
                </div>
                <div className="bg-emerald-100 p-3 rounded-lg"><Leaf className="w-6 h-6 text-emerald-600" /></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Economia Total</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">R$ {stats.moneySaved.toFixed(2)}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg"><TrendingUp className="w-6 h-6 text-blue-600" /></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-teal-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Árvores Equivalentes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.treesEquivalent}</p>
                </div>
                <div className="bg-teal-100 p-3 rounded-lg"><Leaf className="w-6 h-6 text-teal-600" /></div>
              </div>
            </div>
          </motion.div>

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
                    className={`bg-white rounded-xl shadow-lg p-6 relative overflow-hidden ${!badge.earned ? "opacity-60" : ""}`}
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${badge.color} opacity-10 rounded-full -mr-16 -mt-16`}></div>
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center mb-4 relative z-10`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{badge.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                    {badge.earned ? (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                        <Trophy className="w-4 h-4" /> <span>Conquistada!</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Progresso</span> <span>{badge.progress}/{badge.target}</span>
                        </div>
                        <Progress value={(badge.progress! / badge.target!) * 100} className="h-2" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />

      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col border border-gray-100 relative"
            >
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="absolute top-5 right-5 z-20 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 pb-6 overflow-y-auto max-h-[85vh]">
                <h3 className="font-bold text-gray-900 text-2xl mb-8">Editar Perfil</h3>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Foto de Capa</label>
                    <div className="h-32 w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-green-400 transition-all relative overflow-hidden group">
                      {editForm.coverPhoto && <img src={editForm.coverPhoto} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />}
                      <ImageIcon className="w-6 h-6 text-gray-400 mb-2 relative z-10" />
                      <span className="text-xs font-bold text-gray-500 relative z-10">Alterar capa</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Foto de Perfil</label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={editForm.avatar} className="w-20 h-20 rounded-full object-cover border-2 border-gray-100" alt="Avatar Preview" />
                        <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-sm border border-gray-200 text-gray-500 hover:text-green-600 transition-colors">
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">Clique na câmera para enviar uma nova foto de perfil.</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Sobre você</label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none transition-all"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 px-8 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
                <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleSaveProfile} className="px-8 py-2.5 bg-green-600 text-white rounded-full font-bold text-sm hover:bg-green-700 active:scale-95 transition-all">
                  Salvar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}