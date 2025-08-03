import api from './axiosInstance';

export const createPlan = async (plan) => {
  try {
    const response = await api.post('/plan', plan);
    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje }; // devuelve el mensaje del backend
    } else {
      return { exito: false, mensaje: 'Error desconocido al crear el plan' };
    }
  }
}

export const getPlans = async () => {
  try {
    const response = await api.get('/plan');
    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje }; // devuelve el mensaje del backend
    } else {
      return { exito: false, mensaje: 'Error desconocido al obtener los planes' };
    }
  }
}

export const updatePlan = async (planId, planData) => {
  try {
    const response = await api.put(`/plan/${planId}`, planData);
    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje }; // devuelve el mensaje del backend
    } else {
      return { exito: false, mensaje: 'Error desconocido al actualizar el plan' };
    }
  }
}

export const deletePlan = async (planId) => {
  try {
    const response = await api.delete(`/plan/${planId}`);
    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje }; // devuelve el mensaje del backend
    } else {
      return { exito: false, mensaje: 'Error desconocido al eliminar el plan' };
    }
  }
}