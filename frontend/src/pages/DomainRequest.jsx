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
import { useTranslation } from 'react-i18next';

export default function DomainRequest() {
  const { t } = useTranslation();
  const [domainRequests, setDomainRequests] = useState([]);
  const { showAlert } = useGlobalAlert();
  const { role, specificId } = useAuth();

  const [tlds, setTlds] = useState([]);
  const [precioActual, setPrecioActual] = useState('');
  const [formData, setFormData] = useState({ domainName: '', domainTld: '' });

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
      const solicitudesFiltradas = result.data.filter(
        (solicitud) => solicitud.idUsuario === specificId
      );
      setDomainRequests(solicitudesFiltradas);
    } else {
      showAlert(result.mensaje, "error");
    }
  };

  useEffect(() => {
    if (specificId) fetchDomainRequests();
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
      showAlert(t("domainRequest.alerts.fillFields"), "warning");
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
          showAlert(t("domainRequest.alerts.requestSuccess"), "success");
          await fetchDomainRequests();
          setFormData({ domainName: '', domainTld: '' });
          setOpenDialog(false);
        } else {
          showAlert(response.message || t("domainRequest.alerts.requestFail"), "error");
        }
      } else {
        showAlert(t("domainRequest.alerts.domainActive"), "error");
      }
    } catch (error) {
      showAlert(t("domainRequest.alerts.generalError"), "error");
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212121" }}>
            {t("domainRequest.title")}
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
            {t("domainRequest.addRequest")}
          </Button>
        </Box>

        {domainRequests.length === 0 ? (
          <Paper sx={{ p: 5, textAlign: "center", bgcolor: "#FAFAFA" }} elevation={2}>
            <Typography variant="h6" color="text.secondary">
              {t("domainRequest.empty.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t("domainRequest.empty.subtitle")}
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#fff3e0" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>{t("domainRequest.table.domainName")}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>{t("domainRequest.table.tld")}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>{t("domainRequest.table.status")}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>{t("domainRequest.table.requestDate")}</TableCell>
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

        {/* Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t("domainRequest.dialog.title")}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                label={t("domainRequest.dialog.domainName")}
                name="domainName"
                value={formData.domainName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                placeholder="example"
              />
              <TextField
                select
                label={t("domainRequest.dialog.tld")}
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
                {formData.domainName && formData.domainTld
                  ? t("domainRequest.dialog.cost", { domain: `${formData.domainName}${formData.domainTld}`, price: precioActual })
                  : t("domainRequest.dialog.selectDomain")}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: 30 }}>
              {t("domainRequest.dialog.cancel")}
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
              {t("domainRequest.dialog.submit")}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Zoom>
  );
}
