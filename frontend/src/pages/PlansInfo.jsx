import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  List,
  ListItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGlobalAlert } from "../context/AlertContext";
import { useTranslation } from "react-i18next";
import { getPlans } from "../api/planApi"
import { useAuth } from "../context/AuthContext";
import { ROLE } from "../enum/roleEnum";
// Simulación de usuario
const mockUser = {
  isLoggedIn: true,       // Si está logIn
  role: "client",
  hasPaymentMethod: true  // Cambia a false para probar redirección
};

export default function PlansInfo() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showAlert } = useGlobalAlert();
  const { autenticated, role } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openBillingDialog, setOpenBillingDialog] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const plans = [
  //   {
  //     title: t('hosting.hostingPlans.silver.title'),
  //     color: "#C0C0C0",
  //     price: { monthly: 5, semiAnnual: 25, annual: 45 },
  //     features: [
  //       "2" + " " + t('hosting.hostingPlans.features.websites'),
  //       "20" + " " + t('hosting.hostingPlans.features.databases'),
  //       "20" + " " + t('hosting.hostingPlans.features.storage'),
  //       "20" + " " + t('hosting.hostingPlans.features.emailAccounts'),
  //       t('hosting.hostingPlans.features.builder'),
  //       "2" + " " + t('hosting.hostingPlans.features.sslCertificates'),
  //       t('hosting.hostingPlans.features.emailMarketing')
  //     ]
  //   },
  //   {
  //     title: t('hosting.hostingPlans.platinum.title'),
  //     color: "#CD7F32",
  //     price: { monthly: 8, semiAnnual: 40, annual: 72 },
  //     features: [
  //       "3" + " " + t('hosting.hostingPlans.features.websites'),
  //       "40" + " " + t('hosting.hostingPlans.features.databases'),
  //       "40" + " " + t('hosting.hostingPlans.features.storage'),
  //       "40" + " " + t('hosting.hostingPlans.features.emailAccounts'),
  //       t('hosting.hostingPlans.features.builder'),
  //       "3" + " " + t('hosting.hostingPlans.features.sslCertificates'),
  //       t('hosting.hostingPlans.features.emailMarketing')
  //     ]
  //   },
  //   {
  //     title: t('hosting.hostingPlans.gold.title'),
  //     color: "#FFD700",
  //     price: { monthly: 11, semiAnnual: 55, annual: 99 },
  //     features: [
  //       "5" + " " + t('hosting.hostingPlans.features.websites'),
  //       t('hosting.hostingPlans.features.unlimitedDatabases'),
  //       "60" + " " + t('hosting.hostingPlans.features.storage'),
  //       "60" + " " + t('hosting.hostingPlans.features.emailAccounts'),
  //       t('hosting.hostingPlans.features.builder'),
  //       "5" + " " + t('hosting.hostingPlans.features.sslCertificates'),
  //       t('hosting.hostingPlans.features.emailMarketing')
  //     ]
  //   }
  // ];

  const handleGetPlan = (plan) => {
    // Verificar login como cliente
    if (autenticated || role !== ROLE.CLIENT) {
      showAlert("You must log in as a client to get a plan.", "warning");
      return;
    }

    // Verificar método de pago
    if (!mockUser.hasPaymentMethod) {
      showAlert("Please register a payment method first.", "warning");
      navigate("/client/payments");
      return;
    }

    // Todo correcto → Abrir popup de selección de billing
    setSelectedPlan(plan);
    setOpenBillingDialog(true);
  };

  const handleConfirmPlan = () => {
    if (!selectedPlan) return;

    // Confirmación final
    const confirmed = window.confirm(
      `Are you sure you want to add ${selectedPlan.title} (${billingCycle}) to your plans?`
    );

    if (!confirmed) return;

    // Guardar plan simulado en localStorage
    const storedPlans = JSON.parse(localStorage.getItem("myPlans") || "[]");
    const newPlan = {
      id: `P${storedPlans.length + 1}`,
      type: selectedPlan.title,
      prices: selectedPlan.price,
      features: selectedPlan.features,
      billingCycle
    };

    localStorage.setItem("myPlans", JSON.stringify([...storedPlans, newPlan]));

    showAlert(`${selectedPlan.title} added to My Plans!`, "success");

    setOpenBillingDialog(false);
    navigate("/client/myplans");
  };

  useEffect(() => {
    const fetchPlans = async () => {
      const response = await getPlans();
      if (response.exito) {
        setPlans(response.data);
        console.log(response.data);
      } else {
        setError(response.mensaje || "Failed to load plans.");
      }
      setLoading(false);
    };
    fetchPlans();
  }, []);

  const features = {
    websites: t('hosting.hostingPlans.features.websites'),
    databases: t('hosting.hostingPlans.features.databases'),
    emailAccounts: t('hosting.hostingPlans.features.emailAccounts'),
    builder: t('hosting.hostingPlans.features.builder'),
    sslCertificates: t('hosting.hostingPlans.features.sslCertificates'),
    emailMarketing: t('hosting.hostingPlans.features.emailMarketing'),
    unlimitedDatabases: t('hosting.hostingPlans.features.unlimitedDatabases'),
    storage: t('hosting.hostingPlans.features.storage')
  }


  return (
    <Box id="Plans" sx={{ bgcolor: "#FAFAFA", py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ color: "#212121", fontWeight: "bold" }}
        >
          {t('hosting.sectionTitle')} </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{ color: "#616161ff", mb: 4 }}
        >
          {t('hosting.subtitle')} </Typography>

        <Grid container spacing={4} justifyContent="center">


          {
            plans.length === 0 ? (
              <Typography
                variant="h5"
                align="center"
                sx={{ color: "black", fontWeight: "bold", mb: 2 }}
              >
                No hay
              </Typography>
            ) : (
              plans.map((plan, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "30px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      bgcolor: "#fff",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 12px 32px rgba(0,0,0,0.15)"
                      }
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h5"
                        align="center"
                        sx={{ color: plan.color, fontWeight: "bold", mb: 2 }}
                      >
                        {plan.nombrePlanCliente}
                      </Typography>

                      <Divider sx={{ mb: 2 }} />

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body1">
                          <strong>{t('hosting.planPeriodicity.monthly')}:</strong> {/*plan.price.monthly*/} {t('util.dolarCoin')}
                        </Typography>
                        <Typography variant="body1">
                          <strong>{t('hosting.planPeriodicity.semiAnnual')}:</strong> {/*plan.price.semiAnnual*/} {t('util.dolarCoin')}
                        </Typography>
                        <Typography variant="body1">
                          <strong>{t('hosting.planPeriodicity.annual')}:</strong> {/*plan.price.annual*/} {t('util.dolarCoin')}
                        </Typography>
                      </Box>


                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body1">
                          <strong>• {plan.nombrePlanCliente} </strong>
                        </Typography>
                        <Typography variant="body1">
                          <strong>• {plan.numeroBaseDatos}: </strong>{t('hosting.hostingPlans.features.databases')}
                        </Typography>
                        <Typography variant="body1">
                          <strong>• {plan.numeroWebs}: </strong>{t('hosting.hostingPlans.features.websites')}
                        </Typography>
                        <Typography variant="body1">
                          <strong>• {plan.almacenamientoNvme}: </strong>{t('hosting.hostingPlans.features.storage')}
                        </Typography>
                        <Typography variant="body1">
                          <strong>• {plan.numeroCuentasCorreo}: </strong>{t('hosting.hostingPlans.features.emailAccounts')}
                        </Typography>
                        <Typography variant="body1">
                          <strong>{plan.creadorWeb && (
                            "•" + t('hosting.hostingPlans.features.builder')
                          )}:</strong>
                        </Typography>
                        <Typography variant="body1">
                          <strong>• {plan.numeroCertificadoSslHttps}: </strong>{t('hosting.hostingPlans.features.sslCertificates')}
                        </Typography>
                        <Typography variant="body1">
                          <strong>{plan.emailMarketing && (
                            "•" + t('hosting.hostingPlans.features.emailMarketing')
                          )}</strong>
                        </Typography>
                      </Box>
                      {/* <List dense>
                        {plan.features.map((feature, i) => (
                          <ListItem key={i} sx={{ py: 0.5 }}>
                            <Typography variant="body2" sx={{ color: "#212121" }}>
                              • {feature}
                            </Typography>
                          </ListItem>
                        ))}
                      </List> */}
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                      <Button
                        variant="contained"
                        size="medium"
                        onClick={() => handleGetPlan(plan)}
                        sx={{
                          bgcolor: "#FF6400",
                          borderRadius: "30px",
                          px: 4,
                          "&:hover": {
                            bgcolor: "#e25a00"
                          }
                        }}
                      >
                        {t('hosting.hostingButton')} </Button>
                    </CardActions>
                  </Card>
                </Grid>
              )))}
        </Grid>

        {/* Popup para seleccionar billing */}
        <Dialog
          open={openBillingDialog}
          onClose={() => setOpenBillingDialog(false)}
        >
          <DialogTitle>Select Billing Type</DialogTitle>
          <DialogContent>
            {selectedPlan && (
              <>
                <Typography sx={{ mb: 2 }}>
                  Selected Plan: <strong>{selectedPlan.title}</strong>
                </Typography>
                <TextField
                  select
                  fullWidth
                  label="Billing Cycle"
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value)}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="monthly">
                    Monthly - ${selectedPlan.price.monthly} US
                  </MenuItem>
                  <MenuItem value="semiAnnual">
                    Semi-Annual - ${selectedPlan.price.semiAnnual} US
                  </MenuItem>
                  <MenuItem value="annual">
                    Annual - ${selectedPlan.price.annual} US
                  </MenuItem>
                </TextField>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBillingDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "#FF6400", borderRadius: 30, "&:hover": { bgcolor: "#e25a00" } }}
              onClick={handleConfirmPlan}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
