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

export const getPayMethodsByUserId = async (userType, id) => {
    try {
        const endpoint = `/medioPago/${userType.toLowerCase()}/${id}`;
        const response = await api.get(endpoint);

        return { exito: true, data: response.data };
    } catch (error) {
        const mensaje =
            error?.response?.data?.mensaje || 'Error desconocido al obtener el método de pago';
        const exito = error?.response?.data?.exito ?? false;

        return { exito, mensaje };
    }
};

export const hasPayMethods = async (userType, id) => {
    const response = await getPayMethodsByUserId(userType, id);

    if (response.exito && Array.isArray(response.data)) {
        const hasMethods = response.data.length > 0;
        return hasMethods;
    }

    return false;
};


export const deletePayMethod = async (id) => {
    try {
        const response = await api.delete(`/medioPago/${id}`);
        return { exito: true, data: response.data };
    } catch (error) {
        if (error.response && error.response.data) {
            const { exito, mensaje } = error.response.data;
            return { exito, mensaje }; // devuelve el mensaje del backend
        } else {
            return { exito: false, mensaje: 'Error desconocido al eliminar el método de pago' };
        }
    }
}

export const getBanks = async () => {
  try {
    const response = await api.get('/banco');
    return { exito: true, data: response.data };
  } catch (error) {
    const mensaje =
      error?.response?.data?.mensaje || 'Error al obtener los bancos';
    return { exito: false, mensaje };
  }
};
