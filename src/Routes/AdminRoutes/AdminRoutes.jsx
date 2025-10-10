import { Navigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import Loader from "../../Shared/Loader/Loader";

const AdminRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  if (loading || roleLoading) {
    return <Loader />;
  }
  if (!user || role !== "admin") {
    return (
      <Navigate state={{ from: location.pathname }} to="/error"></Navigate>
    );
  }
  return children;
};

export default AdminRoutes;
