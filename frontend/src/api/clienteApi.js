import api from './axiosInstance';

export const createUser = (cliente) => api.post('/cliente/registroCliente', cliente);