import api from './axiosInstance';

export const createClient = async (cliente) => {
  try {
    const response = await api.post('/clienteDirecto/registroCliente', cliente);
    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje }; // devuelve el mensaje del backend
    } else {
      return { exito: false, mensaje: 'Error desconocido al crear el cliente' };
    }
  }
};

export const getClients = async () => {
  try {
    const response = await api.get('/clienteDirecto/obtenerClientes');

    const rawClients = response.data;

    const clientesAdaptados = rawClients.map(cli => ({
      id_cliente: cli.idCliente,
      nombre: cli.nombreCliente,
      apellido: cli.apellidoCliente,
      correo: cli.correo,
      telefono: cli.telefono,
      fechaNacimientoCliente: cli.fechaNacimientoCliente,
      estado: cli.estado
    }));

    return {
      exito: true,
      clientes: clientesAdaptados
    };

  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje };
    } else {
      return { exito: false, mensaje: 'Error desconocido al obtener los clientes' };
    }
  }
}

export const deactivateUser = async (correo) => {
  try {
    const response = await api.put(`/usuario/correo/${correo}`, {
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

export const getClientById = async (id) => {
  try {
    const response = await api.get(`/clienteDirecto/${id}`);
    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje }; // devuelve el mensaje del backend
    } else {
      return { exito: false, mensaje: 'Error desconocido al obtener el cliente' };
    }
  }
}
