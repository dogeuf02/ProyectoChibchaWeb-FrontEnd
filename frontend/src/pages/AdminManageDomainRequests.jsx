import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import DomainRequestsList from "../components/DomainRequestsList";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";
import { getDomainRequests } from "../api/domainRequestApi";
import { useTranslation } from "react-i18next";

export default function AdminManageDomainRequests() {
  useScrollToTop();
  const { t } = useTranslation();
  const { showAlert } = useGlobalAlert();

  // Simulated current admin
  const currentAdmin = {
    name: "Admin Laura",
    email: "laura.admin@system.com"
  };

  const [domainRequests, setDomainRequests] = useState([]);

  useEffect(() => {

    const fetchDomainRequests = async () => {
      const result = await getDomainRequests();
      if (result.exito) {
        setDomainRequests(result.data);
      }
      else {
        showAlert(result.mensaje, "error");
      }
      console.log(result);
    }

    fetchDomainRequests();

  }, []);

  const handleAccept = (id) => {
    setDomainRequests(prev =>
      prev.map(req =>
        req.id === id
          ? {
            ...req,
            request_status: "approved",
            domain_status: "active",
            reviewedBy: currentAdmin
          }
          : req
      )
    );
    showAlert("Domain request approved", "success");
  };

  const handleReject = (id) => {
    setDomainRequests(prev =>
      prev.map(req =>
        req.id === id
          ? {
            ...req,
            request_status: "denied",
            domain_status: "unavailable",
            reviewedBy: currentAdmin
          }
          : req
      )
    );
    showAlert("Domain request denied", "warning");
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 10 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212121", mb: 4 }}>
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
