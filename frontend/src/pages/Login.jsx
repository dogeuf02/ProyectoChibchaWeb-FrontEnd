import { useState, useEffect, useRef } from 'react';
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
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Login() {
  useScrollToTop();
  const { t } = useTranslation();
  const recaptchaRef = useRef();
  const { showAlert } = useGlobalAlert();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [captchaToken, setCaptchaToken] = useState(null);

  useEffect(() => {
    if (location.state?.alert) {
      const { type, message } = location.state.alert;
      showAlert(`[${type.toUpperCase()}] ${message}`);
    }
  }, [location]);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (value) => {
    setCaptchaToken(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      showAlert('Please complete the captcha', 'warning');
      recaptchaRef.current?.reset();

      return;
    }

    const result = await login(form.email, form.password, captchaToken);

    if (result.success) {
      showAlert(t('alert.success.login'), "success");

      navigate("/");
    } else {
      showAlert(result.message || t("alert.error.login"), "error");
      setCaptchaToken(null);
    }
    recaptchaRef.current?.reset();

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
            {t('loginPage.signInTitle')}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label={t('loginPage.emailField')}
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
              label={t('loginPage.passwordField')}
              name="password"
              type="password"
              value={form.password}
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

            <Box mt={3} display="flex" justifyContent="center">
              <ReCAPTCHA
                sitekey="6LePn5krAAAAAAnj4Tz_1s9K7dZEYLVsdUeFqwqB"
                onChange={handleCaptchaChange}
                ref={recaptchaRef}
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
              {t('loginPage.signInButton')}
            </Button>

            <Typography variant="body2" sx={{ mt: 2 }}>
              {t('loginPage.accountLabel')}{' '}
              <Link
                href="/RegisterAccount"
                underline="hover"
                sx={{
                  color: '#ff6f00',
                  '&:hover': { color: '#ffc107' }
                }}
              >
                {t('loginPage.createAccountLink')}
              </Link>
            </Typography>

            <Typography variant="body2" sx={{ mt: 2 }}>
              {t('loginPage.distributorLabel')}{' '}
              <Link
                href="/RegisterDistributor"
                underline="hover"
                sx={{
                  color: '#ff6f00',
                  '&:hover': { color: '#ffc107' }
                }}
              >
                {t('loginPage.distributorLink')}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Zoom>
  );
}