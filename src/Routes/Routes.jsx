import { createBrowserRouter } from "react-router-dom";
import Main from "../Layouts/Main";
import Home from "../Components/Home/Home";
import LoginPage from "../Pages/Authentication/LoginPage/LoginPage";
import SignupPage from "../Pages/Authentication/SignupPage/SignupPage";

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
