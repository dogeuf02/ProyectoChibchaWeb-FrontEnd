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
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

import { login } from '../api/authApi';

export default function Login() {
    const { showAlert } = useGlobalAlert();
    const navigate = useNavigate();

    useScrollToTop();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
  e.preventDefault();

  const credentials = {
    correo: form.email,
    contrasena: form.password
  };

  try {
    const res = await login(credentials); // espera la respuesta

    showAlert("Login successful!", "success");

login(res.rol);  // actualiza el contexto global


    console.log(res)
    // Redirigir según tipo de usuario
    if (res.rol === 'Cliente') {
      navigate('/');
      console.log("vista cliente")
    } else if (res.rol === 'empleado') {
      navigate('/dashboard-empleado');
    } else {
      navigate('/');
    }

  } catch (error) {
    showAlert("Mail or password incorrect", "failed");
    console.error(error);
  }
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
