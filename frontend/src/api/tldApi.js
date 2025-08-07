import api from "./axiosInstance";

export const getTlds = async () => {

    const response = await api.get('/tld');
    return response.data;

}
