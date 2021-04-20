import axios from 'axios';

export const request = axios.create({ baseURL: process.env.BASE_URL });

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);