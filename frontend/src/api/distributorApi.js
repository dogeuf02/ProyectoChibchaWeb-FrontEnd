import api from './axiosInstance';

export const createDistributor = async (data) => {
    try {
        const response = await api.post('/distribuidors/registroDistribuidor', {
            correoDistrbuidor: data.correo,
            contrasenaDistribuidor: data.contrasena,
            numeroDocEmpresa: data.numeroDocumento,
            nombreEmpresa: data.nombreEmpresa,
            direccionEmpresa: data.direccionEmpresa,
            nombreTipoDoc: data.tipoDocumento
        });

        const { exito, mensaje } = response.data;

        if (exito) {
            return { success: true, message: mensaje };
        } else {
            return { success: false, message: mensaje };
        }
    } catch (error) {
        console.error("Error al crear distribuidor:", error);
        return { success: false, message: "Error al conectar con el servidor." };
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

