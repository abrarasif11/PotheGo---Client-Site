import React from "react";

import useUserRole from "../../../hooks/useUserRole";
import Loader from "../../../Shared/Loader/Loader";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import ErrorPage from "../../ErrorPage/ErrorPage";
import RiderDashboard from "./RiderDashbaord";

const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return <Loader />;
  }
  if (role === "user") {
    return <UserDashboard />;
  } else if (role === "rider") return <RiderDashboard />;
  else if (role === "admin") {
    return <AdminDashboard />;
  } else return <ErrorPage />;
};
export default DashboardHome;
