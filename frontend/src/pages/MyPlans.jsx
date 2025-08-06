import React, { useState } from "react";
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
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getPlansByClientId } from "../api/purchasedPlanApi";
import { getPlansInfo } from "../api/planApi";

// Planes base disponibles

export default function MyPlansPage() {
  useScrollToTop();
  const { showAlert } = useGlobalAlert();
  const { specificId } = useAuth();
  const [plans, setPlans] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const resAdquiridos = await getPlansByClientId(specificId); // array
        const resInfoPlanes = await getPlansInfo(); // { data: [...] }

        const acquiredPlans = Array.isArray(resAdquiridos) ? resAdquiridos : [];
        const infoPlans = Array.isArray(resInfoPlanes.data) ? resInfoPlanes.data : [];

        if (acquiredPlans.length === 0 || infoPlans.length === 0) {
          console.warn("Some plan data was missing", { acquiredPlans, infoPlans });
          showAlert("Could not load your plan details.", "warning");
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
              `${planInfo?.planCliente?.numeroWebs} websites`,
              `${planInfo?.planCliente?.numeroBaseDatos} databases`,
              `${planInfo?.planCliente?.almacenamientoNvme} GB NVMe SSD`,
              `${planInfo?.planCliente?.numeroCuentasCorreo} email accounts`,
              planInfo?.planCliente?.creadorWeb ? "Website builder" : null,
              `${planInfo?.planCliente?.numeroCertificadoSslHttps} SSL certificates`,
              planInfo?.planCliente?.emailMarketing ? "Email marketing" : null,
              `Status: ${p.estadoPlan}`,
              `Purchased: ${p.fechaCompra}`,
              `Expires: ${p.fechaExpiracion}`,
            ].filter(Boolean)

          };
        });

        setPlans(adapted);
      } catch (err) {
        console.error("❌ Error loading plan data:", err);
        showAlert("There was a problem loading your plans", "error");
      }
    };


    if (specificId) fetchPlans();
  }, [specificId]);



  const navigate = useNavigate(); // 👈 Hook para redirigir

  const handleRequestDelete = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    setPlans((prev) => prev.filter((plan) => plan.id !== selectedId));
    setOpenDialog(false);
    setSelectedId(null);
    showAlert("Plan deleted successfully", "success");
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
          My Plans
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/Plans")} // 👈 Redirige al hacer clic
          sx={{
            backgroundColor: "#FF6300",
            color: "#FAFAFA",
            borderRadius: 30,
            "&:hover": {
              backgroundColor: "#e65c00",
            },
          }}
        >
          Add Plan
        </Button>
      </Box>

      <PlanList plans={plans} onRequestDelete={handleRequestDelete} />

      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Cancel Plan"
        message="Are you sure you want to cancel this plan?"
        confirmText="Confirm Cancelation"
      />
    </Box>


  );
}
