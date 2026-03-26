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
  Sparkles
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";

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

  const team = [
    {
      name: "Maria Costa",
      role: "CEO & Fundadora",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      bio: "Engenheira Ambiental com paixão por sustentabilidade",
    },
    {
      name: "João Santos",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bio: "Especialista em desenvolvimento de sistemas inteligentes",
    },
    {
      name: "Ana Oliveira",
      role: "Head de Design",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      bio: "Designer UX focada em experiências inclusivas",
    },
    {
      name: "Pedro Lima",
      role: "Head de Operações",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      bio: "Especialista em logística e otimização de rotas",
    },
  ];

  const milestones = [
    {
      year: "2024",
      title: "Fundação",
      description: "U-Go nasceu com a missão de tornar o transporte universitário mais sustentável",
      icon: Sparkles,
    },
    {
      year: "2025",
      title: "Expansão",
      description: "Alcançamos 1.000 usuários ativos e parcerias com 3 universidades",
      icon: TrendingUp,
    },
    {
      year: "2026",
      title: "Consolidação",
      description: "Mais de 2.500 estudantes conectados e 3.2 toneladas de CO₂ economizadas",
      icon: Award,
    },
    {
      year: "Futuro",
      title: "Visão Global",
      description: "Expandir para todas as universidades do Brasil e promover impacto ambiental em escala",
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
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6">
              <Leaf className="w-4 h-4" />
              <span className="text-sm font-medium">Sobre o U-Go</span>
            </div>
            
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
                  Impacto equivalente das nossas caronas compartilhadas
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
            {/* Timeline line */}
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

      {/* Team Section */}
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
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-green-600 font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-12 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Faça Parte Dessa Mudança
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Junte-se a estudantes da USF que já estão fazendo a diferença
            </p>
            <Link
              to="/cadastro"
              className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              Cadastre-se gratuitamente
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
