import {
  Bell,
  CalendarClock,
  Car,
  CheckCircle2,
  CircleUserRound,
  LogOut,
  Menu,
  Route,
  Search,
  UserRoundPlus,
  X,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  getInitials,
  logoutSession,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationItem,
  useAuthSession,
} from "../auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const session = useAuthSession();
  const isHome = location.pathname === "/";
  const isAuthenticated = Boolean(session);
  const notifications = session?.notifications ?? [];
  const unreadCount = notifications.filter((notification) => notification.isNew).length;
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const scrollToSection = (id: string) => {
    if (isHome) {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(`/#${id}`);
    }

    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await logoutSession();
      setIsMenuOpen(false);
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getNotificationPresentation = (notification: NotificationItem) => {
    const kind = notification.kind ??
      (notification.id === "ride-request"
        ? "request"
        : notification.id === "ride-reminder"
          ? "reminder"
          : "profile");

    if (kind === "request") {
      return {
        icon: Bell,
        iconClassName: "bg-emerald-100 text-emerald-700",
      };
    }

    if (kind === "reminder") {
      return {
        icon: CalendarClock,
        iconClassName: "bg-blue-100 text-blue-700",
      };
    }

    if (kind === "approval") {
      return {
        icon: CheckCircle2,
        iconClassName: "bg-sky-100 text-sky-700",
      };
    }

    if (kind === "match") {
      return { icon: Search, iconClassName: "bg-violet-100 text-violet-700" };
    }

    if (kind === "ride_update" || kind === "status") {
      return { icon: Route, iconClassName: "bg-orange-100 text-orange-700" };
    }

    return {
      icon: UserRoundPlus,
      iconClassName: "bg-amber-100 text-amber-700",
    };
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              U-Go
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Como Funciona
                </button>
                <Link
                  to="/sobre"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Sobre Nós
                </Link>
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
                  to="/sobre"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Sobre Nós
                </Link>
                <Link
                  to="/caronas"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Encontrar
                </Link>
                <Link
                  to="/criar-carona"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Oferecer Carona
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="relative rounded-full p-2 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors"
                      aria-label="Abrir notificações"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 ? (
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[11px] font-semibold text-white">
                          {unreadCount}
                        </span>
                      ) : null}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="flex items-center justify-between gap-3">
                      <span>Notificações</span>
                      {unreadCount > 0 ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            void markAllNotificationsRead();
                          }}
                          className="text-xs font-medium text-emerald-700 hover:underline"
                        >
                          Marcar todas como lidas
                        </button>
                      ) : null}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length > 0 ? (
                      notifications.map((notification) => {
                        const { icon: NotificationIcon, iconClassName } = getNotificationPresentation(notification);

                        return (
                          <DropdownMenuItem key={notification.id} asChild className="items-start">
                            <Link
                              to={notification.href}
                              onClick={() => {
                                if (notification.isNew) void markNotificationRead(notification.id);
                              }}
                              className={`flex items-start gap-3 ${notification.isNew ? "bg-emerald-50/60" : ""}`}
                            >
                              <span className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full ${iconClassName}`}>
                                <NotificationIcon className="w-4 h-4" />
                              </span>
                              <span className="flex flex-col gap-1">
                                <span className="font-medium text-gray-900">{notification.title}</span>
                                <span className="text-xs leading-relaxed text-gray-500">{notification.description}</span>
                              </span>
                            </Link>
                          </DropdownMenuItem>
                        );
                      })
                    ) : (
                      <div className="px-4 py-6 text-center text-sm text-gray-500">
                        Não há notificações no momento.
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="rounded-full ring-2 ring-transparent transition hover:ring-green-200"
                      aria-label="Abrir menu do perfil"
                    >
                      <Avatar className="h-10 w-10 border border-green-100">
                        {session?.avatar ? <AvatarImage src={session.avatar} alt={session.name} /> : null}
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-sm font-semibold text-white">
                          {session ? getInitials(session.name) : <CircleUserRound className="w-5 h-5" />}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel className="space-y-1">
                      <div className="font-semibold text-gray-900">{session?.name}</div>
                      <div className="text-xs font-normal text-gray-500">{session?.course}</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/perfil" className="flex items-center gap-2">
                        <CircleUserRound className="w-4 h-4" />
                        Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/acompanhar-carona" className="flex items-center gap-2">
                        <Route className="w-4 h-4" />
                        Acompanhar caronas
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => void handleLogout()} className="text-red-600 focus:text-red-600">
                      <LogOut className="w-4 h-4" />
                      {isLoggingOut ? "Saindo..." : "Sair"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm"
              >
                Login
              </Link>
            ) : null}
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
              {!isAuthenticated ? (
                <>
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
                  <Link
                    to="/sobre"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-600 hover:text-green-600 transition-colors text-left py-2"
                  >
                    Sobre Nós
                  </Link>
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
                    to="/sobre"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-600 hover:text-green-600 transition-colors text-left py-2"
                  >
                    Sobre Nós
                  </Link>
                  <Link
                    to="/caronas"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-600 hover:text-green-600 transition-colors text-left py-2"
                  >
                    Encontrar
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
                    Acompanhar Caronas
                  </Link>
                  <Link
                    to="/perfil"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-600 hover:text-green-600 transition-colors text-left py-2"
                  >
                    Perfil
                  </Link>
                  <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-900">
                      <Bell className="w-4 h-4" />
                      Notificações
                      {unreadCount > 0 ? (
                        <button
                          type="button"
                          onClick={() => void markAllNotificationsRead()}
                          className="ml-auto text-xs font-medium text-emerald-700 hover:underline"
                        >
                          Marcar lidas
                        </button>
                      ) : null}
                    </div>
                    <div className="space-y-3">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 2).map((notification) => {
                          const { icon: NotificationIcon, iconClassName } = getNotificationPresentation(notification);

                          return (
                            <Link
                              key={notification.id}
                              to={notification.href}
                              onClick={() => {
                                setIsMenuOpen(false);
                                if (notification.isNew) void markNotificationRead(notification.id);
                              }}
                              className={`flex items-start gap-3 rounded-xl px-3 py-2 text-sm text-gray-600 shadow-sm ${notification.isNew ? "bg-emerald-50" : "bg-white"}`}
                            >
                              <span className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${iconClassName}`}>
                                <NotificationIcon className="w-4 h-4" />
                              </span>
                              <span>
                                <div className="font-medium text-gray-900">{notification.title}</div>
                                <div className="text-xs text-gray-500">{notification.description}</div>
                              </span>
                            </Link>
                          );
                        })
                      ) : (
                        <div className="rounded-xl bg-white px-3 py-4 text-sm text-gray-500 shadow-sm">
                          Não há notificações no momento.
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    className="rounded-full border border-red-200 px-4 py-3 text-left font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    {isLoggingOut ? "Saindo..." : "Sair"}
                  </button>
                </>
              )}
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full hover:from-green-600 hover:to-emerald-700 transition-all text-center"
                >
                  Login
                </Link>
              ) : null}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
