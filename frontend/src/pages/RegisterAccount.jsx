import { useEffect, useState } from 'react';
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
import Zoom from '@mui/material/Zoom';
import { useGlobalAlert } from "../context/AlertContext";
import { createClient } from '../api/clientApi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';

export default function RegisterAccount() {
  const { t } = useTranslation();
  useScrollToTop();

  const navigate = useNavigate();
  const { showAlert } = useGlobalAlert();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [captchaToken, setCaptchaToken] = useState(null);

  const handleCaptchaChange = (value) => {
    setCaptchaToken(value);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      showAlert('Please complete the captcha', 'warning');
      return;
    }

    if (form.password !== form.confirmPassword) {
      showAlert('Passwords do not match', 'warning');
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
        showAlert(`The field "${friendlyNames[field]}" is required.`, 'warning');
        return;
      }
    }

    const client = {
      "correoCliente": form.email,
      "contrasenaCliente": form.password,
      "nombreCliente": form.firstName,
      "apellidoCliente": form.lastName,
      "telefono": form.phone,
      "fechaNacimientoCliente": form.birthDate,
      "captchaToken": captchaToken
    }

    const res = await createClient(client);
    if (res.exito) {
      showAlert('Register success', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 500);
    } else {
      showAlert(res.mensaje, 'error');
      setCaptchaToken(null);
    }
  };

  return (
    <Zoom in={true} timeout={800}>
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Paper elevation={3} sx={{ p: 4, bgcolor: '#fafafa' }}>
          <Typography variant="h5" gutterBottom sx={{
            color: '#212121',
            fontFamily: 'Poppins, sans-serif',
          }}>
            {t('registerAccount.title')}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label={t('registerAccount.firstNameField')}
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
              label={t('registerAccount.lastnameField')}
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
              label={t('registerAccount.emailField')}
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
              label={t('registerAccount.phoneNumberField')}
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
              label={t('registerAccount.birthDateField')}
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
              label={t('registerAccount.passwordField')}
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
              label={t('registerAccount.confirmPasswordfield')}
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
            <Box mt={3} display="flex" justifyContent="center">
              <ReCAPTCHA
                sitekey="6LePn5krAAAAAAnj4Tz_1s9K7dZEYLVsdUeFqwqB"
                onChange={handleCaptchaChange}
              />
            </Box>

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
              {t('registerAccount.registerButton')}
            </Button>

            <Typography variant="body2" sx={{ mt: 2 }}>
              {t('registerAccount.accountLabel')}{' '}
              <Link href="/login" underline="hover" sx={{ color: '#ff6f00', '&:hover': { color: '#ffc107' } }}>
                {t('registerAccount.accountLink')}
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              {t('registerAccount.distributorLabel')}{' '}
              <Link href="/RegisterDistributor" underline="hover" sx={{ color: '#ff6f00', '&:hover': { color: '#ffc107' } }}>
                {t('registerAccount.distributorLink')}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Zoom>
  );
}