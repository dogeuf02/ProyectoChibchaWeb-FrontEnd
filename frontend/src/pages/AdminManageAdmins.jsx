import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";
import ConfirmDialog from "../components/ConfirmDialog";
import AdministratorList from "../components/AdministratorList";

export default function AdminManageAdminis() {
  useScrollToTop();
  const { showAlert } = useGlobalAlert();

  const [administrators, setAdministrators] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  const [newAdministrator, setNewAdministrator] = useState({
    id: "",
    correo: "",
    rol: "",
    estado: "",
    nombre: "",
    apellido: "",
    fecha_nacimiento: ""
  });

  useEffect(() => {
    setAdministrators([
  {
    id: "ADM001",
    correo: "admin01@mail.com",
    rol: "SUPERADMIN",
    estado: "Activo",
    nombre: "Carlos",
    apellido: "Ramírez",
    fecha_nacimiento: "1985-06-15"
  },
  {
    id: "ADM002",
    correo: "admin02@mail.com",
    rol: "ADMIN",
    estado: "Activo",
    nombre: "Laura",
    apellido: "Torres",
    fecha_nacimiento: "1990-03-22"
  },
  {
    id: "ADM003",
    correo: "marco.reyes@mail.com",
    rol: "ADMIN",
    estado: "Inactivo",
    nombre: "Marco",
    apellido: "Reyes",
    fecha_nacimiento: "1988-11-05"
  },
  {
    id: "ADM004",
    correo: "ana.mendez@mail.com",
    rol: "SUPERADMIN",
    estado: "Activo",
    nombre: "Ana",
    apellido: "Méndez",
    fecha_nacimiento: "1979-01-30"
  },
  {
    id: "ADM005",
    correo: "lucia.ortiz@mail.com",
    rol: "ADMIN",
    estado: "Activo",
    nombre: "Lucía",
    apellido: "Ortiz",
    fecha_nacimiento: "1993-07-18"
  },
  {
    id: "ADM006",
    correo: "jose.perez@mail.com",
    rol: "ADMIN",
    estado: "Inactivo",
    nombre: "José",
    apellido: "Pérez",
    fecha_nacimiento: "1987-04-12"
  },
  {
    id: "ADM007",
    correo: "diana.gomez@mail.com",
    rol: "ADMIN",
    estado: "Activo",
    nombre: "Diana",
    apellido: "Gómez",
    fecha_nacimiento: "1992-09-27"
  },
  {
    id: "ADM008",
    correo: "sebastian.vargas@mail.com",
    rol: "SUPERADMIN",
    estado: "Activo",
    nombre: "Sebastián",
    apellido: "Vargas",
    fecha_nacimiento: "1983-02-10"
  },
  {
    id: "ADM009",
    correo: "paula.nieves@mail.com",
    rol: "ADMIN",
    estado: "Activo",
    nombre: "Paula",
    apellido: "Nieves",
    fecha_nacimiento: "1991-06-08"
  },
  {
    id: "ADM010",
    correo: "francisco.lopez@mail.com",
    rol: "ADMIN",
    estado: "Activo",
    nombre: "Francisco",
    apellido: "López",
    fecha_nacimiento: "1986-12-01"
  }
]
);
  }, []);

  const handleRequestDelete = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    setAdministrators(prev => prev.filter(admin => admin.id !== selectedId));
    setOpenDialog(false);
    setSelectedId(null);
    showAlert("Administrator deleted successfully", "success");
  };

  const handleAddAdministrator = () => {
    const requiredFields = ["correo",  "nombre", "apellido", "fecha_nacimiento"];
    const friendlyNames = {
      correo: "Email",
      nombre: "First Name",
      apellido: "Last Name",
      fecha_nacimiento: "Birthdate"
    };

    for (const field of requiredFields) {
      if (!newAdministrator[field] || newAdministrator[field].trim() === "") {
        showAlert(`The field "${friendlyNames[field]}" is required.`, "warning");
        return;
      }
    }

    setAdministrators(prev => [...prev, { ...newAdministrator, id: `ADM${prev.length + 1}` }]);
    setNewAdministrator({
      id: "",
      correo: "",
      rol: "",
      estado: "",
      nombre: "",
      apellido: "",
      fecha_nacimiento: ""
    });
    setOpenForm(false);
    showAlert("Administrator added successfully", "success");
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212121" }}>
          Administrator Management
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
          Add Administrator
        </Button>
      </Box>

      <AdministratorList admins={administrators} onRequestDelete={handleRequestDelete} />

      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Administrator"
        message="Are you sure you want to delete this administrator? This action cannot be undone."
        confirmText="Confirm Delete"
      />

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth>
        <DialogTitle>Add New Administrator</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="First Name"
              value={newAdministrator.nombre}
              onChange={(e) => setNewAdministrator({ ...newAdministrator, nombre: e.target.value })}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={newAdministrator.apellido}
              onChange={(e) => setNewAdministrator({ ...newAdministrator, apellido: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              value={newAdministrator.correo}
              onChange={(e) => setNewAdministrator({ ...newAdministrator, correo: e.target.value })}
              fullWidth
            />
            <TextField
              label="Birthdate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newAdministrator.fecha_nacimiento}
              onChange={(e) => setNewAdministrator({ ...newAdministrator, fecha_nacimiento: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} sx={{ color: "#212121" }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddAdministrator}
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
