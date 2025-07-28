import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import RegisterDistributorRequestsList from "../components/RegisterDistributorRequestsList";
import ConfirmDialog from "../components/ConfirmDialog";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function AdminManageDistributorRequests() {
  useScrollToTop();
  const { showAlert } = useGlobalAlert();

  const [distributors, setDistributors] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);


  useEffect(() => {
    setDistributors([
      {
        distributor_id: "DIST010",
        role: "Distributor",
        email: "contact@deliveryhub.org",
        status: "Pending",
        company_document_type: "BUSINESS_ID",
        company_document_number: "BI88776655",
        company_name: "DeliveryHub",
        company_address: "Main Street 101",
      }
    ]);
  }, []);


  const handleRequestAccept = (id) => {
    setDistributors(prev =>
      prev.map(dist =>
        dist.distributor_id === id ? { ...dist, status: "Approved" } : dist
      )
    );
    showAlert("Distributor request approved", "success");
  };

  const handleRequestDeny = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmDeny = () => {
    setDistributors(prev =>
      prev.map(dist =>
        dist.distributor_id === selectedId ? { ...dist, status: "Denied" } : dist
      )
    );
    setOpenDialog(false);
    setSelectedId(null);
    showAlert("Distributor request denied", "info");
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212121" }}>
          Apply as Distributor requests
        </Typography>
      </Box>

<RegisterDistributorRequestsList
  requests={distributors} // este valor debe ser un array
  onRequestAccept={handleRequestAccept}
  onRequestDeny={handleRequestDeny}
/>


      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDeny}
        title="Deny Registration Request"
        message="Are you sure you want to deny this registration request? This action cannot be undone."
        confirmText="Confirm Denial"
      />
    </Box>
  );
}