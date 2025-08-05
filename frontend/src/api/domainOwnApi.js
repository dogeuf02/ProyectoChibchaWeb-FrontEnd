import api from './axiosInstance';

export const createDomainOwn = async (domainOwn) => {
    try {
        const response = await api.post('/perteneceDominio', domainOwn);
        return response.data;
    } catch (error) {
        console.error('Error creating domain:', error);
        throw error;
    }
}