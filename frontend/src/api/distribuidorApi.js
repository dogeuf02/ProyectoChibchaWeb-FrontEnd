import api from './axiosInstance';

export const createDistribuidor = (distribuidor) => api.post('/distribuidors', distribuidor);
