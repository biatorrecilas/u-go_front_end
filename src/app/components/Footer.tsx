import { Car, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">U-Go</span>
            </Link>
            <p className="text-sm text-gray-400">
              Conectando universitários de forma inteligente, segura e 
              sustentável. Tecnologia a favor do meio ambiente.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Projeto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-green-400 transition-colors">
                  Recursos
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-green-400 transition-colors">
                  Como Funciona
                </a>
              </li>
              <li>
                <a href="#innovation" className="hover:text-green-400 transition-colors">
                  Inovação
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Estudantes</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/sobre" className="hover:text-green-400 transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Carreiras
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  LGPD
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Segurança
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2026 U-Go. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}