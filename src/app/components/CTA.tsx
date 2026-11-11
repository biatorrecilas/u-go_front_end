import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Link } from "react-router";

export function CTA() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1668097613569-3405bb63262b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGdyZWVuJTIwdGVjaG5vbG9neSUyMGlubm92YXRpb258ZW58MXx8fHwxNzczMjMwOTg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Tecnologia sustentável"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-5">
            Transforme sua ida para a USF
          </h2>
          <p className="text-base md:text-lg text-green-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Cadastre-se com seu e-mail institucional, divida os custos do trajeto com segurança e faça parte da revolução verde no campus.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/cadastro"
              className="px-7 py-3.5 bg-white text-green-700 rounded-xl hover:bg-green-50 transition-all text-base font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Começar Agora
            </Link>
            <Link
              to="/sobre"
              className="px-7 py-3.5 bg-transparent border-2 border-white/30 text-white rounded-xl hover:bg-white/10 hover:border-white transition-all text-base font-semibold"
            >
              Saiba Mais
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-green-100 font-medium">
            <span className="text-sm">Faça parte da comunidade universitária U-Go</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
