import api from './axiosInstance';

export const createPayBilling = async (billingData) => {
    try {
        const response = await api.post('/planPago', billingData);
        return { exito: true, data: response.data };
    } catch (error) {
        if (error.response && error.response.data) {
            const { exito, mensaje } = error.response.data;
            return { exito, mensaje }; // devuelve el mensaje del backend
        } else {
            return { exito: false, mensaje: 'Error desconocido al crear la facturación' };
        }
    }
}

export const getPayBillings = async () => {
    try {
        const response = await api.get('/planPago');
        return { exito: true, data: response.data };
    } catch (error) {
        if (error.response && error.response.data) {
            const { exito, mensaje } = error.response.data;
            return { exito, mensaje }; // devuelve el mensaje del backend
        } else {
            return { exito: false, mensaje: 'Error desconocido al obtener las facturaciones' };
        }
    }
}