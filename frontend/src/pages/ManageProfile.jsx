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
    deactivateUserById
} from '../api/userApi';
import { useNavigate } from 'react-router-dom';



export default function ManageProfile() {


    useScrollToTop();

    const navigate = useNavigate();
    const { role, logout } = useAuth();
    const userId = localStorage.getItem("userId");



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

        const requiredFields = ['firstName', 'lastName', 'phone', 'birthDate'];
        const friendlyNames = {
            email: 'Email',
            firstName: 'First Name',
            lastName: 'Last Name',
            phone: 'Phone',
            birthDate: 'Birth Date',
        };

        for (const field of requiredFields) {
            if (!profile[field]) {
                showAlert(`The field "${friendlyNames[field]}" is required.`, 'warning');
                return;
            }
        }

        try {
            let updateFunction;
            let id = profile.id;

            const formattedData = {
                nombreCliente: profile.firstName,
                apellidoCliente: profile.lastName,
                telefono: profile.phone,
                fechaNacimientoCliente: profile.birthDate,
            };

            switch (role) {
                case 'Cliente':
                    updateFunction = updateClientProfile;
                    break;
                case 'Empleado':
                    updateFunction = updateEmployeeProfile;
                    formattedData.nombreEmpleado = profile.firstName;
                    formattedData.apellidoEmpleado = profile.lastName;
                    formattedData.fechaNacimientoEmpleado = profile.birthDate;
                    delete formattedData.nombreCliente;
                    delete formattedData.apellidoCliente;
                    delete formattedData.fechaNacimientoCliente;
                    break;
                case 'Distribuidor':
                    updateFunction = updateDistributorProfile;
                    // agrega los campos si vas a permitir edición para distribuidores
                    break;
                case 'Administrador':
                    updateFunction = updateAdminProfile;
                    formattedData.nombreAdmin = profile.firstName;
                    formattedData.apellidoAdmin = profile.lastName;
                    formattedData.fechaNacimientoAdmin = profile.birthDate;
                    delete formattedData.nombreCliente;
                    delete formattedData.apellidoCliente;
                    delete formattedData.fechaNacimientoCliente;
                    break;
                default:
                    showAlert("Not supported rol", "error");
                    return;
            }

            const res = await updateFunction(id, formattedData);

            if (res && res.status === 200) {
                setEditMode(false);
                showAlert("Profile updated successfully", "success");
            } else {
                showAlert("There was a problem updating the profile", "error");
            }

        } catch (err) {
            console.error("❌ Error actualizando perfil:", err);
            showAlert("Error updating profile", "error");
        }
    };

    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleConfirmDelete = async () => {
        const userId = localStorage.getItem("userId");

        const res = await deactivateUserById(userId);

        if (res.exito) {
            showAlert("Account Succesfully Deleted", "success");

            setOpenDialog(false);

            logout();

            setTimeout(() => {
                navigate('/');
            }, 500);
        } else {
            showAlert("Error Deleting Acount", "error");
            setOpenDialog(false);
        }
    };



    useEffect(() => {
        const fetchProfile = async () => {
            const userId = localStorage.getItem("userId");
            const userRole = role; // desde useAuth()

            if (!userId || !userRole) return;

            const res = await getUserProfile(userRole, userId);
            console.log("Profile data:", res);

            if (res.exito) {
                const data = res.data;

                setProfile({
                    id: data.idCliente || data.idEmpleado || data.idDistribuidor || data.idAdmin || '',
                    email: data.email || '',
                    firstName: data.nombreEmpleado || data.nombreCliente || data.nombreAdmin || '',
                    lastName: data.apellidoEmpleado || data.apellidoCliente || data.apellidoAdmin || '',
                    phone: data.telefono || '',
                    birthDate: data.fechaNacimientoEmpleado || data.fechaNacimientoCliente || data.fechaNacimientoAdmin || '',
                    roleName: userRole,
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
        <>
            <Zoom in={true} timeout={800}>
                <Container maxWidth="sm" sx={{ mt: 6 }}>
                    <Paper elevation={3} sx={{ p: 4, bgcolor: '#fafafa' }}>
                        <Typography variant="h5" gutterBottom sx={{ color: '#212121' }}>
                            Manage Profile
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} noValidate >

                            <TextField
                                label="Email"
                                name="email"
                                value={profile.email}
                                fullWidth
                                margin="normal"
                                disabled
                            />


                            {profile.roleName === 'Administrador' && (
                                <>

                                    <TextField
                                        label="First Name"
                                        name="firstName"
                                        value={profile.firstName}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        disabled={!editMode}
                                    />
                                    <TextField
                                        label="Last Name"
                                        name="lastName"
                                        value={profile.lastName}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        disabled={!editMode}
                                    />

                                    <TextField
                                        label="Birth Date"
                                        name="birthDate"
                                        type="date"
                                        value={profile.birthDate}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        InputLabelProps={{ shrink: true }}
                                        disabled={!editMode}
                                    />





                                </>)}

                            {profile.roleName === 'Distribuidor' && (
                                <>
                                    <TextField

                                        label="Document type"
                                        name="documentType"
                                        value={profile.documentType || ''}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        disabled

                                    />
                                    <TextField
                                        label="Company number"
                                        name="companyNumber"
                                        value={profile.companyNumber}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        disabled
                                    />
                                    <TextField
                                        label="Company name"
                                        name="companyName"
                                        value={profile.companyName}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        disabled
                                    />
                                    <TextField
                                        label="Company address"
                                        name="companyAddress"
                                        value={profile.companyAddress}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        disabled
                                    />







                                </>

                            )}


                            {profile.roleName === 'Cliente' && (
                                <>

                                    <TextField
                                        label="First Name"
                                        name="firstName"
                                        value={profile.firstName}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        disabled={!editMode}
                                    />
                                    <TextField
                                        label="Last Name"
                                        name="lastName"
                                        value={profile.lastName}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        disabled={!editMode}
                                    />
                                    <TextField
                                        label="Phone Number"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        disabled={!editMode}
                                    />
                                    <TextField
                                        label="Birth Date"
                                        name="birthDate"
                                        type="date"
                                        value={profile.birthDate}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        InputLabelProps={{ shrink: true }}
                                        disabled={!editMode}
                                    />







                                </>)}

                            {profile.roleName === 'Empleado' && (
                                <>

                                    <TextField
                                        label="First Name"
                                        name="firstName"
                                        value={profile.firstName}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        disabled={!editMode}
                                    />
                                    <TextField
                                        label="Last Name"
                                        name="lastName"
                                        value={profile.lastName}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        disabled={!editMode}
                                    />


                                </>)}


                            <TextField
                                label="Role"
                                name="roleName"
                                value={profile.roleName}
                                fullWidth
                                margin="normal"
                                disabled
                            />


                            {!editMode ? (
                                <Button
                                    type="button"
                                    onClick={activateEdit}
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        mt: 3,
                                        mb: 2,
                                        bgcolor: '#ff6f00',
                                        borderRadius: 30,
                                        '&:hover': { bgcolor: '#ffc107', color: '#212121' }
                                    }}
                                >
                                    Edit Profile
                                </Button>
                            )
                                : (

                                    <Box display="flex" gap={2} mb={2}>

                                        <Button
                                            onClick={cancelEdit}
                                            variant="outlined"
                                            color="inherit"
                                            sx={{
                                                mt: 3,
                                                mb: 2,
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            sx={{
                                                bgcolor: '#ff6f00',
                                                borderRadius: 30,
                                                mt: 3,
                                                mb: 2,
                                                '&:hover': { bgcolor: '#ffc107', color: '#212121' }
                                            }}
                                        >
                                            Save Changes
                                        </Button>
                                    </Box>
                                )}
                            <Box display="flex" justifyContent="center" mt={2} mb={1}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{
                                        backgroundColor: "#f04507ff",
                                        ":hover": {
                                            backgroundColor: "#FFBE02",
                                        },
                                    }}
                                    onClick={handleOpenDialog}
                                >
                                    DELETE ACCOUNT
                                </Button>
                            </Box>
                            <Typography variant="caption" color="textSecondary" align="center" sx={{ mt: 1 }}>
                                Deleting your account is irreversible.
                            </Typography>
                        </Box>

                    </Paper>
                    <ConfirmDialog
                        open={openDialog}
                        onClose={handleCloseDialog}
                        onConfirm={handleConfirmDelete}
                        title="Delete Account"
                        message="Are you sure you want to delete your account? This action cannot be undone."
                        confirmText="Confirm Delete"
                    />

                </Container>

            </Zoom>

        </>


    );


}
