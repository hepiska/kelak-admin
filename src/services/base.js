import axios from "axios";

const request = axios.create({ baseURL: process.env.VUE_APP_API_URL });

request.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
