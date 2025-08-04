import api from './axiosInstance';

export const createPlanPrice = async (planPrice) => {
  try {
    const response = await api.post('/precioPlan', planPrice);
    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje }; // devuelve el mensaje del backend
    } else {
      return { exito: false, mensaje: 'Error desconocido al crear el precio del plan' };
    }
  }
}

export const getPlanPrices = async () => {
  try {
    const response = await api.get('/precioPlan');
    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje }; // devuelve el mensaje del backend
    } else {
      return { exito: false, mensaje: 'Error desconocido al obtener los precios de los planes' };
    }
  }
}
