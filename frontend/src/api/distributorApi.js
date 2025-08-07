import api from './axiosInstance';
import { ROLE } from '../enum/roleEnum';

export const createDistributor = async (distributor) => {
    try {
        const response = await api.post('/distribuidor/registroDistribuidor', distributor);

        return { exito: true, data: response.data };
    } catch (error) {
        if (error.response && error.response.data) {
            const { exito, mensaje } = error.response.data;
            return { exito, mensaje }; // devuelve el mensaje del backend
        } else {
            return { exito: false, mensaje: 'Error desconocido al crear el distribuidor' };
        }
    }
};

export const getDistributors = async () => {
    try {
        const response = await api.get("/distribuidor/obtenerDistribuidores");

        const data = response.data;

        const filtered = data.filter(d => d.estado === "ACTIVO" || d.estado === "INACTIVO")

        const adaptados = filtered.map((d) => ({
            distributor_id: d.idDistribuidor,
            role: ROLE.DISTRIBUTOR,
            email: d.correo,
            status: d.estado,
            company_document_type: d.nombreTipoDoc,
            company_document_number: d.numeroDocEmpresa,
            company_name: d.nombreEmpresa,
            company_address: d.direccionEmpresa,
        }));

        return {
            exito: true,
            distribuidores: adaptados
        };
    } catch (error) {
        if (error.response && error.response.data) {
            const { exito, mensaje } = error.response.data;
            return { exito, mensaje };
        } else {
            return {
                exito: false,
                mensaje: "Error desconocido al obtener los distribuidores"
            };
        }
    }
};

export const updateState = async (idDistributor, request) => {
    try {
        const response = await api.put(`/distribuidor/gestionarSolicitudRegistro/${idDistributor}?activar=${request}`);
        return response;
    } catch (error) {
        return error;
    }
};

export const getPendingDistributors = async () => {
    try {
        const response = await api.get("/distribuidor/obtenerDistribuidores");
        const data = response.data;

        const pendings = data.filter(d => d.estado === "PENDIENTE");

        const adaptados = pendings.map((d) => ({
            distributor_id: d.idDistribuidor,
            role: ROLE.DISTRIBUTOR,
            email: d.correo,
            status: d.estado,
            company_document_type: d.nombreTipoDoc,
            company_document_number: d.numeroDocEmpresa,
            company_name: d.nombreEmpresa,
            company_address: d.direccionEmpresa,
        }));
        return {
            exito: true,
            distribuidores: adaptados
        };
    } catch (error) {
        if (error.response && error.response.data) {
            return {
                exito: false,
                mensaje: error.response.data.mensaje || "Error al obtener los distribuidores pendientes"
            };
        } else {
            return {
                exito: false,
                mensaje: "Error desconocido al obtener distribuidores pendientes"
            };
        }
    }
};

export const getDistributorById = async (id) => {
    try {
        const response = await api.get(`/distribuidor/${id}`);
        return {
            exito: true,
            distribuidor: response.data
        };
    } catch (error) {
        if (error.response && error.response.data) {
            return {
                exito: false,
                mensaje: error.response.data.mensaje || "Error al obtener el distribuidor"
            };
        } else {
            return {
                exito: false,
                mensaje: "Error desconocido al obtener el distribuidor"
            };
        }
    }
}


