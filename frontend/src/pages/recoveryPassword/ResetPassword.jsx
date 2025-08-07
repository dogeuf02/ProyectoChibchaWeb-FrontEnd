import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container, TextField, Button, Typography, Paper, Box
} from '@mui/material';
import { useGlobalAlert } from "../../context/AlertContext";
import axios from 'axios';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState('');
  const { showAlert } = useGlobalAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !password) {
      showAlert("Invalid request.", "warning");
      return;
    }

    try {
      await axios.post("/api/auth/reset-password", { token, password });
      showAlert("Password updated successfully!", "success");
    } catch (err) {
      showAlert(err?.response?.data?.message || "Error updating password.", "error");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4, bgcolor: '#fafafa' }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#212121' }}>
          Reset Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, borderRadius: 30, bgcolor: '#FF6400', color: '#FAFAFA' }}
          >
            Update Password
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
