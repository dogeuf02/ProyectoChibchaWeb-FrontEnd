// src/api/ticketApi.js
import axios from './axiosInstance';

export const getAllTickets = async () => {
  const response = await axios.get('/ticket');
  return response.data;
};

export const getTicketById = async (ticketId) => {
  const response = await axios.get(`/ticket/${ticketId}`);
  return response.data;
};

export const updateTicket = async (ticketId, data) => {
  const response = await axios.put(`/ticket/${ticketId}`, data);
  return response.data;
};

export const getTicketWithHistory = async (ticketId) => {
  const response = await axios.get(`/ticket/obtenerHistorial/${ticketId}`);
  return response.data;
};

export const createTicket = async (ticketData) => {
  const response = await axios.post('/ticket', ticketData);
  return response.data;
};

