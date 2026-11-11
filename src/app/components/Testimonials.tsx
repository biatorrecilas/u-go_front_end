import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Sprout, Heart, Zap } from "lucide-react";

const testimonials = [
  {
    name: "Ana Silva",
    course: "Engenharia Ambiental",
    image:
      "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2ZpbGUlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzMzMzc4NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    text: "A opção de mulheres apenas foi essencial pra mim. Me sinto segura e já fiz várias amigas! O sistema de badges me motiva a usar sempre.",
    badges: [
      { icon: Heart, color: "text-pink-500" },
      { icon: Sprout, color: "text-green-500" },
    ],
  },
  {
    name: "Carlos Mendes",
    course: "Ciência da Computação",
    image:
      "https://images.unsplash.com/photo-1673505705697-763b670e9afd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudCUyMG1hbiUyMGJhY2twYWNrfGVufDF8fHx8MTc3MzMzNzgwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    text: "As rotas anônimas são geniais! Só conheço a pessoa depois de confirmar. A tecnologia de segurança de dados me dá total confiança.",
    badges: [
      { icon: Zap, color: "text-yellow-500" },
      { icon: Sprout, color: "text-green-500" },
    ],
  },
  {
    name: "Julia Santos",
    course: "Medicina",
    image:
      "https://images.unsplash.com/photo-1758270705902-f50dde4add9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY29sbGVnZSUyMHN0dWRlbnRzJTIwZnJpZW5kc3xlbnwxfHx8fDE3NzMzNDA2MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    text: "Economizo dinheiro e ajudo o planeta! Ver quanto CO₂ eu economizei é incrível. As badges me motivam a continuar compartilhando.",
    badges: [
      { icon: Sprout, color: "text-green-500" },
      { icon: Heart, color: "text-pink-500" },
    ],
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            O que nossa comunidade diz
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Estudantes já estão economizando, fazendo novos amigos
            e contribuindo para um planeta mais sustentável.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-50 to-green-50/50 p-6 rounded-xl border border-gray-200"
            >
              <div className="flex gap-2 mb-4">
                {testimonial.badges.map((badge, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm"
                  >
                    <badge.icon className={`w-5 h-5 ${badge.color}`} />
                  </div>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-green-200">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.course}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
