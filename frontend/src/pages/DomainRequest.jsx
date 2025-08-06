import { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Typography,
  Button,
  Paper,
  Box,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import Zoom from '@mui/material/Zoom';
import { useGlobalAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';
import { ROLE } from '../enum/roleEnum';
import getTodayDate from '../utils/dateUtils';
import { getTlds } from '../api/tldApi';
import { createDomain, getDomain } from '../api/domainApi';
import { createDomainRequest, getDomainRequests } from '../api/domainRequestApi';

export default function DomainRequest() {
  // Lista de solicitudes de dominio ejemplo
  const [domainRequests, setDomainRequests] = useState([
    {
      id: 1,
      name: "mybusiness",
      tld: ".com",
      status: "En Revision",
      date: "2025-08-01"
    },
    {
      id: 2,
      name: "coolproject",
      tld: ".dev",
      status: "Aprobado",
      date: "2025-07-28"
    },
    {
      id: 3,
      name: "storechibcha",
      tld: ".store",
      status: "Rechazado",
      date: "2025-07-15"
    }
  ]);

  const { showAlert } = useGlobalAlert();
  const { role, specificId } = useAuth();

  const [tlds, setTlds] = useState([]);
  const [precioActual, setPrecioActual] = useState('');
  const [formData, setFormData] = useState({ domainName: '', domainTld: '' });

  //const [domainRequests, setDomainRequests] = useState([]); // Lista de solicitudes
  const [openDialog, setOpenDialog] = useState(false);

  const getCurrentUserId = () => {
    let clientId = null;
    let distributorId = null;
    switch (role) {
      case ROLE.CLIENT:
        clientId = specificId;
        break;
      case ROLE.DISTRIBUTOR:
        distributorId = specificId;
        break;
    }
    return [clientId, distributorId];
  };

  const fetchDomainRequests = async () => {
    const result = await getDomainRequests();
    if (result.exito) {
      console.log("specificId vs usuarioiD", specificId, result.data[0].idUsuario)
      const solicitudesFiltradas = result.data.filter(
        (solicitud) => solicitud.idUsuario === specificId
      );
      console.log("res", solicitudesFiltradas);

      setDomainRequests(solicitudesFiltradas);
    }
    else {
      showAlert(result.mensaje, "error");
    }
  }
  useEffect(() => {
    if (specificId) {

      fetchDomainRequests();
      console.log("specificId vs usuarioiD", specificId, domainRequests[0].idUsuario)

    }
  }, [specificId]);



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
      let domain = await getDomain(domainName, domainTld);

      if (!domain) {
        const newDomainPayload = {
          nombreDominio: domainName,
          tld: domainTld,
          precioDominio: precioActual,
          estado: "Reservado"
        };
        await createDomain(newDomainPayload);
        domain = await getDomain(domainName, domainTld);
      }

      if (domain && domain.estado === "Reservado") {
        const todayDate = getTodayDate();
        const [client, distributor] = getCurrentUserId();

        const domainRequest = {
          dominio: domain.idDominio,
          estadoSolicitud: "En Revision",
          tld: domainTld,
          fechaSolicitud: todayDate,
          cliente: client,
          distributor: distributor
        };

        const response = await createDomainRequest(domainRequest);

        if (response.exito) {
          showAlert("Domain request submitted successfully!", "success");
          // setDomainRequests(prev => [...prev, {
          //   id: Date.now(),
          //   name: domainName,
          //   tld: domainTld,
          //   status: "En Revision",
          //   date: todayDate
          // }]);
          await fetchDomainRequests();
          setFormData({ domainName: '', domainTld: '' });
          setOpenDialog(false);

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
        setTlds(data);
      } catch (error) {
        console.error('Error cargando los TLDs:', error);
      }
    };
    fetchTlds();
  }, []);

  useEffect(() => {
    const tldSeleccionado = tlds.find(tld => tld.tld === formData.domainTld);
    setPrecioActual(tldSeleccionado ? tldSeleccionado.precioTld : '');
  }, [formData.domainTld, tlds]);

  return (
    <Zoom in timeout={600}>
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212121" }}>
            Domain Requests
          </Typography>
          <Button
            variant="contained"
            sx={{
              borderRadius: 30,
              bgcolor: "#ff6f00",
              "&:hover": { bgcolor: "#ffc107", color: "#212121" }
            }}
            onClick={() => setOpenDialog(true)}
          >
            Add Request
          </Button>
        </Box>

        {domainRequests.length === 0 ? (
          <Paper sx={{ p: 5, textAlign: "center", bgcolor: "#FAFAFA" }} elevation={2}>
            <Typography variant="h6" color="text.secondary">
              You haven't created any domain requests yet.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Click the button above to submit your first request.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#fff3e0" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Domain Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>TLD</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Request Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {domainRequests.map((req) => (
                  <TableRow key={req.idSolicitud}>
                    <TableCell>{req.dominio?.nombreDominio || "-"}</TableCell>
                    <TableCell>{req.dominio?.tld || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={req.estado}
                        color={
                          req.estado === "En Revision"
                            ? "warning"
                            : req.estado === "Aprobada"
                              ? "success"
                              : "default"
                        }
                      />
                    </TableCell>
                    <TableCell>{req.fechaCreacion}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Dialog para crear request */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>New Domain Request</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
              <Typography variant="body1" sx={{ mt: 2 }}>
                {formData.domainName && formData.domainTld ? (
                  <>
                    Cost for <strong>{formData.domainName}{formData.domainTld}</strong>: ${precioActual}
                  </>
                ) : (
                  <>Select a domain to see its cost</>
                )}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: 30 }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit}
              sx={{
                borderRadius: 30,
                bgcolor: "#ff6f00",
                "&:hover": { bgcolor: "#ffc107", color: "#212121" }
              }}
            >
              Submit Request
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Zoom>
  );
}
