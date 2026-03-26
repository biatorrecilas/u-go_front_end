import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Signup } from "./pages/Signup";
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
    Component: Signup,
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