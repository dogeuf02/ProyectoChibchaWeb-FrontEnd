import api from './axiosInstance';

export const createDomain = async (domain) => {
    try {
        const response = await api.post('/dominio', domain);
        return response.data;
    } catch (error) {
        console.error('Error creating domain:', error);
        throw error;
    }
}

export const getAllDomains = async () => {
    try {
        const response = await api.get('/dominio');
        return response.data;
    } catch (error) {
        console.error('Error fetching domains:', error);
        throw error;
    }
}

export const getDomainById = async (id) => {
    try {
        const response = await api.get(`/dominio/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching domain by ID:', error);
        throw error;
    }
}

export const getDomain = async (nombreDominio, tldId) => {
  try {
    const response = await api.post('/dominio/buscar', {
      nombreDominio,
      tldId
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      // Dominio no encontrado, puedes retornar null o undefined según tu lógica
      return null;
    } else {
      // Otros errores (500, 400, etc.)
      console.error('Error al buscar el dominio:', error);
      throw error; // lo relanzas si quieres manejarlo más arriba
    }
  }
};

export const updateDomain = async (id, domain) => {
    try {
        const response = await api.put(`/dominio/${id}`, domain);
        return response.data;
    } catch (error) {
        console.error('Error updating domain:', error);
        throw error;
    }
}

