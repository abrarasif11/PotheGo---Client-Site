import axios from "axios";

import { useNavigate } from "react-router";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: `http://localhost:6969/`,
});
const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
  axiosSecure.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (res) => {
      console.log(res);
      return res;
    },
    (err) => {
      const status = err.status;
      if (status === 403) {
        navigate("/forbidden");
      } else if (status === 401) {
        logOut()
          .then(() => {
            navigate("/login");
          })
          .catch(() => {});
      }
      return Promise.reject(err);
    }
  );
  return axiosSecure;
};

export default useAxiosSecure;
