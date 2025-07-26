import { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Link
} from '@mui/material';

export default function RegisterDistributor() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        companyNumber: '',
        companyAddress: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('handleSubmit llamado');
        if (form.password !== form.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const requiredFields = [
            'firstName',
            'lastName',
            'birthDate',
            'email',
            'password',
            'confirmPassword',
            'phone',
            'companyNumber',
            'companyAddress',
        ];

        const friendlyNames = {
            firstName: 'First Name',
            lastName: 'Last Name',
            birthDate: 'Birth Date',
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            phone: 'Phone',
            companyNumber: 'Company Number',
            companyAddress: 'Company Address',
        };

        for (const field of requiredFields) {
            if (!form[field]) {
                alert(`The field "${friendlyNames[field]}" is required.`);
                return;
            }
        }

        console.log('Registrando usuario:', form);
        alert('Registro exitoso');
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 6 }}>
            <Box display="flex"
                flexDirection={{ xs: 'column', md: 'row' }}
                justifyContent="center"
                gap={6}
                px={4} >
                <Paper elevation={3} sx={{ p: 4, bgcolor: '#fafafa', flex: 1 }}>
                    <Typography variant="h5" gutterBottom sx={{
                        color: '#212121',
                        fontFamily: 'Poppins, sans-serif',
                    }}>
                        Create request for Distributor
                    </Typography>

                    <Box component="form">
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={form.firstName}
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
                            label="Last Name"
                            name="lastName"
                            value={form.lastName}
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
                            label="Phone number"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            type="tel"
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
                            label="Birth Date"
                            name="birthDate"
                            type="date"
                            value={form.birthDate}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            InputLabelProps={{ shrink: true }}
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
                <Paper elevation={3} sx={{ p: 4, bgcolor: '#f5f5f5', flex: 1 }}>
                    <Typography variant="h5" gutterBottom sx={{ color: '#212121' }}>
                        Company information
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            label="Company number"
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
                            label="company address"
                            fullWidth margin="normal"
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
            </Box>
        </Container>
    );
}
