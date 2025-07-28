import { useState } from 'react';
import {
  Container,
  TextField,
  Typography,
  Button,
  Paper,
  Box
} from '@mui/material';
import { useGlobalAlert } from '../context/AlertContext';
import Zoom from '@mui/material/Zoom';

export default function DomainRequest() {
  const { showAlert } = useGlobalAlert();
  const [formData, setFormData] = useState({
    domainName: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { domainName, description } = formData;

    if (!domainName.trim() || !description.trim()) {
      showAlert("Please fill in all fields", "warning");
      return;
    }

    // Simulación de envío
    console.log("Domain Request Sent:", formData);
    showAlert("Domain request submitted successfully!", "success");
    setFormData({ domainName: '', description: '' }); // limpia el formulario
  };

  return (
    <Zoom in timeout={600}>
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Domain Request
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Domain Name"
              name="domainName"
              value={formData.domainName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="example.com"
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              placeholder="Briefly describe why you need this domain..."
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                borderRadius: 30,
                bgcolor: '#ff6f00',
                '&:hover': { bgcolor: '#ffc107', color: '#212121' }
              }}
              fullWidth
            >
              Submit Request
            </Button>
          </Box>
        </Paper>
      </Container>
    </Zoom>
  );
}
