import api from './axiosInstance';

export const createPayMethod = async (payMethod) => {
  try {
    const response = await api.post('/medioPago', payMethod);
    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje }; // devuelve el mensaje del backend
    } else {
      return { exito: false, mensaje: 'Error desconocido al crear el método de pago' };
    }
  }
}

export const getPayMethods = async () => {
  try {
    const response = await api.get('/medioPago');
    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje }; // devuelve el mensaje del backend
    } else {
      return { exito: false, mensaje: 'Error desconocido al obtener los métodos de pago' };
    }
  }
}

export const getPayMethodsById = async (id) => {
  try {
    const response = await api.get(`/medioPago/${id}`);
    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje }; // devuelve el mensaje del backend
    } else {
      return { exito: false, mensaje: 'Error desconocido al obtener el método de pago' };
    }
  }
}

export const hasPayMethods = async () => {
  const response = await getPayMethodsById();

  if (response.exito && Array.isArray(response.data)) {
    return response.data.length > 0;
  }

  return false;
};
