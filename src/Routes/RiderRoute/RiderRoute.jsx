import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import Loader from "../../Shared/Loader/Loader";

const RiderRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <Loader />;
  }

  if (!user || role !== "rider") {
    return <Navigate to="/error" state={{ from: location.pathname }} replace />;
  }
  return children;
};

export default RiderRoutes;
