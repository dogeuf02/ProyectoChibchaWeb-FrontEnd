import api from './axiosInstance';

export const createDistributor = async (distributor) => {
    try {
        console.log("Payload enviado al backend:", distributor); // 🔍 Verifica el formato exacto
        const response = await api.post('/distribuidors/registroDistribuidor', distributor);

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
        const response = await api.get(
            "/distribuidors/obtenerDistribuidores"
        );

        const datos = response.data;
        console.log("🚀 Datos crudos:", datos);

        const sorted = [
            ...datos.filter(d => d.estado === "ACTIVO"),
            ...datos.filter(d => d.estado !== "ACTIVO")
        ];

        const adaptados = sorted.map((d) => ({
            distributor_id: d.idDistribuidor,
            role: "Distribuidor",
            email: d.correo,
            status: "ACTIVO",
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

