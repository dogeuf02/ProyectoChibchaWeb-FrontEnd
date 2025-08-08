// src/pages/auth/RecoveryPage.jsx
import { useState, useRef } from 'react';
import {
  Container, TextField, Button, Typography, Paper, Box
} from '@mui/material';
import { useGlobalAlert } from "../../context/AlertContext";
import { useNavigate } from "react-router-dom";
import { useGlobalLoading } from "../../context/LoadingContext";
import { recoverPassword } from "../../api/authApi";
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from "react-i18next";

export default function RecoveryPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const { showAlert } = useGlobalAlert();
  const { showLoader, hideLoader } = useGlobalLoading();
  const recaptchaRef = useRef();
  const [captchaToken, setCaptchaToken] = useState(null);

  const navigate = useNavigate();

  const handleCaptchaChange = (value) => {
    setCaptchaToken(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      showAlert(t('recovery.alerts.completeCaptcha'), 'warning');
      recaptchaRef.current?.reset();
      return;
    }

    if (!email.trim()) {
      showAlert(t('recovery.alerts.emptyEmail'), "warning");
      return;
    }

    showLoader();
    const result = await recoverPassword(email, captchaToken);
    hideLoader();

    if (result.success) {
      showAlert(result.message, "success");
      setTimeout(() => navigate("/Login"), 1200);
    } else {
      showAlert(result.message, "error");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4, bgcolor: "#FAFAFA" }}>
        <Typography variant="h5" gutterBottom sx={{ color: "#212121" }}>
          {t('recovery.title')}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label={t('recovery.fields.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            sx={{
              '& label': { color: '#BDBDBD' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#BDBDBD' },
                '&:hover fieldset': { borderColor: '#FF6400' },
                '&.Mui-focused fieldset': { borderColor: '#FFBE02' },
              }
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              borderRadius: 30,
              bgcolor: "#FF6400",
              color: "#FAFAFA",
              '&:hover': { bgcolor: "#FFBE02", color: "#212121" }
            }}
          >
            {t('recovery.buttons.send')}
          </Button>
          <Box mt={3} display="flex" justifyContent="center">
            <ReCAPTCHA
              sitekey="6LePn5krAAAAAAnj4Tz_1s9K7dZEYLVsdUeFqwqB"
              onChange={handleCaptchaChange}
              ref={recaptchaRef}
            />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
