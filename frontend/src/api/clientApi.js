import api from './axiosInstance';

export const createClient = async (cliente) => {
  try {
    const response = await api.post('/clienteDirectos/registroCliente', cliente);
    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje }; // devuelve el mensaje del backend
    } else {
      return { exito: false, mensaje: 'Error desconocido al crear el cliente' };
    }
  }
};
