import { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Typography,
  Button,
  Paper,
  Box,
  MenuItem
} from '@mui/material';
import { useGlobalAlert } from '../context/AlertContext';
import Zoom from '@mui/material/Zoom';
import getTodayDate from '../utils/dateUtils';
import { createDomainRequest } from '../api/domainRequestApi';
import { useAuth } from '../context/AuthContext';
import { ROLE } from '../enum/roleEnum';
import { getTlds } from '../api/tldApi';
export default function DomainRequest() {
  const { showAlert } = useGlobalAlert();
  const { role, specificId } = useAuth();

  const [tlds, setTlds] = useState([]);
  const [precioActual, setPrecioActual] = useState('');
  const [formData, setFormData] = useState({
    domainName: '',
    domainTld: '',
    description: '',
  });

  const getCurrentUserId = () => {
    let clienId = null;
    let distributorId = null;

    switch (role) {
      case ROLE.CLIENT:
        clienId = specificId
        break;
      case ROLE.DISTRIBUTOR:
        distributorId = specificId
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



  useEffect(() => {
    const fetchTlds = async () => {
      try {
        const data = await getTlds();
        console.log("tlds", data)
        setTlds(data);
      } catch (error) {
        console.error('Error cargando los TLDs:', error);
      }
    };

    fetchTlds();
  }, []);

  useEffect(() => {
    const tldSeleccionado = tlds.find(tld => tld.tld === formData.domainTld);
    if (tldSeleccionado) {
      setPrecioActual(tldSeleccionado.precioTld);
    } else {
      setPrecioActual('');
    }
  }, [formData.domainTld, tlds]);

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
              placeholder="example"
            />

            <TextField
              select
              label="TLD"
              name="domainTld"
              value={formData.domainTld}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {tlds.map((tld) => (
                <MenuItem key={tld.tld} value={tld.tld}>
                  {tld.tld}
                </MenuItem>
              ))}
            </TextField>
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

            {/*Se muestra el dominio completo */}
            {/* <Typography
              variant="subtitle1"
              sx={{ mt: 2, mb: 1, fontWeight: 'bold', textAlign: 'center' }}
            >
              Full Domain: {formData.domainName || 'example'}
              {formData.domainTld || '.com'}
            </Typography> */}
            <Typography variant="h6">
              {formData.domainName && formData.domainTld ? (
                <>
                  Cost for <strong>{formData.domainName}{formData.domainTld}</strong>: ${precioActual}
                </>
              ) : (
                <>
                  Select a domain
                </>
              )}
            </Typography>



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
