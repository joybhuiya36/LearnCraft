import axios from "axios";

const axiosIntance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 60000,
});
axiosIntance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default axiosIntance;
