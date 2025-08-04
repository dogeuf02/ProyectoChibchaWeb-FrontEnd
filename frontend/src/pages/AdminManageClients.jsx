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
import { createClient, getClients, deactivateUser } from "../api/clientApi";
import { updateClientProfile } from "../api/userApi";
import EditUserDialog from "../components/EditUserDialog";


import { useTranslation } from "react-i18next";

export default function AdminManageClients() {
  const { t } = useTranslation();
  useScrollToTop();
  const { showAlert } = useGlobalAlert();

  const [clients, setClients] = useState([]);
  const [editClient, setEditClient] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const clientFields = [
  { name: "nombre", label: "First Name" },
  { name: "apellido", label: "Last Name" },
  { name: "telefono", label: "Phone" },
  { name: "fechaNacimientoCliente", label: "Birth Date", type: "date" },
];

  const [newClient, setNewClient] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    fechaNacimientoCliente: "",
  });

  // Utilidad para ordenar: primero ACTIVO, luego INACTIVO
  const ordenarClientesPorEstado = (clientes) => {
    return [...clientes].sort((a, b) => {
      if (a.estado === "ACTIVO" && b.estado !== "ACTIVO") return -1;
      if (a.estado !== "ACTIVO" && b.estado === "ACTIVO") return 1;
      return 0;
    });
  };

  useEffect(() => {
    const fetchClients = async () => {
      const response = await getClients();

      if (response.exito) {
        const ordenados = ordenarClientesPorEstado(response.clientes);
        setClients(ordenados);
      } else {
        showAlert(response.mensaje || "Error loading clients", "error");
      }
    };

    fetchClients();
  }, []);

  const handleRequestDelete = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    const clientToDelete = clients.find(c => c.id_cliente === selectedId);

    if (!clientToDelete) {
      showAlert("Client not found", "error");
      setOpenDialog(false);
      return;
    }

    try {
      const result = await deactivateUser(clientToDelete.correo);

      if (result.exito) {
        showAlert("Client account deactivated", "success");
        const updated = await getClients();
        if (updated.exito) {
          const ordenados = ordenarClientesPorEstado(updated.clientes);
          setClients(ordenados);
        }
      } else {
        showAlert(result.mensaje || "Failed to deactivate client", "error");
      }
    } catch (error) {
      console.error("❌ Error al desactivar usuario:", error);
      showAlert("Unexpected error deactivating client", "error");
    } finally {
      setOpenDialog(false);
      setSelectedId(null);
    }
  };

const handleRequestEdit = (user) => {
  setEditClient({
    id: user.id_cliente, // ✅ esto es lo que el backend necesita
    nombre: user.nombre,
    apellido: user.apellido,
    telefono: user.telefono,
    fechaNacimientoCliente: user.fechaNacimientoCliente
  });
};


const handleEditChange = (field, value) => {
  setEditClient((prev) => ({ ...prev, [field]: value }));
};



  const handleAddClient = async () => {
    const requiredFields = ["nombre", "apellido", "correo", "telefono", "fechaNacimientoCliente"];
    const friendlyNames = {
      nombre: "First Name",
      apellido: "Last Name",
      correo: "Email",
      telefono: "Phone",
      fechaNacimientoCliente: "Birth Date",
    };

    for (let field of requiredFields) {
      if (!newClient[field] || newClient[field].trim() === "") {
        showAlert(`The field "${friendlyNames[field]}" is required.`, "warning");
        return;
      }
    }

    const generatedPassword = `${newClient.nombre}${newClient.apellido}`.toLowerCase().replace(/\s+/g, "");

    const client = {
      correoCliente: newClient.correo,
      contrasenaCliente: "cliente@123",
      nombreCliente: newClient.nombre,
      apellidoCliente: newClient.apellido,
      telefono: newClient.telefono,
      fechaNacimientoCliente: newClient.fechaNacimientoCliente
    };

    try {
      const response = await createClient(client);

      if (response.exito) {
        showAlert("Client added successfully", "success");
        const updated = await getClients();
        if (updated.exito) {
          const ordenados = ordenarClientesPorEstado(updated.clientes);
          setClients(ordenados);
        }

        setOpenForm(false);
        setNewClient({
          nombre: "",
          apellido: "",
          correo: "",
          telefono: "",
          fechaNacimientoCliente: "",
        });
      } else {
        showAlert(response.mensaje || "Error adding client", "error");
      }
    } catch (error) {
      console.error("❌ Error inesperado al crear cliente:", error);
      showAlert("Unexpected error adding client", "error");
    }
  };

  const handleSaveEdit = async () => {
    if (!editClient) return;

    const { id, nombre, apellido, telefono, fechaNacimientoCliente } = editClient;

    const formatted = {
      nombreCliente: nombre,
      apellidoCliente: apellido,
      telefono,
      fechaNacimientoCliente,
    };

    const res = await updateClientProfile(id, formatted);

    if (res?.status === 200) {
      showAlert("Client profile updated successfully", "success");
      const updated = await getClients();
      if (updated.exito) {
        const ordenados = ordenarClientesPorEstado(updated.clientes);
        setClients(ordenados);
      }
      setEditClient(null);
    } else {
      showAlert("Failed to update client", "error");
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212121" }}>
          {t('clientManagement.title')}
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
          sx={{
            backgroundColor: "#FF6300",
            color: "#FAFAFA",
            borderRadius: 30,
            "&:hover": {
              backgroundColor: "#e65c00",
            },
          }}
        >
          {t('clientManagement.addClientButton')}
        </Button>
      </Box>

      <ClientList
        clients={clients}
        onRequestDelete={handleRequestDelete}
        onRequestEdit={handleRequestEdit} // ✅ Aquí
      />


      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title={t('clientManagement.deleteDialog.title')}
        message={t('clientManagement.deleteDialog.message')}
        confirmText={t('clientManagement.deleteDialog.confirmText')}
      />

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth>
        <DialogTitle>{t('clientManagement.addClientButton')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label={t('clientManagement.addClientDialog.firstNameField')}
              value={newClient.nombre}
              onChange={(e) => setNewClient({ ...newClient, nombre: e.target.value })} fullWidth />
            <TextField label={t('clientManagement.addClientDialog.lastnameField')}
              value={newClient.apellido}
              onChange={(e) => setNewClient({ ...newClient, apellido: e.target.value })} fullWidth />
            <TextField label={t('clientManagement.addClientDialog.emailField')}
              value={newClient.correo}
              onChange={(e) => setNewClient({ ...newClient, correo: e.target.value })} fullWidth />
            <TextField label={t('clientManagement.addClientDialog.phoneNumberField')}
              value={newClient.telefono}
              onChange={(e) => setNewClient({ ...newClient, telefono: e.target.value })} fullWidth />
            <TextField label={t('clientManagement.addClientDialog.birthDateField')}
              type="date" InputLabelProps={{ shrink: true }}
              value={newClient.fechaNacimientoCliente}
              onChange={(e) => setNewClient({ ...newClient, fechaNacimientoCliente: e.target.value })} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} sx={{ color: "#212121" }}>
            {t('clientManagement.addClientDialog.cancelButton')}
          </Button>
          <Button
            onClick={handleAddClient}
            variant="contained"
            sx={{ backgroundColor: "#FF6300", color: "#FAFAFA", borderRadius: 30, "&:hover": { backgroundColor: "#e65c00" } }}
          >
            {t('clientManagement.addClientDialog.saveButton')}
          </Button>
        </DialogActions>
      </Dialog>
<EditUserDialog
  open={!!editClient}
  onClose={() => setEditClient(null)}
  onSave={handleSaveEdit}
  userData={editClient || {}}
  onChange={handleEditChange}
  fields={clientFields}
/>

    </Box>
  );
}
