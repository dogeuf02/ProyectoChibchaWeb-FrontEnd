import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from '@mui/material';

export default function Register() {
  const [form, setForm] = useState({
    nombre: '',
    LastName: '',
    fechaNacimiento: '',
    email: '',
    password: '',
    confirmar: '',
    phone: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('handleSubmit llamado');
    if (form.password !== form.confirmar) {
      alert('Las contraseñas no coinciden');
      return;
    }

    console.log('Registrando usuario:', form);
    alert('Registro exitoso');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, bgcolor: '#fafafa' }}>
        <Typography variant="h5" gutterBottom sx={{
          color: '#212121',
          fontFamily: 'Poppins, sans-serif',
        }}>
          Create Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Name"
            name="nombre"
            value={form.nombre}
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
            label="Last name"
            name="LastName"
            value={form.LastName}
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
            label="Fecha de nacimiento"
            name="fechaNacimiento"
            type="date"
            value={form.fechaNacimiento}
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
            label="Confirm password"
            name="confirmar"
            value={form.confirmar}
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
              mt: 2,
              bgcolor: '#ff6f00',
              borderRadius: 30,
              '&:hover': { bgcolor: '#ffc107', color: '#212121' }
            }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
