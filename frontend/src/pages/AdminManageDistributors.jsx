import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import DistributorList from "../components/DistributorsList";
import ConfirmDialog from "../components/ConfirmDialog";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

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
    setDistributors([
      {
        distributor_id: "DIST001",
        role: "Distributor",
        email: "empresa1@example.com",
        status: "Active",
        company_document_type: "NIT",
        company_document_number: "900123456",
        company_name: "Distribuciones XYZ",
        company_address: "Calle 123 #45-67",
      },
      {
        distributor_id: "DIST002",
        role: "Distributor",
        email: "ventas@logistimax.com",
        status: "Active",
        company_document_type: "CUIT",
        company_document_number: "20456789012",
        company_name: "LogistiMax",
        company_address: "Av. Siempre Viva 742",
      },
      {
        distributor_id: "DIST003",
        role: "Distributor",
        email: "contacto@distribureal.com",
        status: "Inactive",
        company_document_type: "RUC",
        company_document_number: "10458963245",
        company_name: "DistribuReal SAC",
        company_address: "Carrera 8 #12-34",
      },
      {
        distributor_id: "DIST004",
        role: "Distributor",
        email: "info@andescorp.com",
        status: "Active",
        company_document_type: "NIT",
        company_document_number: "901245678",
        company_name: "AndesCorp",
        company_address: "Cra 7 #56-78",
      },
      {
        distributor_id: "DIST005",
        role: "Distributor",
        email: "soporte@tecmundo.net",
        status: "Active",
        company_document_type: "RIF",
        company_document_number: "J123456789",
        company_name: "TecMundo C.A.",
        company_address: "Zona Industrial, Calle 10",
      },
      {
        distributor_id: "DIST006",
        role: "Distributor",
        email: "ventas@alfaentregas.com",
        status: "Inactive",
        company_document_type: "CPF_CNPJ",
        company_document_number: "12.345.678/0001-90",
        company_name: "Alfa Entregas",
        company_address: "Rua das Flores 100",
      },
      {
        distributor_id: "DIST007",
        role: "Distributor",
        email: "admin@fastmove.co",
        status: "Active",
        company_document_type: "PASSPORT",
        company_document_number: "P20240987",
        company_name: "FastMove Intl",
        company_address: "Global Street 999",
      },
      {
        distributor_id: "DIST008",
        role: "Distributor",
        email: "servicio@neogistics.com",
        status: "Active",
        company_document_type: "TIN",
        company_document_number: "TX10203948",
        company_name: "NeoGistics",
        company_address: "Loop Road 45",
      },
      {
        distributor_id: "DIST009",
        role: "Distributor",
        email: "gerencia@solucioneslog.com",
        status: "Inactive",
        company_document_type: "OTHER",
        company_document_number: "X000111222",
        company_name: "SolucionesLog",
        company_address: "Av. Central #22-10",
      },
      {
        distributor_id: "DIST010",
        role: "Distributor",
        email: "contact@deliveryhub.org",
        status: "Active",
        company_document_type: "BUSINESS_ID",
        company_document_number: "BI88776655",
        company_name: "DeliveryHub",
        company_address: "Main Street 101",
      }
    ]);
  }, []);

  const handleRequestDelete = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    setDistributors(prev => prev.filter(dist => dist.id !== selectedId));
    setOpenDialog(false);
    setSelectedId(null);
    showAlert("Distributor deleted successfully", "success");
  };

  const handleAddDistributor = () => {
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

    setDistributors(prev => [
      ...prev,
      { id: `DIST${prev.length + 1}`.padStart(7, "0"), ...newDistributor }
    ]);
    setNewDistributor({
      email: "",
      status: "",
      company_document_type: "",
      company_document_number: "",
      company_name: "",
      company_address: ""
    });
    setOpenForm(false);

    showAlert("Distributor added successfully", "success");
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
