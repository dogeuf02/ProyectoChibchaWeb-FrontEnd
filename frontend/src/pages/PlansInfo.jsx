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
import { getPlansInfo } from "../api/planApi";
import { useAuth } from "../context/AuthContext";
import { ROLE } from "../enum/roleEnum";

export default function PlansInfo() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showAlert } = useGlobalAlert();
  const { autenticated, role } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openBillingDialog, setOpenBillingDialog] = useState(false);
  const [billingCycle, setBillingCycle] = useState("");
  const [plans, setPlans] = useState([]);

  const planColors = {
    CHIBCHASILVER: "#C0C0C0",
    CHIBCHAGOLD: "#FFD700",
    CHIBCHAPLATINUM: "#CD7F32",
  };

  const handleGetPlan = (plan) => {
    if (autenticated || role !== ROLE.CLIENT) {
      showAlert(t('hosting.alerts.notClient'), "warning");
      return;
    }

    setSelectedPlan(plan);
    setOpenBillingDialog(true);
  };

  const handleConfirmPlan = () => {
    if (!selectedPlan || !billingCycle) return;

    const modalidadSeleccionada = selectedPlan.precios.find(
      (p) => p.planPago.idPlanPago === billingCycle
    );

    if (!modalidadSeleccionada) {
      showAlert(t('hosting.alerts.noBilling'), "error");
      return;
    }

    const checkoutData = {
      idPlanCliente: selectedPlan.planCliente.idPlanCliente,
      nombrePlanCliente: selectedPlan.planCliente.nombrePlanCliente,
      caracteristicas: {
        numeroWebs: selectedPlan.planCliente.numeroWebs,
        numeroBaseDatos: selectedPlan.planCliente.numeroBaseDatos,
        almacenamientoNvme: selectedPlan.planCliente.almacenamientoNvme,
        numeroCuentasCorreo: selectedPlan.planCliente.numeroCuentasCorreo,
        creadorWeb: selectedPlan.planCliente.creadorWeb,
        numeroCertificadoSslHttps:
          selectedPlan.planCliente.numeroCertificadoSslHttps,
        emailMarketing: selectedPlan.planCliente.emailMarketing,
      },
      modalidad: {
        idPlanPago: modalidadSeleccionada.planPago.idPlanPago,
        intervaloPago: modalidadSeleccionada.planPago.intervaloPago,
        precio: modalidadSeleccionada.precio,
      },
    };

    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    setOpenBillingDialog(false);
    navigate("/client/Checkout");
  };

  useEffect(() => {
    const fetchPlansInfo = async () => {
      const response = await getPlansInfo();
      if (response.exito) {
        const rawPlans = response.data;
        const groupedPlans = [];

        rawPlans.forEach((item) => {
          const existing = groupedPlans.find(
            (group) =>
              group.planCliente.idPlanCliente ===
              item.planCliente.idPlanCliente
          );

          if (!existing) {
            groupedPlans.push({
              planCliente: item.planCliente,
              precios: [
                {
                  planPago: item.planPago,
                  precio: item.precio,
                  id: item.id,
                },
              ],
            });
          } else {
            existing.precios.push({
              planPago: item.planPago,
              precio: item.precio,
              id: item.id,
            });
          }
        });

        setPlans(groupedPlans);
      } else {
        showAlert(t('hosting.alerts.errorLoading')

, "error");
      }
    };

    fetchPlansInfo();
  }, []);

  return (
    <Box id="Plans" sx={{ bgcolor: "#FAFAFA", py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ color: "#212121", fontWeight: "bold" }}
        >
          {t("hosting.sectionTitle")}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{ color: "#616161ff", mb: 4 }}
        >
          {t("hosting.subtitle")}
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {plans.length === 0 ? (
            <Typography
              variant="h5"
              align="center"
              sx={{ color: "black", fontWeight: "bold", mb: 2 }}
            >
              {t('hosting.emptyList')}
            </Typography>
          ) : (
            plans.map((plan, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    borderRadius: "20px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    bgcolor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    minHeight: 380, // 🔹 Mantiene altura uniforme
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 28px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <CardContent sx={{ px: 3, flexGrow: 1 }}>
                    <Typography
                      variant="h5"
                      align="center"
                      sx={{
                        color:
                          planColors[plan.planCliente.nombrePlanCliente] ||
                          "#333",
                        fontWeight: "bold",
                        mb: 2,
                      }}
                    >
                      {plan.planCliente.nombrePlanCliente}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ mb: 2 }}>
                      {["Mensual", "Semestral", "Anual"].map((period) => {
                        const p = plan.precios.find(
                          (precio) =>
                            precio.planPago.intervaloPago.toLowerCase() ===
                            period.toLowerCase()
                        );
                        return (
                          <Typography key={period} variant="body1">
                            <strong>
                              {t(
                                `hosting.planPeriodicity.${period.toLowerCase()}`
                              )}
                              :
                            </strong>{" "}
                            {p ? `$${p.precio}` : "—"}
                          </Typography>
                        );
                      })}
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ mb: 2, textAlign: "left", pl: 2 }}>
                      <Typography variant="body1">
                        <strong>• {plan.planCliente.numeroBaseDatos} </strong>
                        {t("hosting.hostingPlans.features.databases")}
                      </Typography>
                      <Typography variant="body1">
                        <strong>• {plan.planCliente.numeroWebs} </strong>
                        {t("hosting.hostingPlans.features.websites")}
                      </Typography>
                      <Typography variant="body1">
                        <strong>• {plan.planCliente.almacenamientoNvme} </strong>
                        {t("hosting.hostingPlans.features.storage")}
                      </Typography>
                      <Typography variant="body1">
                        <strong>• {plan.planCliente.numeroCuentasCorreo} </strong>
                        {t("hosting.hostingPlans.features.emailAccounts")}
                      </Typography>
                      {plan.planCliente.creadorWeb && (
                        <Typography variant="body1">
                          <strong>• </strong>
                          {t("hosting.hostingPlans.features.builder")}
                        </Typography>
                      )}
                      <Typography variant="body1">
                        <strong>• {plan.planCliente.numeroCertificadoSslHttps} </strong>
                        {t("hosting.hostingPlans.features.sslCertificates")}
                      </Typography>
                      {plan.planCliente.emailMarketing && (
                        <Typography variant="body1">
                          <strong>• </strong>
                          {t("hosting.hostingPlans.features.emailMarketing")}
                        </Typography>
                      )}
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
                          bgcolor: "#e25a00",
                        },
                      }}
                    >
                      {t("hosting.hostingButton")}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Dialog para seleccionar billing */}
        <Dialog
          open={openBillingDialog}
          onClose={() => setOpenBillingDialog(false)}
        >
          <DialogTitle>{t("hosting.dialog.title")}</DialogTitle>
          <DialogContent>
            {selectedPlan && (
              <>
                <Typography sx={{ mb: 2 }}>
                   {t("hosting.dialog.selectedPlan")}:{" "}
                  <strong>{selectedPlan.planCliente.nombrePlanCliente}</strong>
                </Typography>

                <TextField
                  select
                  fullWidth
                  label={t("hosting.dialog.billingCycle")}
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value)}
                  sx={{ mb: 2 }}
                >
                  {selectedPlan.precios.length > 0 ? (
                    selectedPlan.precios.map((opt) => (
                      <MenuItem
                        key={opt.planPago.idPlanPago}
                        value={opt.planPago.idPlanPago}
                      >
                        {t(
                          `hosting.planPeriodicity.${opt.planPago.intervaloPago.toLowerCase()}`
                        )}{" "}
                        — ${opt.precio}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      {t("hosting.dialog.noOptions")}
                    </MenuItem>
                  )}
                </TextField>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBillingDialog(false)}> {t("hosting.dialog.cancel")}</Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#FF6400",
                borderRadius: 30,
                "&:hover": { bgcolor: "#e25a00" },
              }}
              onClick={handleConfirmPlan}
              disabled={!billingCycle}
            >
              {t("hosting.dialog.confirm")}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
