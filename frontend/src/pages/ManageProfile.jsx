import { useEffect, useState } from 'react';
import {
    Container,
    TextField,
    Typography,
    Box,
    Paper,
    Button,
} from '@mui/material';

export default function ManageProfile() {
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
                alert(`The field "${friendlyNames[field]}" is required.`);
                return;
            }
        }

        // Validaciones adicionales aquí si es necesario
        console.log('Profile updated:', profile);
        alert('Profile updated successfully');
        setEditMode(false);
    };

    useEffect(() => {
        // Simula carga de datos desde localStorage o backend
        const simulatedData = {
            email: 'admin@example.com',
            firstName: 'Juan',
            lastName: 'Pérez',
            phone: '3216549870',
            birthDate: '1990-01-01',
            roleName: 'administrator',
            position: 'IT Manager', // only if employee
        };
        setProfile(simulatedData);
    }, []);

    return (
        <Container maxWidth="sm" sx={{ mt: 6 }}>
            <Paper elevation={3} sx={{ p: 4, bgcolor: '#fafafa' }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#212121' }}>
                    Manage Profile
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Email"
                        name="email"
                        value={profile.email}
                        fullWidth
                        margin="normal"
                        disabled
                    />
                    
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
                    <TextField
                        label="Role"
                        name="roleName"
                        value={profile.roleName}
                        fullWidth
                        margin="normal"
                        disabled
                    />

                    {profile.roleName === 'employee' && (
                        <TextField
                            label="Position"
                            name="position"
                            value={profile.position}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                    )}

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
                    ) : (
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
                </Box>
            </Paper>
        </Container>
    );
}
