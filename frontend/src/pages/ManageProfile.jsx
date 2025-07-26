import { useEffect, useState } from 'react';
import Zoom from '@mui/material/Zoom';
import {
    Container,
    TextField,
    Typography,
    Box,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
} from '@mui/material';

import useScrollToTop from '../hooks/useScrollToTop';
import { useGlobalAlert } from "../context/AlertContext";

export default function ManageProfile() {


    useScrollToTop();

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

    const handleSubmit = (e) => {
        e.preventDefault();

        const requiredFields = [
            'firstName',
            'lastName',
            'phone',
            'birthDate',
        ];

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

        setSnackbarOpen(true);
        setEditMode(false);
        showAlert("Profile updated successfully", "success"); // placeholder

    };

    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleConfirmDelete = () => {
        // Aquí va la lógica de borrado (API, logout, redirección)
        showAlert("Account deleted", "success"); // placeholder
        setOpenDialog(false);





    };

    useEffect(() => {
        // Simula carga de datos desde localStorage o backend
        const simulatedData = {
            email: 'admin@example.com',
            firstName: 'Juan',
            lastName: 'Pérez',
            phone: '3216549870',
            birthDate: '1990-01-01',
            roleName: 'Administrador', // o 'Distribuidor', 'Cliente'
            position: 'IT Manager', // only if employee
            documentType: 'CC', // only if distributor
            
        };
        setProfile(simulatedData);
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
                    <Dialog open={openDialog} onClose={handleCloseDialog}
                        PaperProps={{
                            sx: {
                                backgroundColor: "#FAFAFA", // fondo blanco
                                borderRadius: 3,
                                boxShadow: 8,
                                p: 2,
                            },
                        }}>
                        <DialogTitle
                            sx={{
                                color: "#212121",        // texto negro
                                fontWeight: "bold",
                                fontSize: "1.25rem",
                                textAlign: "center",
                            }}>
                            Delete Account</DialogTitle>
                        <DialogContent>
                            <Typography sx={{ color: "#212121", textAlign: "center" }}>
                                Are you sure you want to delete your account? <br />
                                This action <strong>cannot be undone</strong>.
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: "center", gap: 1 }}>
                            <Button
                                onClick={handleCloseDialog}
                                variant="outlined"
                                sx={{
                                    borderColor: "#BDBDBD",
                                    color: "#212121",
                                    ":hover": {
                                        borderColor: "#FFBE02",
                                        backgroundColor: "#FFBE02",
                                        color: "#212121",
                                    },
                                }}
                            >
                                Cancel</Button>
                            <Button onClick={handleConfirmDelete} color="error"
                                variant="contained"
                                sx={{
                                    backgroundColor: "#f04507ff",
                                    ":hover": {
                                        backgroundColor: "#FFBE02",
                                    },
                                }}>
                                Confirm Delete
                            </Button>
                        </DialogActions>
                    </Dialog>

                </Container>

            </Zoom>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Profile updated successfully!
                </Alert>
            </Snackbar>
        </>


    );


}
