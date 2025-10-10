import { createBrowserRouter } from "react-router-dom";
import Main from "../Layouts/Main";
import Home from "../Components/Home/Home";
import LoginPage from "../Pages/Authentication/LoginPage/LoginPage";
import SignupPage from "../Pages/Authentication/SignupPage/SignupPage";
import Coverage from "../Pages/Coverage/Coverage";
import SendParcel from "../Pages/SendParcel/SendParcel";
import BeARider from "../Pages/BeARider/BeARider";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import DashboardLayout from "../Layouts/DashboardLayout";
import MyParcel from "../Pages/Dashboard/MyParcel/MyParcel";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackParcel from "../Pages/Dashboard/TrackParcel/TrackParcel";
import PendingRiders from "../Pages/Dashboard/PendingRiders/PendingRiders";
import ActiveRiders from "../Pages/Dashboard/ActiveRiders/ActiveRiders";
import ManageAdmins from "../Pages/Dashboard/ManageAdmins/ManageAdmins";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import AdminRoutes from "./AdminRoutes/AdminRoutes";

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
        path: "/error",
        element: <ErrorPage />,
      },
      {
        path: "/coverage",
        element: <Coverage />,
        loader: () => fetch("ServiceCenter.json"),
      },
      {
        path: "/sendParcel",
        element: (
          <PrivateRoute>
            <SendParcel />
          </PrivateRoute>
        ),
        loader: () => fetch("ServiceCenter.json"),
      },
      {
        path: "/beArider",
        element: (
          <PrivateRoute>
            <BeARider />
          </PrivateRoute>
        ),
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
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "myParcels",
        Component: MyParcel,
      },
      {
        path: "payment/:id",
        Component: Payment,
      },
      {
        path: "paymentHistory",
        Component: PaymentHistory,
      },
      {
        path: "track",
        Component: TrackParcel,
      },
      {
        path: "pendingRiders",
        Component: PendingRiders,
      },
      {
        path: "activeRiders",
        Component: ActiveRiders,
      },
      {
        path: "makeAdmin",
        element: (
          <AdminRoutes>
            <ManageAdmins />
          </AdminRoutes>
        ),
      },
    ],
  },
]);
