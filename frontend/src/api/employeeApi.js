import api from './axiosInstance';

export const createEmployee = async (employee) => {
  try {
    const response = await api.post('/empleados', employee);
    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje }; // devuelve el mensaje del backend
    } else {
      return { exito: false, mensaje: 'Error desconocido al crear el empleado' };
    }
  }
}

export const getEmployees = async () => {
  try {
    const response = await api.get('/empleados');
    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje }; // devuelve el mensaje del backend
    } else {
      return { exito: false, mensaje: 'Error desconocido al obtener los empleados' };
    }
  }
}