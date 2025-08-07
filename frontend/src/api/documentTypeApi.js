
import axiosInstance from './axiosInstance';

export const getDocumentTypes = async () => {
  try {
    const response = await axiosInstance.get('/tipoDocumentoEmp');
    return response.data;
  } catch (error) {
    return [];
  }
};
