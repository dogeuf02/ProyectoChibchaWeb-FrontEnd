import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";
import ConfirmDialog from "../components/ConfirmDialog";
import AdministratorList from "../components/AdministratorList";
import { getAllAdmins, registerAdmin } from "../api/userApi";
import { deactivateUser } from "../api/userApi";



export default function AdminManageAdminis() {
  useScrollToTop();
  const { showAlert } = useGlobalAlert();

  const [administrators, setAdministrators] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedCorreo, setSelectedCorreo] = useState(null);

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
    const fetchAdmins = async () => {
      const res = await getAllAdmins();
      if (res.exito) {
        const adapted = res.administradores.map((admin) => ({
          id: admin.idAdmin,
          nombre: admin.nombreAdmin,
          apellido: admin.apellidoAdmin,
          fecha_nacimiento: admin.fechaNacimientoAdmin,
          correo: admin.correo,
          estado: admin.estado
        }));

        setAdministrators(adapted);
      } else {
        showAlert(res.mensaje, "error");
      }
    };

    fetchAdmins();
  }, []);


  const handleRequestDelete = (admin) => {
    setSelectedCorreo(admin.correo);   // ✅ guardar correctamente el correo
    setOpenDialog(true);               // ✅ abrir el diálogo
  };



  const handleConfirmDelete = async () => {

    console.log("Correo seleccionado para desactivar:", selectedCorreo);
    if (!selectedCorreo) return;

    const res = await deactivateUser(selectedCorreo);

    if (res.exito) {
      setAdministrators(prev =>
        prev.map(a =>
          a.correo === selectedCorreo ? { ...a, estado: "INACTIVO" } : a
        )
      );
      setOpenDialog(false);
      setSelectedCorreo(null);
      showAlert("Administrator successfully deactivated", "success");
    } else {
      showAlert(res.mensaje || "Failed to deactivate administrator", "error");
    }
  };


  const handleAddAdministrator = async () => {
    const requiredFields = ["correo", "nombre", "apellido", "fecha_nacimiento",];
    const friendlyNames = {
      correo: "Email",
      nombre: "First Name",
      apellido: "Last Name",
      fecha_nacimiento: "Birthdate",
    };

    for (const field of requiredFields) {
      if (!newAdministrator[field] || newAdministrator[field].trim() === "") {
        showAlert(`The field "${friendlyNames[field]}" is required.`, "warning");
        return;
      }
    }

    const payload = {
      nombreAdmin: newAdministrator.nombre,
      apellidoAdmin: newAdministrator.apellido,
      fechaNacimientoAdmin: newAdministrator.fecha_nacimiento,
      correoAdmin: newAdministrator.correo,
      contrasenaAdmin: "admin@123" // 🔐 Contraseña fija por defecto
    };

    const res = await registerAdmin(payload);

    if (res.exito) {
      showAlert("Administrator added successfully", "success");
      setNewAdministrator({
        id: "",
        correo: "",
        password: "",
        rol: "",
        estado: "",
        nombre: "",
        apellido: "",
        fecha_nacimiento: ""
      });
      setOpenForm(false);

      // Refrescar lista
      const update = await getAllAdmins();
      if (update.exito) {
        const adapted = update.administradores.map((admin) => ({
          id: admin.idAdmin,
          nombre: admin.nombreAdmin,
          apellido: admin.apellidoAdmin,
          fecha_nacimiento: admin.fechaNacimientoAdmin,
          correo: admin.correo,
          estado: admin.estado
        }));
        setAdministrators(adapted);
      }

    } else {
      showAlert(res.mensaje, "error");
    }
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
            borderRadius: 30,
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
        onConfirm={handleConfirmDelete} // ✅ debe estar así
        title="Deactivate Administrator"
        message="Are you sure you want to deactivate this administrator?"
        confirmText="Confirm"
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
            sx={{ backgroundColor: "#FF6300", color: "#FAFAFA", borderRadius: 30, "&:hover": { backgroundColor: "#e65c00" } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
