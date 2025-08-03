import api from './axiosInstance';

export const auth = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
}

export const verifyEmailToken = async (token) => {
  try {
    const response = await api.get('/auth/activar?token=' + token);
    console.log("Response from verifyEmailToken:", response);

    if (response.status !== 200) {
      throw new Error('Error al verificar el correo');
    }

    const data = response.data;
    return { success: true, message: data };
  } catch (error) {
    console.error("verifyEmailToken error:", error);

    // Verifica si es un error de Axios con respuesta del servidor
    if (error.response) {
      return {
        success: false,
        message: error.response.data || 'Error en la respuesta del servidor',
      };
    }

    // Error normal o personalizado
    return {
      success: false,
      message: error.message || 'Error de red al verificar el correo',
    };
  }
};
