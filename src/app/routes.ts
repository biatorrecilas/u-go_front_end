import { Fragment, createElement, useEffect } from "react";
import { createBrowserRouter, Outlet, redirect, useLocation } from "react-router";

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}

function RootLayout() {
  return createElement(
    Fragment,
    null,
    createElement(ScrollToTop),
    createElement(Outlet),
  );
}

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        index: true,
        lazy: async () => ({ Component: (await import("./pages/Home")).Home }),
      },
      {
        path: "perfil",
        lazy: async () => ({ Component: (await import("./pages/Profile")).Profile }),
      },
      {
        path: "perfil/:userId",
        lazy: async () => ({ Component: (await import("./pages/Profile")).Profile }),
      },
      {
        path: "cadastro",
        loader: () => redirect("/login?mode=signup"),
      },
      {
        path: "login",
        lazy: async () => ({ Component: (await import("./pages/Login")).Login }),
      },
      {
        path: "sobre",
        lazy: async () => ({ Component: (await import("./pages/About")).About }),
      },
      {
        path: "criar-carona",
        lazy: async () => ({ Component: (await import("./pages/CreateRide")).CreateRide }),
      },
      {
        path: "caronas",
        lazy: async () => ({ Component: (await import("./pages/FindRides")).FindRides }),
      },
      {
        path: "acompanhar-carona",
        lazy: async () => ({ Component: (await import("./pages/RideTracking")).RideTracking }),
      },
      {
        path: "termos",
        lazy: async () => {
          const { Legal } = await import("./pages/Legal");
          return { Component: () => createElement(Legal, { type: "terms" }) };
        },
      },
      {
        path: "privacidade",
        lazy: async () => {
          const { Legal } = await import("./pages/Legal");
          return { Component: () => createElement(Legal, { type: "privacy" }) };
        },
      },
    ],
  },
]);
