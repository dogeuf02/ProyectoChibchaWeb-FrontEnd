import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ConfirmDialog from "../components/ConfirmDialog";
import PlanList from "../components/PlanList";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPlansByClientId } from "../api/purchasedPlanApi";
import { getPlansInfo } from "../api/planApi";
import { useTranslation } from "react-i18next";

export default function MyPlansPage() {
  useScrollToTop();
  const { showAlert } = useGlobalAlert();
  const { specificId } = useAuth();
  const { t } = useTranslation();
  const [plans, setPlans] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const resAdquiridos = await getPlansByClientId(specificId);
        const resInfoPlanes = await getPlansInfo();

        const acquiredPlans = Array.isArray(resAdquiridos) ? resAdquiridos : [];
        const infoPlans = Array.isArray(resInfoPlanes.data) ? resInfoPlanes.data : [];

        if (acquiredPlans.length === 0 || infoPlans.length === 0) {
          showAlert(t("myPlans.alerts.loadWarning"), "warning");
          return;
        }

        const adapted = acquiredPlans.map((p) => {
          const planInfo = infoPlans.find(
            (pi) =>
              pi.planCliente.idPlanCliente === p.planCliente &&
              pi.planPago.idPlanPago === p.planPago
          );

          const normalizeBilling = (interval) => {
            if (!interval) return "monthly";
            const clean = interval.toLowerCase();
            if (clean.includes("mensual")) return "monthly";
            if (clean.includes("semestral")) return "semiAnnual";
            if (clean.includes("anual")) return "annual";
            return "monthly";
          };

          const billing = normalizeBilling(planInfo?.planPago?.intervaloPago);

          return {
            id: p.idPlanAdquirido,
            type: planInfo?.planCliente?.nombrePlanCliente || "CUSTOM",
            billingCycle: billing,
            prices: {
              monthly: planInfo?.precio || parseFloat(p.precioPlanAdquirido),
              semiAnnual: planInfo?.precio || parseFloat(p.precioPlanAdquirido),
              annual: planInfo?.precio || parseFloat(p.precioPlanAdquirido),
            },
            features: [
              t("myPlans.features.websites", { count: planInfo?.planCliente?.numeroWebs }),
              t("myPlans.features.databases", { count: planInfo?.planCliente?.numeroBaseDatos }),
              t("myPlans.features.storage", { size: planInfo?.planCliente?.almacenamientoNvme }),
              t("myPlans.features.emails", { count: planInfo?.planCliente?.numeroCuentasCorreo }),
              planInfo?.planCliente?.creadorWeb ? t("myPlans.features.builder") : null,
              t("myPlans.features.ssl", { count: planInfo?.planCliente?.numeroCertificadoSslHttps }),
              planInfo?.planCliente?.emailMarketing ? t("myPlans.features.marketing") : null,
              t("myPlans.features.status", { status: p.estadoPlan }),
              t("myPlans.features.purchased", { date: p.fechaCompra }),
              t("myPlans.features.expires", { date: p.fechaExpiracion }),
            ].filter(Boolean)
          };
        });

        setPlans(adapted);
      } catch (err) {
        showAlert(t("myPlans.alerts.loadError"), "error");
      }
    };

    if (specificId) fetchPlans();
  }, [specificId]);

  const handleRequestDelete = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    setPlans((prev) => prev.filter((plan) => plan.id !== selectedId));
    setOpenDialog(false);
    setSelectedId(null);
    showAlert(t("myPlans.alerts.deleteSuccess"), "success");
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 10 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 6,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212121" }}>
          {t("myPlans.title")}
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/Plans")}
          sx={{
            backgroundColor: "#FF6300",
            color: "#FAFAFA",
            borderRadius: 30,
            "&:hover": {
              backgroundColor: "#e65c00",
            },
          }}
        >
          {t("myPlans.addButton")}
        </Button>
      </Box>

      <PlanList plans={plans} onRequestDelete={handleRequestDelete} />

      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title={t("myPlans.dialog.title")}
        message={t("myPlans.dialog.message")}
        confirmText={t("myPlans.dialog.confirm")}
      />
    </Box>
  );
}
