import api from './axiosInstance';

export const auth = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
}