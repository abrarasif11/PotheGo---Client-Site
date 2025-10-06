import { createBrowserRouter } from "react-router-dom";
import Main from "../Layouts/Main";
import Home from "../Components/Home/Home";
import LoginPage from "../Pages/Authentication/LoginPage/LoginPage";
import SignupPage from "../Pages/Authentication/SignupPage/SignupPage";
import Coverage from "../Pages/Coverage/Coverage";
import SendParcel from "../Pages/SendParcel/SendParcel";
import BeARider from "../Pages/BeARider/BeARider";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/coverage",
        element: <Coverage />,
        loader: () => fetch("ServiceCenter.json"),
      },
      {
        path: "/sendParcel",
        element: <SendParcel />,
        loader: () => fetch("ServiceCenter.json"),
      },
      {
        path: "/beArider",
        element: <BeARider />,
        loader: () => fetch("ServiceCenter.json"),
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
    ],
  },
]);
