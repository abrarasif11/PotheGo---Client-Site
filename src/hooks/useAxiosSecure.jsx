import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: "http://localhost:6969/",
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();

  axiosSecure.interceptors.request.use(
    (config) => {
      if (user && user.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosSecure.interceptors.response.use(
    (res) => res,
    async (err) => {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        await logOut();
        navigate("/login");
      }
      return Promise.reject(err);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
