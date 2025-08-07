import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://proyectochibchaweb-backend-production.up.railway.app/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT automáticamente a cada request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); //Obtiene el token de localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
export default axiosInstance;
