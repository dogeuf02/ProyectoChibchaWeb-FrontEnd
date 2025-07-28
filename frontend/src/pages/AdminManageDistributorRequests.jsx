import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import RegisterDistributorRequestsList from "../components/RegisterDistributorRequestsList";
import ConfirmDialog from "../components/ConfirmDialog";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { getPendingDistributors, updateState } from "../api/distributorApi"; // ajusta la ruta si es necesario

export default function AdminManageDistributorRequests() {
  useScrollToTop();
  const { showAlert } = useGlobalAlert();

  const [distributors, setDistributors] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);


  useEffect(() => {
    const fetchPendingDistributors = async () => {
      try {
        const result = await getPendingDistributors();
   
        setDistributors(result.distribuidores);
      } catch (error) {
        showAlert("Error fetching distributor requests", "error");
      }
    };

    fetchPendingDistributors();
  }, []);



  const handleRequestAccept = async (id) => {
    setSelectedId(id);
    const distributor = distributors.find(dist => dist.distributor_id === id);
        console.log(selectedId)
        if (!distributor) {
          showAlert("Distribuidor no encontrado", "error");
          setOpenDialog(false);
          return;
        }
    
        try {
          const result = await updateState(distributor.email, "ACTIVO");
    
          if (result.exito) {
            showAlert("Distribuidor desactivado exitosamente", "success");
            const updated = await getPendingDistributors();
            if (updated.exito) {
              console.log("sexito")
              setDistributors(updated.distribuidores);
            }
          } else {
            showAlert(result.mensaje || "Error al desactivar distribuidor", "error");
          }
        } catch (error) {
          console.error("Error inesperado al desactivar:", error);
          showAlert("Hubo un error al intentar desactivar el distribuidor", "error");
        } finally {
          setOpenDialog(false);
          setSelectedId(null);
        }
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