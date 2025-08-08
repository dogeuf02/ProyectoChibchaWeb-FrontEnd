import api from './axiosInstance';
import { getDistributorById } from './distributorApi';
import { getDomainById } from './domainApi';
import { getClientById } from './clientApi';
import { ROLE } from '../enum/roleEnum';
import { getAdminProfile } from './adminApi';

export const createDomainRequest = async (domain) => {
  try {
    const response = await api.post('/solicitudDominio', domain);
    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje }; // devuelve el mensaje del backend
    } else {
      return { exito: false, mensaje: "Server error." };
    }
  }
}

export const getDomainRequestsById = async (role, id) => {
  try {
    const response = await api.get(`/solicitudDominio/${role.toLowerCase()}/${id}`);
    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje };
    } else {
      return { exito: false, mensaje: 'Server error.' };
    }
  }
};

export const getDomainRequests = async () => {
  console.log("getDomRe");
  try {
    const response = await api.get('/solicitudDominio');
    console.log("getDomRe", response.data);
    const enrichedRequests = await Promise.all(
      response.data.map(async (request) => {
        try {
          let nombreUsuario = '-';
          let adminName = '-';

          if (request.cliente) {
            const clienteResult = await getClientById(request.cliente);
            if (clienteResult.exito && clienteResult.data) {
              const { nombreCliente = '', apellidoCliente = '' } = clienteResult.data;
              nombreUsuario = (nombreCliente + ' ' + apellidoCliente).trim() || 'Cliente';
            }
          } else if (request.distribuidor) {
            const distribuidorResult = await getDistributorById(request.distribuidor);
            if (distribuidorResult.exito && distribuidorResult.data?.usuario) {
              nombreUsuario = distribuidorResult.data.usuario.nombreEmpresa || ROLE.DISTRIBUTOR;
            }
          }

          if (request.admin) {
            const adminResult = await getAdminProfile(request.admin);
            if (adminResult.exito && adminResult.data) {
              adminName = adminResult.data.nombreAdmin || '-';
            }
          }

          if (!request.dominio) {
            return null; // Evitar llamada inválida
          }

          const domain = await getDomainById(request.dominio);
          if (!domain) {
            return null;
          }

          return {
            idSolicitud: request.idSolicitud,
            dominio: domain,
            estado: request.estadoSolicitud,
            fechaCreacion: request.fechaSolicitud,
            idUsuario: request.cliente || request.distribuidor,
            rolUsuario: request.cliente ? ROLE.CLIENT : ROLE.DISTRIBUTOR,
            nombreUsuario,
            idAdmin: request.admin,
            nombreAdmin: adminName,
          };

        } catch (err) {
          console.error("Error procesando solicitud:", err);
          return null;
        }
      })
    );

    // Filtrar nulos antes de devolver
    return { exito: true, data: enrichedRequests.filter(Boolean) };

  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje };
    } else {
      return { exito: false, mensaje: 'Server error.' };
    }
  }
};

export const updateDomainRequest = async (id, requestData) => {
  try {
    const response = await api.put(`/solicitudDominio/${id}`, requestData);
    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje };
    } else {
      return { exito: false, mensaje: 'Server error.' };
    }
  }
}


export const sendNotificationEmail = async (aproved, id, adminId) => {
  try {
    const response = await api.put(`/solicitudDominio/gestionarSolicitud/${id}?aprobar=${aproved}&idAdministrador=${adminId}`);
    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje };
    } else {
      return { exito: false, mensaje: 'Server error.' };
    }
  }
}

export const generateRequestXML = async (id) => {
  try {
    const response = await api.get(`/solicitudDominio/generarXML/${id}`, {
      responseType: 'blob', // <- MUY IMPORTANTE
    });
    return { exito: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje };
    } else {
      return { exito: false, mensaje: 'Server error.' };
    }
  }
};
