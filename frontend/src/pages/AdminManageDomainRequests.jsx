import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import DomainRequestsList from "../components/DomainRequestsList";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";

export default function AdminManageDomainRequests() {
  useScrollToTop();
  const { showAlert } = useGlobalAlert();

  // Simulated current admin
  const currentAdmin = {
    name: "Admin Laura",
    email: "laura.admin@system.com"
  };

  const [domainRequests, setDomainRequests] = useState([]);

  useEffect(() => {
    // Simulated initial data
    setDomainRequests([
      {
        id: 1,
        domain_name: "example",
        tld: "com",
        domain_status: "available",
        request_status: "pending",
        applicant: {
          name: "Carlos Ramírez",
          email: "carlos@mail.com",
          role: "client"
        },
        reviewedBy: null
      },
      {
        id: 2,
        domain_name: "logistimax",
        tld: "net",
        domain_status: "pending",
        request_status: "approved",
        applicant: {
          name: "Laura Torres",
          email: "laura@mail.com",
          role: "distributor"
        },
        reviewedBy: {
          name: "Admin One",
          email: "admin1@system.com"
        }
      },
            {
        id:3,
        domain_name: "logistimax",
        tld: "net",
        domain_status: "pending",
        request_status: "pending",
        applicant: {
          name: "Laura Torres",
          email: "laura@mail.com",
          role: "distributor"
        },
        reviewedBy: {
          name: "Admin One",
          email: "admin1@system.com"
        }
      },

      
    ]);
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
        Domain Registration Requests
      </Typography>

      <DomainRequestsList
        domainRequests={domainRequests}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </Box>
  );
}
