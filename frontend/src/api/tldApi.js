import api from "./axiosInstance";

export const getTlds = async () => {
  try {
    const response = await api.get('/tld');
    return response.data;
  } catch (error) {
    console.error('Error fetching TLDs:', error);
    throw error;
  }
}
