import { useEffect, useState } from "react";

export type NotificationKind = "request" | "approval" | "reminder" | "profile";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  href: string;
  kind?: NotificationKind;
  isNew?: boolean;
}

export interface UserSession {
  name: string;
  email: string;
  university: string;
  course: string;
  avatar?: string;
  notifications: NotificationItem[];
}

const AUTH_STORAGE_KEY = "ugo-session";
const AUTH_EVENT = "ugo-auth-change";

function isBrowser() {
  return typeof window !== "undefined";
}

function emitAuthChange() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function getSession(): UserSession | null {
  if (!isBrowser()) {
    return null;
  }

  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as UserSession;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function saveSession(session: UserSession) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  emitAuthChange();
}

export function clearSession() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  emitAuthChange();
}

export function createDefaultNotifications(name: string): NotificationItem[] {
  return [
    {
      id: "ride-request",
      title: "Nova solicitacao de carona",
      description: `${name}, uma estudante solicitou sua carona e aguarda sua aprovacao.`,
      href: "/acompanhar-carona",
      kind: "request",
      isNew: true,
    },
    {
      id: "ride-approval",
      title: "Solicitacao aprovada",
      description: "Uma motorista aprovou seu pedido. Confirme para liberar o contato.",
      href: "/acompanhar-carona",
      kind: "approval",
      isNew: true,
    },
    {
      id: "ride-reminder",
      title: "Lembrete de viagem",
      description: "Sua carona confirmada esta pronta para ser iniciada.",
      href: "/acompanhar-carona",
      kind: "reminder",
    },
    {
      id: "profile-tip",
      title: "Complete seu perfil",
      description: "Adicione uma foto e deixe seu perfil mais confiavel.",
      href: "/perfil",
      kind: "profile",
    },
  ];
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatNameFromEmail(email: string) {
  const [prefix = "Estudante"] = email.split("@");

  return prefix
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export function useAuthSession() {
  const [session, setSession] = useState<UserSession | null>(() => getSession());

  useEffect(() => {
    if (!isBrowser()) {
      return undefined;
    }

    const syncSession = () => setSession(getSession());

    window.addEventListener("storage", syncSession);
    window.addEventListener(AUTH_EVENT, syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(AUTH_EVENT, syncSession);
    };
  }, []);

  return session;
}