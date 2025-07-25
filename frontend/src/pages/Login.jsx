import { useState } from 'react';
import Zoom from '@mui/material/Zoom';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Link
} from '@mui/material';
import useScrollToTop from '../hooks/useScrollToTop';
import { useGlobalAlert } from "../context/AlertContext";

export default function Login() {
    const { showAlert } = useGlobalAlert();
    useScrollToTop();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        showAlert("Login successful!", "success");
    };

    return (
        <Zoom in={true} timeout={800}>
            <Container maxWidth="sm" sx={{ mt: 10 }}>
                <Paper elevation={3} sx={{ p: 4, bgcolor: '#fafafa' }}>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                            color: '#212121',
                            fontFamily: 'Poppins, sans-serif',
                        }}
                    >
                        Sign In
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
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

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 4,
                                bgcolor: '#ff6f00',
                                borderRadius: 30,
                                '&:hover': { bgcolor: '#ffc107', color: '#212121' }
                            }}
                        >
                            Sign In
                        </Button>

                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Don't have an account?{' '}
                            <Link
                                href="/RegisterAccount"
                                underline="hover"
                                sx={{
                                    color: '#ff6f00',
                                    '&:hover': { color: '#ffc107' }
                                }}
                            >
                                Create account
                            </Link>
                        </Typography>

                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Do you want to work with us as a distribuitor?{' '}
                            <Link
                                href="/RegisterDistributor"
                                underline="hover"
                                sx={{
                                    color: '#ff6f00',
                                    '&:hover': { color: '#ffc107' }
                                }}
                            >
                                Click here
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Zoom>
    );
}
