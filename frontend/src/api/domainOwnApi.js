import api from './axiosInstance';
import { getDomainById } from './domainApi';
export const createDomainOwn = async (domainOwn) => {

    const response = await api.post('/perteneceDominio', domainOwn);
    return response.data;

}

export const getActiveDomains = async (role, id) => {

    const response = await api.get(`/perteneceDominio/${role.toLowerCase()}/${id}`);
    console.log("active domains response", response);
    if (response.data && response.data.registros) {
        const domainDetails = await Promise.all(
            response.data.registros.map(async (item) => {
                const detalle = await getDomainById(item.dominio);
                return {
                    ...detalle,
                    idPertenece: item.idPertenece,
                    cliente: item.cliente,
                    distribuidor: item.distribuidor,
                };
            })
        );

        return domainDetails;
    }
    return [];
};
