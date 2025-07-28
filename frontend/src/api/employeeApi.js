import api from './axiosInstance';

export const createEmployee = async (employee) => {
  try {
    const response = await api.post('/empleados/registroEmpleado', employee);
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

    const empleadosCrudos = response.data;

    const empleadosAdaptados = empleadosCrudos.map(emp => ({
      id: emp.idEmpleado,
      firstName: emp.nombreEmpleado,
      lastName: emp.apellidoEmpleado,
      position: emp.cargoEmpleado,
      email: emp.correo
    }));

    return {
      exito: true,
      empleados: empleadosAdaptados
    };

  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje };
    } else {
      return { exito: false, mensaje: 'Error desconocido al obtener los empleados' };
    }
  }
};
