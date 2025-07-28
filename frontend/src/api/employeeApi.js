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

//Get employees with email
export const getEmployees = async () => {
  try {
    const response = await api.get('/empleados/obtenerEmpleados');

    const rawEmployees = response.data;

    const empleadosAdaptados = rawEmployees.map(emp => ({
      id: emp.idEmpleado,
      firstName: emp.nombreEmpleado,
      lastName: emp.apellidoEmpleado,
      position: emp.cargoEmpleado,
      email: emp.correo,
      estado: emp.estado
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

export const deactivateUser = async (correo) => {
  try {
    const response = await api.put(`/usuarios/correo/${correo}`, {
      estado: "INACTIVO"
    });

    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      return {
        exito: false,
        mensaje: error.response.data.mensaje || "Error al desactivar el usuario"
      };
    } else {
      return {
        exito: false,
        mensaje: "Error desconocido al desactivar el usuario"
      };
    }
  }
};

