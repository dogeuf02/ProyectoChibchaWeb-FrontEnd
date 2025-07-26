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


export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
    ];

    const friendlyNames = {
      firstName: 'First Name',
      lastName: 'Last Name',
      birthDate: 'Birth Date',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      phone: 'Phone',
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
            Register
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
  );
}
