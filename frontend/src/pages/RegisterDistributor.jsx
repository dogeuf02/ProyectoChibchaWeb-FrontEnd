import { useState } from 'react';
import Zoom from '@mui/material/Zoom';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Link,
    MenuItem,
} from '@mui/material';
import useScrollToTop from '../hooks/useScrollToTop';
import { useGlobalAlert } from "../context/AlertContext";
import { createDistributor } from '../api/distributorApi'; // ajusta la ruta si es diferente

export default function RegisterDistributor() {

    useScrollToTop();

    const { showAlert } = useGlobalAlert();
    const [form, setForm] = useState({

        email: '',
        password: '',
        confirmPassword: '',
        companyNumber: '',
        companyAddress: '',
        documentType: 'NIT',
        companyName: '',
    });

    const documentTypes = [
        'NIT',         // Colombia
        'RUC',         // Perú, Ecuador
        'CUIT',        // Argentina
        'RIF',         // Venezuela
        'CPF_CNPJ',    // Brasil
        'TIN',         // África
        'PASSPORT',    // Internacional
        'BUSINESS_ID', // Genérico
        'OTHER',       // Fallback
    ];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            showAlert('Passwords do not match', 'warning');
            return;
        }

        const requiredFields = [
            'email',
            'password',
            'confirmPassword',
            'documentType',
            'companyNumber',
            'companyName',
            'companyAddress',
        ];

        const friendlyNames = {
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            documentType: 'Document Type',
            companyNumber: 'Company Number',
            companyName: 'Company Name',
            companyAddress: 'Company Address',
        };

        for (const field of requiredFields) {
            if (!form[field]) {
                showAlert(`The field "${friendlyNames[field]}" is required.`, 'warning');
                return;
            }
        }

        const distributor = {
            numeroDocEmpresa: form.companyNumber,
            nombreEmpresa: form.companyName,
            direccionEmpresa: form.companyAddress,
            nombreTipoDoc: form.documentType,
            correoDistrbuidor: form.email,
            contrasenaDistribuidor: form.password,
        };

        try {
            const result = await createDistributor(distributor);

            if (result.exito) {
                showAlert('Registro exitoso', 'success');
                setForm({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    companyNumber: '',
                    companyAddress: '',
                    documentType: 'NIT',
                    companyName: '',
                });
            } else {
                showAlert(result.mensaje || 'Error al registrar el distribuidor', 'error');
            }
        } catch (err) {
            console.error(err);
            showAlert('Error inesperado al registrar el distribuidor', 'error');
        }
    };


    return (
        <Container maxWidth="xl" sx={{ mt: 6 }}>
            <Box display="flex"
                flexDirection={{ xs: 'column', md: 'row' }}
                justifyContent="center"
                gap={6}
                px={4} >
                <Zoom in={true} timeout={800}>

                    <Paper elevation={3} sx={{ p: 4, bgcolor: '#fafafa', flex: 1 }}>
                        <Typography variant="h5" gutterBottom sx={{
                            color: '#212121',
                            fontFamily: 'Poppins, sans-serif',
                        }}>
                            Create request for Distributor
                        </Typography>
                        <Box component="form">

                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                required
                                sx={{
                                    '& label': { color: '#a5a5a5ff' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#bdbdbd' },
                                        '&:hover fieldset': { borderColor: '#ff6f00' },
                                        '&.Mui-focused fieldset': { borderColor: '#ffc107' },
                                    }
                                }}
                            />


                            <TextField
                                label="Password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                type="password"
                                fullWidth
                                margin="normal"
                                required
                                sx={{
                                    '& label': { color: '#a5a5a5ff' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#bdbdbd' },
                                        '&:hover fieldset': { borderColor: '#ff6f00' },
                                        '&.Mui-focused fieldset': { borderColor: '#ffc107' },
                                    }
                                }}
                            />
                            <TextField
                                label="Confirm Password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                type="password"
                                fullWidth
                                margin="normal"
                                required
                                sx={{
                                    '& label': { color: '#a5a5a5ff' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#bdbdbd' },
                                        '&:hover fieldset': { borderColor: '#ff6f00' },
                                        '&.Mui-focused fieldset': { borderColor: '#ffc107' },
                                    }
                                }}
                            />

                        </Box>

                    </Paper>
                </Zoom>
                <Zoom in={true} timeout={1500}>
                    <Paper elevation={3} sx={{ p: 4, bgcolor: '#f5f5f5', flex: 1 }}>
                        <Typography variant="h5" gutterBottom sx={{ color: '#212121' }}>
                            Company information
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} noValidate>

                            <TextField
                                select
                                label="Document type"
                                name="documentType"
                                value={form.documentType || ''}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                sx={{
                                    '& label': { color: '#a5a5a5ff' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#bdbdbd' },
                                        '&:hover fieldset': { borderColor: '#ff6f00' },
                                        '&.Mui-focused fieldset': { borderColor: '#ffc107' },
                                    }
                                }}
                            >
                                {documentTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="Company number"
                                name="companyNumber"
                                value={form.companyNumber}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                sx={{
                                    '& label': { color: '#a5a5a5ff' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#bdbdbd' },
                                        '&:hover fieldset': { borderColor: '#ff6f00' },
                                        '&.Mui-focused fieldset': { borderColor: '#ffc107' },
                                    }
                                }} />
                            <TextField
                                label="Company name"
                                name="companyName"
                                value={form.companyName}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                sx={{
                                    '& label': { color: '#a5a5a5ff' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#bdbdbd' },
                                        '&:hover fieldset': { borderColor: '#ff6f00' },
                                        '&.Mui-focused fieldset': { borderColor: '#ffc107' },
                                    }
                                }} />
                            <TextField
                                label="Company address"
                                name="companyAddress"
                                value={form.companyAddress}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                sx={{
                                    '& label': { color: '#a5a5a5ff' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#bdbdbd' },
                                        '&:hover fieldset': { borderColor: '#ff6f00' },
                                        '&.Mui-focused fieldset': { borderColor: '#ffc107' },
                                    }
                                }} />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    mt: 3,
                                    bgcolor: '#ff6f00',
                                    borderRadius: 30,
                                    '&:hover': { bgcolor: '#ffc107', color: '#212121' }
                                }}
                            >
                                Send request
                            </Button>
                            <Typography variant="body2" sx={{ mt: 2 }}>
                                Have an account?{' '}
                                <Link
                                    href="/login"
                                    underline="hover"
                                    sx={{
                                        color: '#ff6f00',
                                        '&:hover': { color: '#ffc107' }
                                    }}
                                >
                                    Sign in
                                </Link>
                            </Typography>
                        </Box>

                    </Paper>
                </Zoom>
            </Box>
        </Container>
    );
}
