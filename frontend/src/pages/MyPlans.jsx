import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ConfirmDialog from "../components/ConfirmDialog";
import PlanList from "../components/PlanList";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";
import { useNavigate } from "react-router-dom"; // 👈 Import para navegación

// Planes base disponibles
const availablePlans = [
  {
    type: "CHIBCHAPLATA",
    prices: { monthly: 5, semiAnnual: 25, annual: 45 },
    features: [
      "2 websites",
      "20 databases",
      "20 GB NVMe SSD storage",
      "20 email accounts",
      "Website builder",
      "2 SSL certificates, https",
      "Email Marketing",
    ],
  },
  {
    type: "CHIBCHAPLATINO",
    prices: { monthly: 8, semiAnnual: 40, annual: 72 },
    features: [
      "3 websites",
      "40 databases",
      "40 GB NVMe SSD storage",
      "40 email accounts",
      "Website builder",
      "3 SSL certificates, https",
      "Email Marketing",
    ],
  },
  {
    type: "CHIBCHAORO",
    prices: { monthly: 11, semiAnnual: 55, annual: 99 },
    features: [
      "5 websites",
      "Unlimited databases",
      "60 GB NVMe SSD storage",
      "60 email accounts",
      "Website builder",
      "5 SSL certificates, https",
      "Email Marketing",
    ],
  },
];

export default function MyPlansPage() {
  useScrollToTop();
  const { showAlert } = useGlobalAlert();
  const [plans, setPlans] = useState([
    { id: "P1", ...availablePlans[0], billingCycle: "monthly" },
    { id: "P2", ...availablePlans[2], billingCycle: "annual" },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

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
        title="Delete Plan"
        message="Are you sure you want to delete this plan?"
        confirmText="Confirm Delete"
      />
    </Box>
  );
}
