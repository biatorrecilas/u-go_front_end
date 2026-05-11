import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { motion } from "motion/react";
import { 
  Leaf, 
  Target, 
  Heart, 
  Users, 
  Award,
  TreePine,
  Lightbulb,
  Shield,
  TrendingUp,
  Globe,
  Zap,
  Sparkles,
  Linkedin // Ícone adicionado
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function About() {
  const stats = [
    { value: "2.5k+", label: "Estudantes ativos", icon: Users },
    { value: "10k+", label: "Caronas realizadas", icon: TrendingUp },
    { value: "3.2 ton", label: "CO₂ economizado", icon: Leaf },
    { value: "156", label: "Árvores equivalentes", icon: TreePine },
  ];

  const values = [
    {
      icon: Leaf,
      title: "Sustentabilidade",
      description: "Comprometidos em reduzir a pegada de carbono e promover práticas ambientalmente responsáveis.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Shield,
      title: "Segurança",
      description: "Verificação de identidade, rotas anônimas e recursos exclusivos para garantir a segurança de todos.",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Heart,
      title: "Comunidade",
      description: "Construindo uma rede de estudantes que se apoiam mutuamente em suas jornadas diárias.",
      color: "from-pink-500 to-rose-600",
    },
    {
      icon: Lightbulb,
      title: "Inovação",
      description: "Utilizando tecnologia de ponta para criar soluções inteligentes e eficientes para mobilidade urbana.",
      color: "from-purple-500 to-indigo-600",
    },
  ];

  // Função para gerar o avatar cinza dinâmico
  const getAvatar = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e2e8f0&color=64748b&size=400`;

  // Array expandido para 11 membros
  const team = [
    {
      name: "Membro 1",
      role: "CEO & Fundador(a)",
      image: getAvatar("Membro 1"),
      bio: "Especialista em visão estratégica e liderança do projeto.",
      linkedin: "#",
    },
    {
      name: "Membro 2",
      role: "CTO",
      image: getAvatar("Membro 2"),
      bio: "Responsável por toda a arquitetura e desenvolvimento do sistema.",
      linkedin: "#",
    },
    {
      name: "Membro 3",
      role: "Head de Design",
      image: getAvatar("Membro 3"),
      bio: "Focado em criar as melhores experiências para os usuários (UX/UI).",
      linkedin: "#",
    },
    {
      name: "Membro 4",
      role: "Head de Operações",
      image: getAvatar("Membro 4"),
      bio: "Cuida da logística, escalabilidade e processos diários.",
      linkedin: "#",
    },
    {
      name: "Membro 5",
      role: "Desenvolvedor(a) Frontend",
      image: getAvatar("Membro 5"),
      bio: "Transforma design em interfaces interativas e responsivas.",
      linkedin: "#",
    },
    {
      name: "Membro 6",
      role: "Desenvolvedor(a) Backend",
      image: getAvatar("Membro 6"),
      bio: "Garante a segurança, rotas e banco de dados da plataforma.",
      linkedin: "#",
    },
    {
      name: "Membro 7",
      role: "Engenheiro(a) de Dados",
      image: getAvatar("Membro 7"),
      bio: "Estrutura as métricas de carbono e inteligência de rotas.",
      linkedin: "#",
    },
    {
      name: "Membro 8",
      role: "Marketing & Growth",
      image: getAvatar("Membro 8"),
      bio: "Focado em aquisição de usuários e expansão da comunidade.",
      linkedin: "#",
    },
    {
      name: "Membro 9",
      role: "Community Manager",
      image: getAvatar("Membro 9"),
      bio: "Faz a ponte entre a plataforma e as necessidades dos universitários.",
      linkedin: "#",
    },
    {
      name: "Membro 10",
      role: "QA & Testes",
      image: getAvatar("Membro 10"),
      bio: "Assegura que todas as funcionalidades rodem sem bugs.",
      linkedin: "#",
    },
    {
      name: "Membro 11",
      role: "Analista de Sustentabilidade",
      image: getAvatar("Membro 11"),
      bio: "Valida os impactos ambientais e métricas sustentáveis.",
      linkedin: "#",
    },
  ];

  const milestones = [
    {
      year: "2026.1",
      title: "Fundação",
      description: "U-Go nasceu com a missão de tornar o transporte universitário mais sustentável",
      icon: Sparkles,
    },
    {
      year: "2026.2",
      title: "Expansão",
      description: "Alcançar usuários ativos e consolidação da comunidade na USF",
      icon: TrendingUp,
    },
    {
      year: "2027",
      title: "Consolidação",
      description: "Mais estudantes conectados e CO₂ economizados",
      icon: Award,
    },
    {
      year: "Futuro",
      title: "Visão Global",
      description: "Expandir para mais universidades ao redor e promover impacto ambiental em escala",
      icon: Globe,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-20"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Transformando mobilidade em{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                sustentabilidade
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos uma plataforma que conecta estudantes universitários para compartilhar caronas,
              reduzir custos e construir um futuro mais verde, um trajeto de cada vez.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 text-center"
                >
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Nossa Missão</h2>
              </div>
              
              <p className="text-lg text-gray-700 mb-6">
                Criar uma rede de mobilidade sustentável que conecte estudantes universitários,
                promovendo economia, redução de emissões e fortalecimento da comunidade acadêmica.
              </p>
              
              <p className="text-gray-600 mb-6">
                Acreditamos que cada carona compartilhada é um passo em direção a um futuro mais
                sustentável. Nossa plataforma não apenas facilita o compartilhamento de caronas,
                mas também educa e motiva os usuários a adotarem práticas mais conscientes.
              </p>

              <div className="flex items-start gap-4 bg-green-50 p-6 rounded-xl">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Impacto Real</p>
                  <p className="text-sm text-gray-700">
                    Cada carona compartilhada economiza em média 3.5kg de CO₂, equivalente
                    a plantar meia árvore por mês!
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1767768389516-265cdd50a243?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRlY2hub2xvZ3klMjBpbm5vdmF0aW9ufGVufDF8fHx8MTc3Mzg5MDYzNXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Tecnologia verde"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
                    <TreePine className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-gray-900 text-lg">156 árvores</span>
                </div>
                <p className="text-sm text-gray-600">
                  Impacto equivalente de caronas compartilhadas
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Valores
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Princípios que guiam cada decisão e ação que tomamos
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${value.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossa Jornada
            </h2>
            <p className="text-lg text-gray-600">
              Do início até onde estamos hoje e para onde vamos
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-emerald-500 to-teal-500 hidden md:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative flex gap-6 items-start"
                  >
                    <div className="hidden md:flex w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 items-center justify-center flex-shrink-0 relative z-10">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-lg p-6 flex-1 hover:shadow-xl transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {milestone.year}
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-green-200 to-transparent"></div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section Atualizada */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Conheça Nossa Equipe
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pessoas apaixonadas trabalhando para tornar a mobilidade mais sustentável
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }} // delay reduzido para carregar os 11 mais fluidos
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col max-w-[260px] mx-auto"
              >
                <div className="relative h-52">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-xs text-green-600 font-bold uppercase tracking-wider">{member.role}</p>
                    </div>
                    {/* Link do LinkedIn */}
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-400 hover:text-green-600 transition-colors p-1"
                      title={`LinkedIn de ${member.name}`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}