import api from './axiosInstance';

export const getUserProfile = async (role, userId) => {
  try {
    // 1. Obtener el usuario general por su ID
    const userRes = await api.get(`/usuario/${userId}`);
    const user = userRes.data;
    console.log(user)
    // 2. Determinar el ID relacionado según el rol
    let relatedId;
    switch (role) {
      case 'Cliente':
        relatedId = user.cliente;
        break;
      case 'Empleado':
        relatedId = user.empleado;
        break;
      case 'Administrador':
        relatedId = user.admin;
        break;
      case 'Distribuidor':
        relatedId = user.distribuidor;
        break;
      default:
        console.warn("❌ Rol no válido:", role);
        return { exito: false, mensaje: 'Rol no válido' };
    }

    if (!relatedId) {
      console.warn("⚠️ No se encontró relación con entidad específica del usuario");
      return {
        exito: false,
        mensaje: 'No se encontró relación con entidad específica del usuario'
      };
    }

    // 3. Construir el endpoint correspondiente
    let endpoint = '';
    switch (role) {
      case 'Cliente':
        endpoint = `/clienteDirecto/${relatedId}`;
        break;
      case 'Empleado':
        endpoint = `/empleado/${relatedId}`;
        break;
      case 'Administrador':
        endpoint = `/administrador/${relatedId}`;
        break;
      case 'Distribuidor':
        endpoint = `/distribuidor/${relatedId}`;
        break;
    }



    // 4. Obtener el perfil específico
    const profileRes = await api.get(endpoint);
    console.log("profile res")
    profileRes.data.email = user.correoUsuario; // Aseguramos que el email del usuario esté presente en el perfil
    console.log(profileRes.data)
    
    return { exito: true, data: profileRes.data };

  } catch (error) {
    console.error("❌ Error completo:", error);

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
