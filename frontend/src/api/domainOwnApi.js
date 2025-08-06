import api from './axiosInstance';
import { getDomainById } from './domainApi';
export const createDomainOwn = async (domainOwn) => {
    try {
        const response = await api.post('/perteneceDominio', domainOwn);
        return response.data;
    } catch (error) {
        console.error('Error creating domain:', error);
        throw error;
    }
}

export const getActiveDomains = async (role, id) => {
    try {
        console.log(`/perteneceDominio/${role.toLowerCase()}/${id}`);
        const response = await api.get(`/perteneceDominio/${role.toLowerCase()}/${id}`);
        const domainDetails = await Promise.all(
            response.data.map(async (item) => {
                const detalle = await getDomainById(item.dominio);
                return {
                    ...detalle,
                    idPertenece: item.idPertenece,
                    cliente: item.cliente,
                    distribuidor: item.distribuidor,
                };
            })
        );

        console.log("Dominios activos detallados:", domainDetails);
        return domainDetails;
    } catch (error) {
        console.error('Error fetching active domains:', error);
        throw error;
    }
};
