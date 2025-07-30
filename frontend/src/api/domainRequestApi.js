import api from './axiosInstance';
import { getDistributorById } from './distributorApi';
import { getClientById } from './clientApi';
import { get } from 'react-scroll/modules/mixins/scroller';

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

export const getDomainRequests = async () => {
  try {
    const response = await api.get('/solicitudDominio');

    const enrichedRequests = await Promise.all(
      response.data.map(async (request) => {
        let nombreUsuario = '-';

        if (request.cliente) {
          const clienteResult = await getClientById(request.cliente);
          if (clienteResult.exito) {
            nombreUsuario = clienteResult.data.nombreCliente + ' ' + clienteResult.data.apellidoCliente || 'Cliente';
          }
        } else if (request.distribuidor) {
          const distribuidorResult = await getDistributorById(request.distribuidor);
          if (distribuidorResult.exito && distribuidorResult.data.usuario) {
            nombreUsuario = distribuidorResult.data.usuario.nombreEmpresa || 'Distribuidor';
          }
        }

        return {
          idSolicitud: request.idSolicitud,
          nombreDominio: request.nombreDominio,
          tld: request.tld,
          estado: request.estadoSolicitud,
          fechaCreacion: request.fechaSolicitud,
          idUsuario: request.cliente || request.distribuidor,
          rolUsuario: request.cliente ? 'Cliente' : 'Distribuidor',
          nombreUsuario,
        };
      })
    );

    return { exito: true, data: enrichedRequests };
  } catch (error) {
    if (error.response && error.response.data) {
      const { exito, mensaje } = error.response.data;
      return { exito, mensaje };
    } else {
      return { exito: false, mensaje: 'Server error.' };
    }
  }
};
