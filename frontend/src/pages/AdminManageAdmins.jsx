import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";
import ConfirmDialog from "../components/ConfirmDialog";
import AdministratorList from "../components/AdministratorList";
import { getAllAdmins, registerAdmin, deactivateUser } from "../api/userApi";
import { useTranslation } from "react-i18next";

export default function AdminManageAdminis() {
  useScrollToTop();
  const { t } = useTranslation();
  const { showAlert } = useGlobalAlert();

  const [administrators, setAdministrators] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
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
    setSelectedCorreo(admin.correo);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCorreo) return;

    const res = await deactivateUser(selectedCorreo);

    if (res.exito) {
      setAdministrators((prev) =>
        prev.map((a) =>
          a.correo === selectedCorreo ? { ...a, estado: "INACTIVO" } : a
        )
      );
      setOpenDialog(false);
      setSelectedCorreo(null);
      showAlert(t("administratorManagement.alerts.deactivated"), "success");
    } else {
      showAlert(res.mensaje || t("administratorManagement.alerts.deactivateError"), "error");
    }
  };

  const handleAddAdministrator = async () => {
    const requiredFields = ["correo", "nombre", "apellido", "fecha_nacimiento"];
    const friendlyNames = {
      correo: t("administratorManagement.addAdminDialog.emailField"),
      nombre: t("administratorManagement.addAdminDialog.firstNameField"),
      apellido: t("administratorManagement.addAdminDialog.lastnameField"),
      fecha_nacimiento: t("administratorManagement.addAdminDialog.birthDateField"),
    };

    for (const field of requiredFields) {
      if (!newAdministrator[field] || newAdministrator[field].trim() === "") {
        showAlert(`${t("administratorManagement.alerts.requiredField")} "${friendlyNames[field]}"`, "warning");
        return;
      }
    }

    const payload = {
      nombreAdmin: newAdministrator.nombre,
      apellidoAdmin: newAdministrator.apellido,
      fechaNacimientoAdmin: newAdministrator.fecha_nacimiento,
      correoAdmin: newAdministrator.correo,
      contrasenaAdmin: "admin@123"
    };

    const res = await registerAdmin(payload);

    if (res.exito) {
      showAlert(t("administratorManagement.alerts.added"), "success");
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
      showAlert(res.mensaje || t("administratorManagement.alerts.addError"), "error");
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212121" }}>
          {t("administratorManagement.title")}
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
          {t("administratorManagement.addAdminButton")}
        </Button>
      </Box>

      <AdministratorList admins={administrators} onRequestDelete={handleRequestDelete} />
      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title={t("administratorManagement.deleteDialog.title")}
        message={t("administratorManagement.deleteDialog.message")}
        confirmText={t("administratorManagement.deleteDialog.confirmText")}
      />

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth>
        <DialogTitle>{t("administratorManagement.addAdminDialog.title")}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label={t("administratorManagement.addAdminDialog.firstNameField")}
              value={newAdministrator.nombre}
              onChange={(e) => setNewAdministrator({ ...newAdministrator, nombre: e.target.value })}
              fullWidth
            />
            <TextField
              label={t("administratorManagement.addAdminDialog.lastnameField")}
              value={newAdministrator.apellido}
              onChange={(e) => setNewAdministrator({ ...newAdministrator, apellido: e.target.value })}
              fullWidth
            />
            <TextField
              label={t("administratorManagement.addAdminDialog.emailField")}
              value={newAdministrator.correo}
              onChange={(e) => setNewAdministrator({ ...newAdministrator, correo: e.target.value })}
              fullWidth
            />
            <TextField
              label={t("administratorManagement.addAdminDialog.birthDateField")}
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
            {t("administratorManagement.addAdminDialog.cancelButton")}
          </Button>
          <Button
            onClick={handleAddAdministrator}
            variant="contained"
            sx={{ backgroundColor: "#FF6300", color: "#FAFAFA", borderRadius: 30, "&:hover": { backgroundColor: "#e65c00" } }}
          >
            {t("administratorManagement.addAdminDialog.saveButton")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
