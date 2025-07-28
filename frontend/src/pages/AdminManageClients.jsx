import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Stack
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClientList from "../components/ClientList";
import ConfirmDialog from "../components/ConfirmDialog";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";

export default function AdminManageClients() {
  useScrollToTop();
  const { showAlert } = useGlobalAlert();

  const [clients, setClients] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const [newClient, setNewClient] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    fecha_nacimiento: "",
  });

  useEffect(() => {
    setClients([
      {
        id_cliente: "CLI001",
        nombre: "Laura",
        apellido: "Gómez",
        correo: "laura@mail.com",
        telefono: "3001234567",
        fecha_nacimiento: "1990-05-12",
        estado: "Active"
      },
      {
        id_cliente: "CLI002",
        nombre: "Carlos",
        apellido: "Ramírez",
        correo: "carlos@mail.com",
        telefono: "3012345678",
        fecha_nacimiento: "1985-08-20",
        estado: "Inactive"
      }
    ]);
  }, []);

  const handleRequestDelete = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    setClients(prev => prev.filter(c => c.id_cliente !== selectedId));
    setOpenDialog(false);
    setSelectedId(null);
    showAlert("Client deleted successfully", "success");
  };

  const handleAddClient = () => {
    const required = ["First Name", "Last Name", "Mail", "Phone", "Birth Date",];
    for (let field of required) {
      if (!newClient[field]) {
        showAlert(`The field "${field}" is required.`, "warning");
        return;
      }
    }

    const newId = `CLI${(clients.length + 1).toString().padStart(3, "0")}`;
    setClients(prev => [...prev, { id_cliente: newId, ...newClient }]);
    setOpenForm(false);
    setNewClient({
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
      fecha_nacimiento: "",
    });
    showAlert("Client added successfully", "success");
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212121" }}>
          Client Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
          sx={{
            backgroundColor: "#FF6300",
            color: "#FAFAFA",
            "&:hover": {
              backgroundColor: "#e65c00",
            },
          }}
        >
          Add Client
        </Button>
      </Box>

      <ClientList clients={clients} onRequestDelete={handleRequestDelete} />

      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
        confirmText="Confirm Delete"
      />

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="First Name" value={newClient.nombre}
              onChange={(e) => setNewClient({ ...newClient, nombre: e.target.value })} fullWidth />
            <TextField label="Last Name" value={newClient.apellido}
              onChange={(e) => setNewClient({ ...newClient, apellido: e.target.value })} fullWidth />
            <TextField label="Email" value={newClient.correo}
              onChange={(e) => setNewClient({ ...newClient, correo: e.target.value })} fullWidth />
            <TextField label="Phone" value={newClient.telefono}
              onChange={(e) => setNewClient({ ...newClient, telefono: e.target.value })} fullWidth />
            <TextField label="Birth Date" type="date" InputLabelProps={{ shrink: true }}
              value={newClient.fecha_nacimiento}
              onChange={(e) => setNewClient({ ...newClient, fecha_nacimiento: e.target.value })} fullWidth />
            
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} sx={{ color: "#212121" }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddClient}
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
