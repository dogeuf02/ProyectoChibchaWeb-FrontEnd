import { useState } from 'react';
import {
  Container, TextField, Button, Typography, Paper, Box
} from '@mui/material';
import { useGlobalAlert } from "../../context/AlertContext";
import { useNavigate } from "react-router-dom";
import { useGlobalLoading } from "../../context/LoadingContext";
import { recoverPassword } from "../../api/authApi";

export default function RecoveryPage() {
  const [email, setEmail] = useState("");
  const { showAlert } = useGlobalAlert();
  const { showLoader, hideLoader } = useGlobalLoading();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      showAlert("Please enter your email.", "warning");
      return;
    }

    showLoader(); 

    const result = await recoverPassword(email);

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
          Password Recovery
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
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
            Send Recovery Email
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
