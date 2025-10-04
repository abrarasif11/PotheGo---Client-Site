import React from "react";

import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Loader from "../../Shared/Loader/Loader";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};

export default PrivateRoute;
