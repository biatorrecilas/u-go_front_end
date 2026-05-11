import { createBrowserRouter, redirect } from "react-router";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { About } from "./pages/About";
import { CreateRide } from "./pages/CreateRide";
import { FindRides } from "./pages/FindRides";
import { RideTracking } from "./pages/RideTracking";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/perfil",
    Component: Profile,
  },
  {
    path: "/cadastro",
    loader: () => redirect("/login?mode=signup"),
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/sobre",
    Component: About,
  },
  {
    path: "/criar-carona",
    Component: CreateRide,
  },
  {
    path: "/caronas",
    Component: FindRides,
  },
  {
    path: "/acompanhar-carona",
    Component: RideTracking,
  },
]);