import api from './axiosInstance';


// 🔍 Obtener todos los planes adquiridos
export const getAllPlanesAdquiridos = () => {
  return api.get('/planAdquirido');
};

// 🔍 Obtener plan adquirido por ID
export const getPlanAdquiridoById = (id) => {
  return api.get(`/planAdquirido/${id}`);
};

// ✅ Crear nuevo plan adquirido
export const createPlanAdquirido = (data) => {
  return api.post('/planAdquirido', data);
};

// ✏️ Actualizar plan adquirido
export const updatePlanAdquirido = (id, data) => {
  return api.put(`/planAdquirido/${id}`, data);
};

// ❌ Eliminar plan adquirido
export const deletePlanAdquirido = (id) => {
  return api.delete(`/planAdquirido/${id}`);
};

export const getPlansByClientId = async (clientId) => {
  const response = await api.get(`/planAdquirido/by-cliente/${clientId}`);
  return response.data;
};