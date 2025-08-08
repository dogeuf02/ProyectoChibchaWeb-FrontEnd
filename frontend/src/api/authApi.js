import api from './axiosInstance';

export const auth = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);

    if (response.status === 200) {
      return response.data;
    } else {
      return {
        autenticado: false,
        mensaje: 'Error inesperado en la autenticación.'
      };
    }
  } catch (error) {
    return {
      autenticado: false,
      mensaje: error?.response?.data?.mensaje || "Error en el servidor."
    };
  }
};


export const recoverPassword = async (email, captchaToken) => {
  try {
    const payload = {
      correo: email,
      captchaToken: captchaToken
    };
    const { status, data } = await api.post('/auth/recuperarContrasena',payload);

    // Backend devuelve { exito: boolean, mensaje: string }
    const success = data?.exito === true || (status >= 200 && status < 300);
    const message = data?.mensaje || data?.message || 'We sent you a temporary code. Please check your email.';

    return { success, message };
  } catch (error) {
    return {
      success: false,
      message:
        error?.response?.data?.mensaje ||
        error?.response?.data?.message ||
        error?.message ||
        'Error sending recovery email.'
    };
  }
};





export const verifyEmailToken = async (token) => {
  try {
    const response = await api.get('/auth/activar?token=' + token);

    if (response.status !== 200) {
      throw new Error('Error al verificar el correo');
    }

    const data = response.data;
    return { success: true, message: data };
  } catch (error) {
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

export const apiLogout = async (token) => {
  try {
    const response = await api.post('/auth/logout', { token });
    return { success: true, message: response.data };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.mensaje || "Error en el servidor."
    };
  }
};
