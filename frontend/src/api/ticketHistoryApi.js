// src/api/ticketHistoryApi.js
import axios from './axiosInstance';

export const getAllTicketHistory = async () => {
  const response = await axios.get('/api/historialTicket');
  return response.data;
};

export const getHistoryByTicketId = async (ticketId) => {
  const response = await axios.get(`/api/historialTicket/${ticketId}`);
  return response.data;
};

export const createHistorialEntry = async (data) => {
  const response = await axios.post(`/historialTicket`, data); // o cambia el ID según tu lógica
  return response.data;
};

