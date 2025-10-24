import axios from "axios";

export const caxios = axios.create({
  baseURL: `http://10.5.5.12`
});



caxios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `bearer ${token}`;
  }
  return config;
});
