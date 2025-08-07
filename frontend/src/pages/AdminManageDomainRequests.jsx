import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import DomainRequestsList from "../components/DomainRequestsList";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";
import { getDomainRequests, updateDomainRequest, sendNotificationEmail } from "../api/domainRequestApi";
import { updateDomain } from "../api/domainApi";
import { useTranslation } from "react-i18next";
import { useAuth } from '../context/AuthContext';
import getTodayDate from '../utils/dateUtils';
import { ROLE } from '../enum/roleEnum';
import { createDomainOwn } from "../api/domainOwnApi";

export default function AdminManageDomainRequests() {
  useScrollToTop();
  const { t } = useTranslation();
  const { showAlert } = useGlobalAlert();
  const { specificId, userData, } = useAuth();

  const [domainRequests, setDomainRequests] = useState([]);
  const fetchDomainRequests = async () => {
    console.log("userData", userData);
    const result = await getDomainRequests();
    console.log("res", result);
    if (result.exito) {
      setDomainRequests(result.data);
    }
    else {
      showAlert(result.mensaje, "error");
    }
    console.log(result);
  }
  useEffect(() => {

    fetchDomainRequests();

  }, []);

  const handleAccept = async (requestData) => {
    try {
      let idCliente = null;
      let idDistribudor = null;

      if (requestData.cliente !== null) {
        idCliente = requestData.idUsuario;
      } else {
        idDistribudor = requestData.idUsuario;
      }

      showAlert("Estado de la solicitud actualizado a 'Aprobada'", "success");
      // Aquí seguirás con los siguientes pasos (actualizar dominio, registrar en pertenece_dominio)
      const domain = {
        idDominio: requestData.dominio.idDominio,
        nombreDominio: requestData.dominio.nombreDominio,
        precioDominio: requestData.dominio.precioDominio,
        estado: "En Uso",
        tld: requestData.dominio.tld
      }

      const resultUpdateDomain = await updateDomain(requestData.dominio.idDominio, domain);
      console.log("updDom", resultUpdateDomain);

      console.log("Dominio actualizado");

      const domainOwn = {
        cliente: idCliente,
        distribuidor: idDistribudor,
        dominio: requestData.dominio.idDominio
      }

      const resultCreateDomainOwn = await createDomainOwn(domainOwn);
      console.log("createDomOwn", resultCreateDomainOwn);
      if (resultCreateDomainOwn.exito) {
        console.log("error");
      }
      const emailResponse = await sendNotificationEmail(true, requestData.idSolicitud);
      console.log(emailResponse);
      if (emailResponse.exito) {
        await fetchDomainRequests();
        showAlert("Solicitud aprobada correctamente", "success");
      } else {
        showAlert(emailResponse.mensaje, "error");

      }

    } catch (error) {
      console.error("Error en handleAccept:", error);
      showAlert("Error inesperado al aprobar la solicitud", "error");
    }
  };
  const handleReject = async (requestData) => {
    let idCliente = null;
    let idDistribudor = null;

    if (requestData.cliente !== null) {
      idCliente = requestData.idUsuario;
    } else {
      idDistribudor = requestData.idUsuario;
    }

    const updatedRequest = {

      idSolicitud: requestData.idSolicitud,
      estadoSolicitud: "Rechazada",
      fechaSolicitud: requestData.fechaCreacion,
      fechaAprobacion: getTodayDate(),
      cliente: idCliente,
      distribuidor: idDistribudor,
      dominio: requestData.dominio.idDominio,
      admin: specificId

    };
    console.log("updREqAccept", updatedRequest);
    try {
      const resultUpdateDomainRequest = await updateDomainRequest(requestData.idSolicitud, updatedRequest);
      if (resultUpdateDomainRequest.exito) {
        showAlert("Petición denegada", "error");
        await sendNotificationEmail(false, updatedRequest.idSolicitud);
        await fetchDomainRequests();

      }
    } catch (error) {
      showAlert("Unhandled error: " + error, "error")

    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 10 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#212121",
          mb: 4,
          textAlign: "left",
          width: "100%",
        }}
      >
        {t('domainRequestsManagement.title')}
      </Typography>

      <DomainRequestsList
        domainRequests={domainRequests}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </Box>
  );
}
