import { useState } from 'react';
import {
  Container, TextField, Button, Typography, Paper, Box
} from '@mui/material';
import { useGlobalAlert } from "../../context/AlertContext";
import axios from 'axios';

export default function RecoveryPage() {
  const [email, setEmail] = useState('');
  const { showAlert } = useGlobalAlert();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showAlert("Please enter your email.", "warning");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/auth/forgot-password", { email });
      showAlert("Recovery email sent! Check your inbox.", "success");
    } catch (err) {
      showAlert(err?.response?.data?.message || "Error sending recovery email.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4, bgcolor: '#fafafa' }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#212121' }}>
          Password Recovery
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, borderRadius: 30, bgcolor: '#FF6400', color: '#FAFAFA' }}
            disabled={loading}
          >
            Send Recovery Email
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
