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
import { createDomain, getDomain } from '../api/domainApi';

export default function DomainRequest() {
  const { showAlert } = useGlobalAlert();
  const { role, specificId } = useAuth();

  const [tlds, setTlds] = useState([]);
  const [precioActual, setPrecioActual] = useState('');
  const [formData, setFormData] = useState({
    domainName: '',
    domainTld: ''
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

    const domainName = formData.domainName.trim().toLowerCase();
    const domainTld = formData.domainTld.trim();

    if (!domainName || !domainTld) {
      showAlert("Please fill in all fields", "warning");
      return;
    }

    try {
      // Intentar obtener el dominio desde el nuevo endpoint
      let domain = await getDomain(domainName, domainTld);

      if (!domain) {
        // Si no existe, lo creamos
        const newDomainPayload = {
          nombreDominio: domainName,
          tld: domainTld,
          precioDominio: precioActual, // asegúrate que este valor esté definido correctamente
          estado: "Reservado"
        };
        console.log("newdoamin", newDomainPayload);
        await createDomain(newDomainPayload);

        // Intentamos obtenerlo de nuevo con el mismo endpoint
        domain = await getDomain(domainName, domainTld);
        console.log("gettted", domain);
      }

      if (domain && domain.estado == "Reservado") {
        const todayDate = getTodayDate();
        const [client, distributor] = getCurrentUserId();

        const domainRequest = {
          dominio: domain.idDominio, // viene directamente del backend
          estadoSolicitud: "En Revision",
          tld: domainTld,
          fechaSolicitud: todayDate,
          cliente: client,
          distributor: distributor
        };
        console.log("dreqyes", domainRequest);
        const response = await createDomainRequest(domainRequest);

        if (response.exito) {
          showAlert("Domain request submitted successfully!", "success");
          setFormData({ domainName: '', domainTld: '', description: '' });
        } else {
          showAlert(response.message || "Failed to submit domain request", "error");
        }
      } else {
        showAlert("Domain is active and in use", "error");
      }

    } catch (error) {
      console.error("Error submitting domain request:", error);
      showAlert("Something went wrong", "error");
    }
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
