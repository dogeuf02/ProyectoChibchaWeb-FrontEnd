import { useState, useEffect } from 'react';
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
import { createDistributor } from '../api/distributorApi';
import { getDocumentTypes } from '../api/documentTypeApi';
import ReCAPTCHA from 'react-google-recaptcha';

export default function RegisterDistributor() {
  useScrollToTop();

  const [documentTypes, setDocumentTypes] = useState([]);
  const { showAlert } = useGlobalAlert();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyNumber: '',
    companyAddress: '',
    documentType: '',
    companyName: '',
  });
  const [captchaToken, setCaptchaToken] = useState(null);

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      const types = await getDocumentTypes();
      setDocumentTypes(types);
      if (types.length > 0 && !form.documentType) {
        setForm((prev) => ({ ...prev, documentType: types[0].nombreTipoDoc }));
      }
    };
    fetchDocumentTypes();
  }, []);

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
      return;
    }

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
      captchaToken: captchaToken,
    };

    try {
      const result = await createDistributor(distributor);
      if (result.exito) {
        showAlert('Register Success', 'success');
        setForm({
          email: '',
          password: '',
          confirmPassword: '',
          companyNumber: '',
          companyAddress: '',
          documentType: documentTypes[0]?.nombreTipoDoc || '',
          companyName: '',
        });
        setCaptchaToken(null);
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
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent="center"
        gap={6}
        px={4}
      >
        <Zoom in={true} timeout={800}>
          <Paper elevation={3} sx={{ p: 4, bgcolor: '#fafafa', flex: 1 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}>
              Create request for Distributor
            </Typography>
            <Box component="form" noValidate>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth margin="normal" required
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
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth margin="normal" required
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
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                fullWidth margin="normal" required
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
                select label="Document type" name="documentType"
                value={form.documentType || ''}
                onChange={handleChange}
                fullWidth margin="normal"
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
                  <MenuItem key={type.nombreTipoDoc} value={type.nombreTipoDoc}>
                    {type.nombreTipoDoc}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Company number"
                name="companyNumber"
                value={form.companyNumber}
                onChange={handleChange}
                fullWidth margin="normal"
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
                label="Company name"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                fullWidth margin="normal"
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
                label="Company address"
                name="companyAddress"
                value={form.companyAddress}
                onChange={handleChange}
                fullWidth margin="normal"
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
                <Link href="/login" underline="hover" sx={{ color: '#ff6f00', '&:hover': { color: '#ffc107' } }}>
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