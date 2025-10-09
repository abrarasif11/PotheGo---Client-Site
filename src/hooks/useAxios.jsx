import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `http://localhost:6969/`,
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
