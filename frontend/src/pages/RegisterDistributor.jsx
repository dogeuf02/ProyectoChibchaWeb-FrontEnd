// src/pages/RegisterDistributor.jsx
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
import { useGlobalLoading } from '../context/LoadingContext';
import { useTranslation } from 'react-i18next';

export default function RegisterDistributor() {
  useScrollToTop();

  const { t } = useTranslation();
  const { showLoader, hideLoader } = useGlobalLoading();
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
      showAlert(t("registerDistributor.alerts.captchaRequired"), 'warning');
      return;
    }

    if (form.password !== form.confirmPassword) {
      showAlert(t("registerDistributor.alerts.passwordMismatch"), 'warning');
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
      email: t("registerDistributor.fields.email"),
      password: t("registerDistributor.fields.password"),
      confirmPassword: t("registerDistributor.fields.confirmPassword"),
      documentType: t("registerDistributor.fields.documentType"),
      companyNumber: t("registerDistributor.fields.companyNumber"),
      companyName: t("registerDistributor.fields.companyName"),
      companyAddress: t("registerDistributor.fields.companyAddress"),
    };

    for (const field of requiredFields) {
      if (!form[field]) {
        showAlert(t("registerDistributor.alerts.requiredField", { field: friendlyNames[field] }), 'warning');
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
      showLoader();
      const result = await createDistributor(distributor);
      if (result.exito) {
        showAlert(t("registerDistributor.alerts.success"), 'success');
        setForm({
          email: '',
          password: '',
          confirmPassword: '',
          companyNumber: '',
          companyAddress: '',
          documentType: documentTypes[0]?.nombreTipoDoc || '',
          companyName: '',
        });
      } else {
        showAlert(result.mensaje || t("registerDistributor.alerts.error"), 'error');
      }
    } catch (err) {
      showAlert(t("registerDistributor.alerts.unexpectedError"), 'error');
    } finally {
      hideLoader();
    }
    setCaptchaToken(null);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 6 }}>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="center" gap={6} px={4}>
        <Zoom in={true} timeout={800}>
          <Paper elevation={3} sx={{ p: 4, bgcolor: '#fafafa', flex: 1 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#212121' }}>
              {t("registerDistributor.title")}
            </Typography>
            <Box component="form" noValidate>
              <TextField label={t("registerDistributor.fields.email")} name="email" type="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required />
              <TextField label={t("registerDistributor.fields.password")} name="password" type="password" value={form.password} onChange={handleChange} fullWidth margin="normal" required />
              <TextField label={t("registerDistributor.fields.confirmPassword")} name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} fullWidth margin="normal" required />
            </Box>
          </Paper>
        </Zoom>

        <Zoom in={true} timeout={1500}>
          <Paper elevation={3} sx={{ p: 4, bgcolor: '#f5f5f5', flex: 1 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#212121' }}>
              {t("registerDistributor.companyInfo")}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField select label={t("registerDistributor.fields.documentType")} name="documentType" value={form.documentType || ''} onChange={handleChange} fullWidth margin="normal">
                {documentTypes.map((type) => (
                  <MenuItem key={type.nombreTipoDoc} value={type.nombreTipoDoc}>
                    {type.nombreTipoDoc}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label={t("registerDistributor.fields.companyNumber")} name="companyNumber" value={form.companyNumber} onChange={handleChange} fullWidth margin="normal" />
              <TextField label={t("registerDistributor.fields.companyName")} name="companyName" value={form.companyName} onChange={handleChange} fullWidth margin="normal" />
              <TextField label={t("registerDistributor.fields.companyAddress")} name="companyAddress" value={form.companyAddress} onChange={handleChange} fullWidth margin="normal" />

              <Box mt={3} display="flex" justifyContent="center">
                <ReCAPTCHA sitekey="6LePn5krAAAAAAnj4Tz_1s9K7dZEYLVsdUeFqwqB" onChange={handleCaptchaChange} />
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
                }}>
                {t("registerDistributor.send")}
              </Button>

              <Typography variant="body2" sx={{ mt: 2 }}>
                {t("registerDistributor.loginPrompt")}{" "}
                <Link href="/login" underline="hover" color='#ff6f00'>
                  {t("registerDistributor.signIn")}
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Zoom>
      </Box>
    </Container>
  );
}
