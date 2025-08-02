import api from './axiosInstance';

export const auth = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
}

export const verifyEmailToken = async (token) => {
  try {
    const response = await api.get('/auth/activar?token=' + token);
    console.log("Response from verifyEmailToken:", response);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al verificar el correo');
    }

    const data = await response.json();
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message || 'Error de red al verificar el correo' };
  }
};