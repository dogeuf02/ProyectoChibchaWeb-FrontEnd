import api from './axiosInstance';

export const createTransferRequest = async (transferRequestData) => {
    try {
        const response = await api.post('/solicitudTraslado', transferRequestData);
        return { exito: true, data: response.data };
    } catch (error) {
        if (error.response && error.response.data) {
            const { exito, mensaje } = error.response.data;
            return { exito, mensaje }; // devuelve el mensaje del backend
        } else {
            return { exito: false, mensaje: 'Error desconocido al crear la solicitud de transferencia' };
        }
    }
}