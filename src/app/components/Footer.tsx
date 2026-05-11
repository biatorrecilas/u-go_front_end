import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Bloco Superior: Identidade e Missão */}
        <div className="flex flex-col gap-3 max-w-3xl">
          <Link to="/" className="w-fit">
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              U-Go
            </span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Conectando universitários de forma inteligente, segura e sustentável. Tecnologia a favor do meio ambiente.
          </p>
        </div>

        {/* Bloco Inferior: Divisória, Links e Copyright */}
        {/* Reduzi o mt-12 para mt-8 e o pt-8 para pt-6 para aproximar a linha */}
        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Esquerda: Links Rápidos */}
          <nav className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-sm font-normal text-gray-400">
            <a href="#" className="hover:text-green-500 transition-colors">
              Feedback
            </a>
            <span className="text-gray-600 text-[10px]">&#8226;</span>
            <a href="#" className="hover:text-green-500 transition-colors">
              Termos de Uso
            </a>
            <span className="text-gray-600 text-[10px]">&#8226;</span>
            <a href="#" className="hover:text-green-500 transition-colors">
              Política de Privacidade
            </a>
          </nav>

          {/* Direita: Copyright */}
          <p className="text-sm text-gray-500 text-center md:text-right">
            © 2026 U-Go. Todos os direitos reservados.
          </p>

        </div>

      </div>
    </footer>
  );
}