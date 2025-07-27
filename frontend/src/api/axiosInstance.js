import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:8080/api', // cambia esto
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
