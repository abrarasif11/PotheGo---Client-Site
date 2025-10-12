import React from "react";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import Loader from "../../Shared/Loader/Loader";

const RiderRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  if (loading || roleLoading) {
    return <Loader />;
  }
  if (!user || role !== "rider") {
    return (
      <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    );
  }
  return children;
};

export default RiderRoutes;
