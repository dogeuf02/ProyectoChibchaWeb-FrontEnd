import api from './axiosInstance';

export const createDistribuidor = (distributor) => api.post('/distribuidors', distributor);
