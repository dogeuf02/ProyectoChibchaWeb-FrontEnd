import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import DistributorList from "../components/DistributorsList";
import ConfirmDialog from "../components/ConfirmDialog";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { createDistributor, getDistributors, deactivateUser } from "../api/distributorApi";

export default function AdminManageDistributors() {
  useScrollToTop();
  const { showAlert } = useGlobalAlert();
  const [distributors, setDistributors] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  const [newDistributor, setNewDistributor] = useState({
    email: "",
    status: "",
    company_document_type: "",
    company_document_number: "",
    company_name: "",
    company_address: "",
  });

  const documentTypes = [
    "NIT", "RUC", "CUIT", "RIF", "CPF_CNPJ", "TIN", "PASSPORT", "BUSINESS_ID", "OTHER"
  ];

  useEffect(() => {
    const fetchDistributors = async () => {
      const result = await getDistributors();

      if (result.exito) {
        setDistributors(result.distribuidores);
      } else {
        showAlert(result.mensaje || "Error al cargar distribuidores", "error");
      }
    };

    fetchDistributors();
  }, []);


  const handleRequestDelete = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    const distributor = distributors.find(dist => dist.distributor_id === selectedId);
    console.log(distributor)
    if (!distributor) {
      showAlert("Distribuidor no encontrado", "error");
      setOpenDialog(false);
      return;
    }

    try {
      const result = await deactivateUser(distributor.email);

      if (result.exito) {
        showAlert("Distribuidor desactivado exitosamente", "success");
        const updated = await getDistributors();
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


  const handleAddDistributor = async () => {
    const requiredFields = [
      "email",
      "company_document_type",
      "company_document_number",
      "company_name",
      "company_address"
    ];

    const friendlyNames = {
      email: "Email",
      company_document_type: "Document Type",
      company_document_number: "Document Number",
      company_name: "Company Name",
      company_address: "Company Address"
    };

    for (const field of requiredFields) {
      if (!newDistributor[field] || newDistributor[field].trim() === "") {
        showAlert(`The field "${friendlyNames[field]}" is required.`, "warning");
        return;
      }
    }

    const payload = {
      correoDistrbuidor: newDistributor.email,
      contrasenaDistribuidor: "admin@123",
      nombreTipoDoc: newDistributor.company_document_type,
      numeroDocEmpresa: newDistributor.company_document_number,
      nombreEmpresa: newDistributor.company_name,
      direccionEmpresa: newDistributor.company_address
    };

    console.log("Payload enviado al backend:", payload); // 🔍 Verifica el formato exacto

    try {
      const response = await createDistributor(payload);

      if (response.exito) {
        showAlert("Distribuidor creado exitosamente", "success");
        const updated = await getDistributors();
        if (updated.exito) {
          setDistributors(updated.distribuidores);
        }
        setOpenForm(false);
        setNewDistributor({
          email: "",
          company_document_number: "",
          company_name: "",
          company_address: "",
          company_document_type: "",
        });
      } else {
        showAlert(response.mensaje || "No se pudo crear el distribuidor", "error");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error 400+ de la API:", error.response.data); // 🔍 Importante para el error 400
        showAlert(error.response.data?.mensaje || "Error en la solicitud", "error");
      } else {
        console.error("Error inesperado:", error);
        showAlert("Hubo un error al registrar el distribuidor", "error");
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212121" }}>
          Distributor Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
          sx={{ backgroundColor: "#FF6300", color: "#FAFAFA", "&:hover": { backgroundColor: "#e65c00" } }}
        >
          Add Distributor
        </Button>
      </Box>

      <DistributorList distributors={distributors} onRequestDelete={handleRequestDelete} />

      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Distributor"
        message="Are you sure you want to delete this distributor? This action cannot be undone."
        confirmText="Confirm Delete"
      />

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth>
        <DialogTitle>Add New Distributor</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Email"
              value={newDistributor.email}
              onChange={(e) => setNewDistributor({ ...newDistributor, email: e.target.value })}
              fullWidth
            />
            <TextField
              select
              label="Document Type"
              name="company_document_type"
              value={newDistributor.company_document_type || ''}
              onChange={(e) => setNewDistributor({ ...newDistributor, company_document_type: e.target.value })}
              fullWidth
              margin="normal"
              sx={{
                '& label': { color: '#a5a5a5ff' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#bdbdbd' },
                  '&:hover fieldset': { borderColor: '#ff6f00' },
                  '&.Mui-focused fieldset': { borderColor: '#ffc107' },
                },
              }}
            >
              {documentTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Document Number"
              value={newDistributor.company_document_number}
              onChange={(e) => setNewDistributor({ ...newDistributor, company_document_number: e.target.value })}
              fullWidth
            />
            <TextField
              label="Company Name"
              value={newDistributor.company_name}
              onChange={(e) => setNewDistributor({ ...newDistributor, company_name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Company Address"
              value={newDistributor.company_address}
              onChange={(e) => setNewDistributor({ ...newDistributor, company_address: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} sx={{ color: "#212121" }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddDistributor}
            variant="contained"
            sx={{ backgroundColor: "#FF6300", color: "#FAFAFA", "&:hover": { backgroundColor: "#e65c00" } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
