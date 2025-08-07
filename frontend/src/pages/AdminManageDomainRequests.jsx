import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import DomainRequestsList from "../components/DomainRequestsList";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";
import { getDomainRequests, sendNotificationEmail } from "../api/domainRequestApi";
import { updateDomain } from "../api/domainApi";
import { useTranslation } from "react-i18next";
import { createDomainOwn } from "../api/domainOwnApi";
import { useAuth } from "../context/AuthContext"
import { useGlobalLoading } from '../context/LoadingContext';

export default function AdminManageDomainRequests() {
  useScrollToTop();
  const { t } = useTranslation();
  const { showAlert } = useGlobalAlert();
  const { specificId } = useAuth();
  const { showLoader, hideLoader } = useGlobalLoading();

  const [domainRequests, setDomainRequests] = useState([]);
  const fetchDomainRequests = async () => {
    const result = await getDomainRequests();
    if (result.exito) {
      setDomainRequests(result.data);
    }
    else {
      showAlert(result.mensaje, "error");
    }
  }
  useEffect(() => {
    showLoader();
    fetchDomainRequests();
    hideLoader();
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
      showLoader();

      await updateDomain(requestData.dominio.idDominio, domain);

      const domainOwn = {
        cliente: idCliente,
        distribuidor: idDistribudor,
        dominio: requestData.dominio.idDominio
      }

      await createDomainOwn(domainOwn);

      const emailResponse = await sendNotificationEmail(true, requestData.idSolicitud, specificId);
      if (emailResponse.exito) {
        await fetchDomainRequests();
        showAlert(emailResponse.mensaje, "success");
      } else {
        showAlert(emailResponse.mensaje, "error");

      }
      hideLoader();

    } catch (error) {
      showAlert("Error inesperado al aprobar la solicitud", "error");
    }
  };

  const handleReject = async (requestData) => {
    try {
      const emailResponse = await sendNotificationEmail(false, requestData.idSolicitud, specificId);
      if (emailResponse.exito) {
        await fetchDomainRequests();
        showAlert(emailResponse.mensaje, "success");
      } else {
        showAlert(emailResponse.mensaje, "error");
      }
    } catch (error) {
      showAlert(error, "error");
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
