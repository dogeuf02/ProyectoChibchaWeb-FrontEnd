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
import getTodayDate from '../utils/dateUtils';
import { createDomainRequest } from '../api/domainRequestApi';
import { AuthProvider } from '../context/AuthContext';
export default function DomainRequest() {
  const { showAlert } = useGlobalAlert();
  const [formData, setFormData] = useState({
    domainName: '',
    domainTld: '',
    description: '',
  });

  const getCurrentUserId = () => {
    const { role } = AuthProvider();
    let clienId = null;
    let distributorId = null;

    switch (role) {
      case "Cliente":
        clienId = localStorage.getItem("roleId")
        break;
      case "Distribuidor":
        distributorId = localStorage.getItem("roleId")
    }
    return [clienId, distributorId];
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { domainName, domainTld, description } = formData;

    if (!domainName.trim() || !domainTld.trim() || !description.trim()) {
      showAlert("Please fill in all fields", "warning");
      return;
    }
    const todayDate = getTodayDate();
    const [client, distributor] = getCurrentUserId();
    const domainRequest = {
      nombreDominio: domainName,
      estadoSolicitud: "En Revision",
      tld: domainTld,
      fechaSolicitud: todayDate,
      cliente: client,
      distributor: distributor
    }

    console.log(domainRequest)

    try {
      const response = await createDomainRequest(domainRequest);
      if (response.exito) {
        showAlert(response.message, "success")
      } else {
        showAlert(response.message, "error")

      }
    } catch (error) {
      if (error.response) {
        console.log(error.response)
      }
    }

    showAlert("Domain request submitted successfully!", "success");
    setFormData({ domainName: '', domainTld: '', description: '' }); // limpia el formulario
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
              label="TLD"
              name="domainTld"
              value={formData.domainTld}
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
