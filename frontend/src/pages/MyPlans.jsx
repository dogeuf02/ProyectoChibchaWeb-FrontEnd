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

const billingOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "semiAnnual", label: "Semi-Annual" },
  { value: "annual", label: "Annual" },
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
  const [openForm, setOpenForm] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState("");
  const [selectedBillingCycle, setSelectedBillingCycle] = useState("monthly");

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

  const handleAddPlan = () => {
    const planData = availablePlans.find((p) => p.type === selectedPlanType);
    if (!planData) {
      showAlert("Please select a plan type", "warning");
      return;
    }

    const newId = `P${plans.length + 1}`;
    setPlans((prev) => [
      ...prev,
      { ...planData, billingCycle: selectedBillingCycle, id: newId },
    ]);

    setSelectedPlanType("");
    setSelectedBillingCycle("monthly");
    setOpenForm(false);
    showAlert("Plan added successfully", "success");
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
          onClick={() => setOpenForm(true)}
          sx={{
            backgroundColor: "#FF6300",
            color: "#FAFAFA",
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

      {/* Dialogo para agregar plan */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth>
        <DialogTitle>Add New Plan</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              select
              label="Plan Type"
              value={selectedPlanType}
              onChange={(e) => setSelectedPlanType(e.target.value)}
              fullWidth
            >
              {availablePlans.map((plan) => (
                <MenuItem key={plan.type} value={plan.type}>
                  {plan.type}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Billing Cycle"
              value={selectedBillingCycle}
              onChange={(e) => setSelectedBillingCycle(e.target.value)}
              fullWidth
            >
              {billingOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} sx={{ color: "#212121" }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddPlan}
            variant="contained"
            sx={{
              backgroundColor: "#FF6300",
              color: "#FAFAFA",
              "&:hover": { backgroundColor: "#e65c00" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
