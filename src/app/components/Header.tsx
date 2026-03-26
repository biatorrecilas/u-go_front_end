import { Car, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">U-Go</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {isHome ? (
              <>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Recursos
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Como Funciona
                </button>
                <button
                  onClick={() => scrollToSection("innovation")}
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Inovação
                </button>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Depoimentos
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Início
                </Link>
                <Link
                  to="/caronas"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Encontrar Caronas
                </Link>
                <Link
                  to="/criar-carona"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Oferecer Carona
                </Link>
                <Link
                  to="/acompanhar-carona"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Acompanhar
                </Link>
                <Link
                  to="/sobre"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Sobre Nós
                </Link>
                <Link
                  to="/perfil"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Perfil
                </Link>
              </>
            )}
            <Link
              to="/login"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/cadastro"
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm"
            >
              Cadastrar
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <nav className="flex flex-col p-4 gap-4">
              {isHome ? (
                <>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="text-gray-600 hover:text-green-600 transition-colors text-left py-2"
                  >
                    Recursos
                  </button>
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="text-gray-600 hover:text-green-600 transition-colors text-left py-2"
                  >
                    Como Funciona
                  </button>
                  <button
                    onClick={() => scrollToSection("innovation")}
                    className="text-gray-600 hover:text-green-600 transition-colors text-left py-2"
                  >
                    Inovação
                  </button>
                  <button
                    onClick={() => scrollToSection("testimonials")}
                    className="text-gray-600 hover:text-green-600 transition-colors text-left py-2"
                  >
                    Depoimentos
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-600 hover:text-green-600 transition-colors text-left py-2"
                  >
                    Início
                  </Link>
                  <Link
                    to="/caronas"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-600 hover:text-green-600 transition-colors text-left py-2"
                  >
                    Encontrar Caronas
                  </Link>
                  <Link
                    to="/criar-carona"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-600 hover:text-green-600 transition-colors text-left py-2"
                  >
                    Oferecer Carona
                  </Link>
                  <Link
                    to="/acompanhar-carona"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-600 hover:text-green-600 transition-colors text-left py-2"
                  >
                    Acompanhar
                  </Link>
                  <Link
                    to="/sobre"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-600 hover:text-green-600 transition-colors text-left py-2"
                  >
                    Sobre Nós
                  </Link>
                  <Link
                    to="/perfil"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-600 hover:text-green-600 transition-colors text-left py-2"
                  >
                    Perfil
                  </Link>
                </>
              )}
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-600 hover:text-green-600 transition-colors text-left py-2"
              >
                Login
              </Link>
              <Link
                to="/cadastro"
                onClick={() => setIsMenuOpen(false)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                Cadastrar
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}