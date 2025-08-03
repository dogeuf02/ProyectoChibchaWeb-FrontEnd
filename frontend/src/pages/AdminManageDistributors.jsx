import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import DistributorList from "../components/DistributorsList";
import ConfirmDialog from "../components/ConfirmDialog";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { updateClientProfile, updateEmployeeProfile, updateDistributorProfile, updateAdminProfile } from "../api/userApi";
import { getDistributors, createDistributor, updateState } from "../api/distributorApi";
import EditUserDialog from "../components/EditUserDialog";

import { useTranslation } from "react-i18next";
export default function AdminManageDistributors() {

  useScrollToTop();

  const [editDistributor, setEditDistributor] = useState(null);
  const { t } = useTranslation();
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

  const distributorFields = [
  { name: "email", label: "Email" },
  { name: "company_document_type", label: "Document Type" },
  { name: "company_document_number", label: "Document Number" },
  { name: "company_name", label: "Company Name" },
  { name: "company_address", label: "Company Address" }
];


useEffect(() => {
  const fetchDistributors = async () => {
    const result = await getDistributors();
    if (result.exito) {
      setDistributors(result.distribuidores);
    } else {
      showAlert(result.mensaje || "Error loading distributors", "error");
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
      showAlert("Distribuidor not found", "error");
      setOpenDialog(false);
      return;
    }

    try {
      const result = await updateState(distributor.email, "INACTIVO");

      if (result.exito) {
        showAlert("Distribuidor disabled successfully", "success");
        const updated = await getDistributors();
        if (updated.exito) {

          setDistributors(updated.distribuidores);
        }
      } else {
        showAlert(result.mensaje || "Error while disabling distributor", "error");
      }
    } catch (error) {
      showAlert("Server error", "error");
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
      contrasenaDistribuidor: "distri@123",
      nombreTipoDoc: newDistributor.company_document_type,
      numeroDocEmpresa: newDistributor.company_document_number,
      nombreEmpresa: newDistributor.company_name,
      direccionEmpresa: newDistributor.company_address
    };

    console.log("Payload enviado al backend:", payload); // 🔍 Verifica el formato exacto

    try {
      const response = await createDistributor(payload);

      if (response.exito) {
        showAlert("Distributor created seccessfully", "success");
        const updated = await getDistributors();
        console.log("updated" + updated)
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
        showAlert(response.mensaje || "Error. Can't create distributor", "error");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error 400+ de la API:", error.response.data); // 🔍 Importante para el error 400
        showAlert(error.response.data?.mensaje || "Server error.", "error");
      } else {
        console.error("Error inesperado:", error);
        showAlert("Uncaught error", "error");
      }
    }
  };

  const handleRequestEdit = (distributor) => {
  setEditDistributor({
    id: distributor.distributor_id, // para usarlo en la API
    email: distributor.email,
    company_document_type: distributor.company_document_type || distributor.nombreTipoDoc,
    company_document_number: distributor.company_document_number || distributor.numeroDocEmpresa,
    company_name: distributor.company_name || distributor.nombreEmpresa,
    company_address: distributor.company_address || distributor.direccionEmpresa,
  });
};

const handleEditChange = (field, value) => {
  setEditDistributor((prev) => ({ ...prev, [field]: value }));
};

const handleSaveEdit = async () => {
  if (!editDistributor) return;

  const res = await updateDistributorProfile(editDistributor.id, {
    nombreTipoDoc: editDistributor.company_document_type,
    numeroDocEmpresa: editDistributor.company_document_number,
    nombreEmpresa: editDistributor.company_name,
    direccionEmpresa: editDistributor.company_address
  });

  if (res?.status === 200 || res?.exito) {
    showAlert("Distributor updated successfully", "success");
    const updated = await getDistributors();
    if (updated.exito) {
      setDistributors(updated.distribuidores);
    }
    setEditDistributor(null);
  } else {
    showAlert("Failed to update distributor", "error");
  }
};



  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212121" }}>
          {t('distributorManagement.title')}
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
          sx={{ backgroundColor: "#FF6300", color: "#FAFAFA", borderRadius:30,
            "&:hover": { backgroundColor: "#e65c00" } }}
        >
          {t('distributorManagement.addDistributorButton')}
        </Button>
      </Box>

<DistributorList
  distributors={distributors}
  onRequestDelete={handleRequestDelete}
  onRequestEdit={handleRequestEdit} // ✅ ESTA LÍNEA FALTABA
/>



      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title={t('distributorManagement.deleteDialog.title')}
        message={t('clientManagement.deleteDialog.message')}
        confirmText={t('clientManagement.deleteDialog.confirmText')}
      />

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth>
        <DialogTitle>{t('distributorManagement.addDistributorDialog.title')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label={t('distributorManagement.addDistributorDialog.emailField')}
              value={newDistributor.email}
              onChange={(e) => setNewDistributor({ ...newDistributor, email: e.target.value })}
              fullWidth
            />
            <TextField
              select
              label={t('distributorManagement.addDistributorDialog.docTypeField')}
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
              label={t('distributorManagement.addDistributorDialog.docNumberField')}
              value={newDistributor.company_document_number}
              onChange={(e) => setNewDistributor({ ...newDistributor, company_document_number: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('distributorManagement.addDistributorDialog.companyNameField')}
              value={newDistributor.company_name}
              onChange={(e) => setNewDistributor({ ...newDistributor, company_name: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('distributorManagement.addDistributorDialog.companyAddressField')}
              value={newDistributor.company_address}
              onChange={(e) => setNewDistributor({ ...newDistributor, company_address: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} sx={{ color: "#212121" }}>
            {t('distributorManagement.addDistributorDialog.cancelButton')}
          </Button>
          <Button
            onClick={handleAddDistributor}
            variant="contained"
            sx={{ backgroundColor: "#FF6300", color: "#FAFAFA", borderRadius: 30, "&:hover": { backgroundColor: "#e65c00" } }}
          >
           {t('distributorManagement.addDistributorDialog.saveButton')}
          </Button>
        </DialogActions>
      </Dialog>
      <EditUserDialog
  open={!!editDistributor}
  onClose={() => setEditDistributor(null)}
  onSave={handleSaveEdit}
  userData={editDistributor || {}}
  onChange={handleEditChange}
  fields={distributorFields}
/>

    </Box>
  );
}
