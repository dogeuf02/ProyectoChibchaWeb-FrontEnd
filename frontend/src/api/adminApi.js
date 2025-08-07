import api from './axiosInstance';

export const getAdminProfile = async (adminId) => {
  try {
    const response = await api.get(`/administrador/${adminId}`);
    return { exito: true, data: response.data };
  } catch (error) {
    return { exito: false, mensaje: 'Error al obtener el perfil del administrador' };
  }
}