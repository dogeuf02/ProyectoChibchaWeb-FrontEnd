import { ROLE } from '../enum/roleEnum';
import api from './axiosInstance';

export const getUserProfile = async (role, userId) => {
  try {
    // 1. Obtener el usuario general por su ID
    const userRes = await api.get(`/usuario/${userId}`);
    const user = userRes.data;
    // 2. Determinar el ID relacionado según el rol
    let relatedId;
    let endpoint = '';

    switch (role) {
      case ROLE.CLIENT:
        relatedId = user.cliente;
        endpoint = `/clienteDirecto/${relatedId}`;

        break;
      case ROLE.EMPLOYEE:
        relatedId = user.empleado;
        endpoint = `/empleado/${relatedId}`;

        break;
      case ROLE.ADMIN:
        relatedId = user.admin;
        endpoint = `/administrador/${relatedId}`;
        break;
      case ROLE.DISTRIBUTOR:
        relatedId = user.distribuidor;
        endpoint = `/distribuidor/${relatedId}`;
        break;
      default:
        return { exito: false, mensaje: 'Rol no válido' };
    }

    if (!relatedId) {
      return {
        exito: false,
        mensaje: 'No se encontró relación con entidad específica del usuario'
      };
    }

    // 4. Obtener el perfil específico
    const profileRes = await api.get(endpoint);
    profileRes.data.email = user.correoUsuario; // Aseguramos que el email del usuario esté presente en el perfil
    return { exito: true, data: profileRes.data };

  } catch (error) {
    if (error.response?.status === 404) {
      return { exito: false, mensaje: 'Perfil no encontrado (404)' };
    }

    if (error.response?.data) {
      return {
        exito: false,
        mensaje: error.response.data.mensaje || 'Error desde el backend'
      };
    }

    return {
      exito: false,
      mensaje: 'Error desconocido al obtener perfil'
    };
  }
};



export const updateClientProfile = async (id, data) => {
  return await api.put(`/clienteDirecto/${id}`, data);
};

export const updateEmployeeProfile = async (id, data) => {
  return await api.put(`/empleado/${id}`, data);
};

export const updateDistributorProfile = async (id, data) => {
  console.log(`Updating distributor profile with ID: ${id}`, data);
  return await api.put(`/distribuidor/${id}`, data);
};

export const updateAdminProfile = async (id, data) => {
  return await api.put(`/administrador/${id}`, data);
};

export const deactivateUserById = async (userId) => {
  try {
    const res = await api.put(`/usuario/${userId}`, {
      estado: "INACTIVO"
    });
    return { exito: true, data: res.data };
  } catch (error) {
    return {
      exito: false,
      mensaje: error.response?.data?.mensaje || "Error al desactivar el usuario"
    };
  }
};

export const getAllAdmins = async () => {
  try {
    const res = await api.get("/administrador/obtenerAdministradores");
    return { exito: true, administradores: res.data };
  } catch (err) {
    return { exito: false, mensaje: "Error al obtener administradores" };
  }
};

export const registerAdmin = async (data) => {
  try {
    const res = await api.post("/administrador/registroAdministrador", data);
    return { exito: true, data: res.data };
  } catch (error) {
    return {
      exito: false,
      mensaje: error.response?.data?.mensaje || "Error al registrar administrador"
    };
  }
};


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

export const changePassword = async (correo, nuevaContrasena) => {

  const res = await api.put(`/usuario/correo/${correo}`, {
    contrasena: nuevaContrasena,
    estado: 'ACTIVO'
  });

  return res;

};

export const getRoleAndId = async (email) => {
  try {
    const response = await api.get(`/usuario/identificarRol?correo=${email}`);
    const user = response.data;

    if (!user) {
      return { exito: false, mensaje: 'Usuario no encontrado' };
    }

    let role;
    const id = user.id;

    if (user.rol === ROLE.CLIENT) {
      role = ROLE.CLIENT;
    } else if (user.rol === ROLE.DISTRIBUTOR) {
      role = ROLE.DISTRIBUTOR;
    } else {
      return { exito: false, mensaje: 'Rol no reconocido' };
    }

    return {
      exito: true,
      data: {
        id,
        rol: role,
      },
    };
  } catch (error) {
    return { exito: false, mensaje: 'Error al obtener rol e ID del usuario' };
  }
}
