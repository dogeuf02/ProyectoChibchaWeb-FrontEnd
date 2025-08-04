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
import { hasPayMethods } from "../api/payMethodApi";
import { getPayBillings } from "../api/payBillingApi";
import { getPlanPrices } from "../api/planPriceApi";

export default function PlansInfo() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showAlert } = useGlobalAlert();
  const { autenticated, role, specificId } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openBillingDialog, setOpenBillingDialog] = useState(false);
  const [billingCycles, setBillingCycles] = useState([]);
  const [billingCycle, setBillingCycle] = useState("");
  const [plans, setPlans] = useState([]);
  const [hasPayMethod, setHasPayMethod] = useState(false);
  const [planPrices, setPlanPrices] = useState([]);

  const planColors = {
    CHIBCHASILVER: "#C0C0C0",
    CHIBCHAGOLD: "#FFD700",
    CHIBCHAPLATINUM: "#CD7F32"
  };


  const handleGetPlan = (plan) => {
    // Verificar login como cliente
    if (autenticated || role !== ROLE.CLIENT) {
      showAlert("You must log in as a client to get a plan.", "warning");
      return;
    }

    // Verificar método de pago
    if (!hasPayMethod) {
      showAlert("Please register a payment method first.", "warning");
      navigate("/client/PaymentManagement");
      return;
    }
    console.log("selected plan", plan);
    // Todo correcto → Abrir popup de selección de billing
    setSelectedPlan(plan);
    setOpenBillingDialog(true);
  };

  const handleConfirmPlan = () => {
    if (!selectedPlan || !billingCycle) return;

    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    setOpenBillingDialog(false);
    navigate('/client/Checkout');

  };

  const checkoutData = planPrices
    .filter((pp) => pp.planCliente === selectedPlan?.idPlanCliente)
    .map((pp) => {
      const cycle = billingCycles.find((bc) => bc.idPlanPago === pp.planPago);

      return {
        plan: pp,
        intervaloPago: cycle?.intervaloPago,
        planPrice: pp      // objeto completo del planPrecio
      };
    });

  const billingOptions = planPrices
    .filter((pp) => pp.planCliente === selectedPlan?.idPlanCliente)
    .map((pp) => {
      const cycle = billingCycles.find((bc) => bc.idPlanPago === pp.planPago);
      console.log("PlanPrice:", pp, "Matched Cycle:", cycle);
      return {
        value: pp.planPago,
        label: `${cycle?.intervaloPago} - $${pp.precio} USD`
      };
    });

  useEffect(() => {
    const fetchPlans = async () => {
      const response = await getPlans();
      if (response.exito) {
        setPlans(response.data);
        console.log(response.data);
      } else {
        showAlert("Error loading plans", "error");
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    const fetchBillingCycles = async () => {
      const response = await getPayBillings();
      if (response.exito) {
        setBillingCycles(response.data);
        console.log("BC:", response.data)
      } else {
        showAlert("Error loading billing cycles", "error")
      }
    }
    fetchBillingCycles();
  }, [])

  useEffect(() => {
    const fetchPlanPrices = async () => {
      const response = await getPlanPrices();
      if (response.exito && Array.isArray(response.data)) {
        setPlanPrices(response.data);
        console.log("Precios de planes:", response.data);
      } else {
        showAlert("Error al cargar precios de planes", "error");
      }
    };

    fetchPlanPrices();
  }, []);

  useEffect(() => {
    if (!specificId) return; // evita ejecutar si aún no hay ID válido

    const checkHasPayMethods = async () => {
      const hasMethods = await hasPayMethods("cliente", specificId);
      setHasPayMethod(hasMethods);
    };

    checkHasPayMethods();
  }, [specificId]); // depende de specificId

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
                        sx={{ color: planColors[plan.nombrePlanCliente] || "#333", fontWeight: "bold", mb: 2 }}
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
                      <Box sx={{ mb: 2, textAlign: 'left', pl: 2 }}>
                        <Typography variant="body1">
                          <strong>• {plan.numeroBaseDatos} </strong>{t('hosting.hostingPlans.features.databases')}
                        </Typography>
                        <Typography variant="body1">
                          <strong>• {plan.numeroWebs} </strong>{t('hosting.hostingPlans.features.websites')}
                        </Typography>
                        <Typography variant="body1">
                          <strong>• {plan.almacenamientoNvme} </strong>{t('hosting.hostingPlans.features.storage')}
                        </Typography>
                        <Typography variant="body1">
                          <strong>• {plan.numeroCuentasCorreo} </strong>{t('hosting.hostingPlans.features.emailAccounts')}
                        </Typography>
                        <Typography variant="body1">
                          <strong>{plan.creadorWeb && (
                            "• " + t('hosting.hostingPlans.features.builder')
                          )}</strong>
                        </Typography>
                        <Typography variant="body1">
                          <strong>• {plan.numeroCertificadoSslHttps} </strong>{t('hosting.hostingPlans.features.sslCertificates')}
                        </Typography>
                        <Typography variant="body1">
                          <strong>{plan.emailMarketing && (
                            "• " + t('hosting.hostingPlans.features.emailMarketing')
                          )}</strong>
                        </Typography>
                      </Box>
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
                  Selected Plan: <strong>{selectedPlan.nombrePlanCliente}</strong>
                </Typography>
                <TextField
                  select
                  fullWidth
                  label="Billing Cycle"
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value)}
                  sx={{ mb: 2 }}
                >
                  {billingOptions.length > 0 ? (

                    billingOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))

                  ) : (
                    <MenuItem disabled value="">
                      No billing options available
                    </MenuItem>
                  )}
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
