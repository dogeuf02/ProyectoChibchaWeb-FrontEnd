import { useEffect, useState } from 'react';
import Zoom from '@mui/material/Zoom';
import {
  Container,
  TextField,
  Typography,
  Box,
  Paper,
  Button,
} from '@mui/material';

import useScrollToTop from '../hooks/useScrollToTop';
import { useGlobalAlert } from "../context/AlertContext";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import {
  getUserProfile,
  updateClientProfile,
  updateEmployeeProfile,
  updateDistributorProfile,
  updateAdminProfile,
  deactivateUserById,
  changePassword
} from '../api/userApi';
import { useNavigate } from 'react-router-dom';
import { ROLE } from '../enum/roleEnum';
import { auth } from '../api/authApi';
import { useTranslation } from 'react-i18next';

export default function ManageProfile() {
  const { t } = useTranslation();
  useScrollToTop();

  const navigate = useNavigate();
  const { role, logout, userId } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const { showAlert } = useGlobalAlert();
  const [profile, setProfile] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: '',
    roleName: '',
    position: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [originalProfile, setOriginalProfile] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const activateEdit = () => {
    setOriginalProfile(profile);
    setEditMode(true);
  };

  const cancelEdit = () => {
    setProfile(originalProfile);
    setEditMode(false);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let requiredFields = [];
    switch (role) {
      case ROLE.CLIENT:
        requiredFields = ['firstName', 'lastName', 'phone', 'birthDate'];
        break;
      case ROLE.EMPLOYEE:
        requiredFields = ['firstName', 'lastName'];
        break;
      case ROLE.ADMIN:
        requiredFields = ['firstName', 'lastName', 'birthDate'];
        break;
      default:
        requiredFields = [];
    }

    const friendlyNames = {
      email: t("manageProfile.email"),
      firstName: t("manageProfile.firstName"),
      lastName: t("manageProfile.lastName"),
      phone: t("manageProfile.phoneNumber"),
      birthDate: t("manageProfile.birthDate"),
    };

    for (const field of requiredFields) {
      if (!profile[field]) {
        showAlert(`${t("manageProfile.fieldRequired")} "${friendlyNames[field]}"`, 'warning');
        return;
      }
    }

    try {
      // const loginResult = await auth({
      //   correo: profile.email,
      //   contrasena: passwordData.currentPassword,
      // });

      // if (!loginResult.autenticado) {
      //   showAlert(t("manageProfile.incorrectPassword"), "error");
      //   return;
      // }

      if (passwordData.newPassword) {
        const passwordRes = await changePassword(profile.email, passwordData.newPassword);
        console.log("passREs", passwordRes)
        if (passwordRes.status !== 200) {
          showAlert(t("manageProfile.errorUpdatingPassword"), "error");
          return;
        } else {
          showAlert("Password updated correctly.", "success");
        }
        setPasswordData({ currentPassword: '', newPassword: '' });

      }

      let updateFunction;
      let id = profile.id;
      const formattedData = {
        nombreCliente: profile.firstName,
        apellidoCliente: profile.lastName,
        telefono: profile.phone,
        fechaNacimientoCliente: profile.birthDate,
      };

      if (role === ROLE.DISTRIBUTOR) {
        return;
      }
      switch (role) {
        case ROLE.CLIENT:
          updateFunction = updateClientProfile;
          break;
        case ROLE.EMPLOYEE:
          updateFunction = updateEmployeeProfile;
          formattedData.nombreEmpleado = profile.firstName;
          formattedData.apellidoEmpleado = profile.lastName;
          formattedData.fechaNacimientoEmpleado = profile.birthDate;
          delete formattedData.nombreCliente;
          delete formattedData.apellidoCliente;
          delete formattedData.fechaNacimientoCliente;
          break;
        case ROLE.ADMIN:
          updateFunction = updateAdminProfile;
          formattedData.nombreAdmin = profile.firstName;
          formattedData.apellidoAdmin = profile.lastName;
          formattedData.fechaNacimientoAdmin = profile.birthDate;
          delete formattedData.nombreCliente;
          delete formattedData.apellidoCliente;
          delete formattedData.fechaNacimientoCliente;
          break;
        default:
          showAlert(t("manageProfile.unsupportedRole"), "error");
          return;
      }

      const res = await updateFunction(id, formattedData);

      if (res && res.status === 200) {
        setEditMode(false);
        showAlert(t("manageProfile.updateSuccess"), "success");
        setPasswordData({ currentPassword: '', newPassword: '' });
      } else {
        showAlert(t("manageProfile.updateError"), "error");
      }

    } catch (err) {
      showAlert(t("manageProfile.updateError"), "error");
    }
  };

  const handleConfirmDelete = async () => {
    const res = await deactivateUserById(userId);
    if (res.exito) {
      showAlert(t("manageProfile.deleteSuccess"), "success");
      setOpenDialog(false);
      logout();
      setTimeout(() => navigate('/'), 500);
    } else {
      showAlert(t("manageProfile.deleteError"), "error");
      setOpenDialog(false);
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || !role) return;
      const res = await getUserProfile(role, userId);
      if (res.exito) {
        const data = res.data;
        setProfile({
          id: data.idCliente || data.idEmpleado || data.idDistribuidor || data.idAdmin || '',
          email: data.email || '',
          firstName: data.nombreEmpleado || data.nombreCliente || data.nombreAdmin || '',
          lastName: data.apellidoEmpleado || data.apellidoCliente || data.apellidoAdmin || '',
          phone: data.telefono || '',
          birthDate: data.fechaNacimientoEmpleado || data.fechaNacimientoCliente || data.fechaNacimientoAdmin || '',
          roleName: role,
          position: data.cargoEmpleado || '',
          documentType: data.nombreTipoDoc || '',
          companyName: data.nombreEmpresa || '',
          companyAddress: data.direccionEmpresa || '',
          companyNumber: data.numeroDocEmpresa || ''
        });
      } else {
        showAlert(res.mensaje, "error");
      }
    };
    fetchProfile();
  }, []);

  return (
    <Zoom in={true} timeout={800}>
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Paper elevation={3} sx={{ p: 4, bgcolor: '#fafafa' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#212121' }}>
            {t('manageProfile.title')}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField label={t("manageProfile.email")} name="email" value={profile.email} fullWidth margin="normal" disabled />

            {profile.roleName === ROLE.ADMIN && (
              <>
                <TextField label={t("manageProfile.firstName")} name="firstName" value={profile.firstName} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
                <TextField label={t("manageProfile.lastName")} name="lastName" value={profile.lastName} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
                <TextField label={t("manageProfile.birthDate")} name="birthDate" type="date" value={profile.birthDate} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} disabled={!editMode} />
              </>
            )}

            {profile.roleName === 'Distribuidor' && (
              <>
                <TextField label={t("manageProfile.documentType")} name="documentType" value={profile.documentType || ''} fullWidth margin="normal" disabled />
                <TextField label={t("manageProfile.companyNumber")} name="companyNumber" value={profile.companyNumber || ''} fullWidth margin="normal" disabled />
                <TextField label={t("manageProfile.companyName")} name="companyName" value={profile.companyName || ''} fullWidth margin="normal" disabled />
                <TextField label={t("manageProfile.companyAddress")} name="companyAddress" value={profile.companyAddress || ''} fullWidth margin="normal" disabled />
              </>
            )}

            {profile.roleName === 'Cliente' && (
              <>
                <TextField label={t("manageProfile.firstName")} name="firstName" value={profile.firstName} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
                <TextField label={t("manageProfile.lastName")} name="lastName" value={profile.lastName} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
                <TextField label={t("manageProfile.phoneNumber")} name="phone" value={profile.phone} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
                <TextField label={t("manageProfile.birthDate")} name="birthDate" type="date" value={profile.birthDate} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} disabled={!editMode} />
              </>
            )}

            {profile.roleName === 'Empleado' && (
              <>
                <TextField label={t("manageProfile.firstName")} name="firstName" value={profile.firstName} fullWidth margin="normal" disabled />
                <TextField label={t("manageProfile.lastName")} name="lastName" value={profile.lastName} fullWidth margin="normal" disabled />
              </>
            )}

            <TextField label={t("manageProfile.role")} name="roleName" value={profile.roleName} fullWidth margin="normal" disabled />

            <TextField label={t("manageProfile.currentPassword")} name="currentPassword" type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} fullWidth margin="normal" disabled={!editMode} />
            <TextField label={t("manageProfile.newPassword")} name="newPassword" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} fullWidth margin="normal" disabled={!editMode} />

            {!editMode && role !== ROLE.EMPLOYEE && (
              <Button type="button" onClick={activateEdit} variant="contained" fullWidth sx={{ mt: 3, mb: 2, bgcolor: '#ff6f00', borderRadius: 30, '&:hover': { bgcolor: '#ffc107', color: '#212121' } }}>
                {t("manageProfile.editProfile")}
              </Button>
            )}

            {editMode && role !== ROLE.EMPLOYEE && (
              <Box display="flex" gap={2} mb={2}>
                <Button onClick={cancelEdit} variant="outlined" color="inherit" sx={{ mt: 3, mb: 2, borderRadius: 30 }}>
                  {t("manageProfile.cancel")}
                </Button>
                <Button type="submit" variant="contained" sx={{ bgcolor: '#ff6f00', borderRadius: 30, mt: 3, mb: 2, '&:hover': { bgcolor: '#ffc107', color: '#212121' } }}>
                  {t("manageProfile.saveChanges")}
                </Button>
              </Box>
            )}

            {role !== ROLE.EMPLOYEE && (
              <>
                <Box display="flex" justifyContent="center" mt={2} mb={1}>
                  <Button variant="contained" color="error" sx={{ backgroundColor: "#f04507ff", borderRadius: 30, ":hover": { backgroundColor: "#FFBE02" } }} onClick={handleOpenDialog}>
                    {t("manageProfile.deleteAccount")}
                  </Button>
                </Box>
                <Typography variant="caption" color="textSecondary" align="center" sx={{ mt: 1 }}>
                  {t("manageProfile.deleteWarning")}
                </Typography>
              </>
            )}
          </Box>
        </Paper>

        <ConfirmDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmDelete}
          title={t("manageProfile.dialogTitle")}
          message={t("manageProfile.dialogMessage")}
          confirmText={t("manageProfile.dialogConfirm")}
        />
      </Container>
    </Zoom>
  );
}
