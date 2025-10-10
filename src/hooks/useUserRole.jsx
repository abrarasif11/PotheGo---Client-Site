import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const queryFn = async () => {
    if (!user?.email) return { role: "user" };
    try {
      const res = await axiosSecure.get(`users/${user.email}/role`);
      console.log("Role API response:", res.data);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch role:", err);
      return { role: "user" };
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn,
    enabled: !!user?.email && !authLoading,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  return {
    role: data?.role || "user",
    roleLoading: authLoading || isLoading,
    refetch,
  };
};

export default useUserRole;
