import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PlansAdminList from "../components/PlanManageList";
import { useGlobalAlert } from "../context/AlertContext";

export default function PlansAdminPage() {
  const { showAlert } = useGlobalAlert();

  const [plans, setPlans] = useState([
    {
      id: "1",
      name: "Plan Plata",
      monthly: 5,
      semiAnnual: 25,
      annual: 45,
      webs: 2,
      databases: 20,
      storage: "20 GB",
      emails: 20,
      webBuilder: true,
      ssl: 2,
      emailMarketing: true
    },
    {
      id: "2",
      name: "Plan Platino",
      monthly: 8,
      semiAnnual: 40,
      annual: 72,
      webs: 3,
      databases: 40,
      storage: "40 GB",
      emails: 40,
      webBuilder: true,
      ssl: 3,
      emailMarketing: true
    },
    {
      id: "3",
      name: "Plan Oro",
      monthly: 11,
      semiAnnual: 55,
      annual: 99,
      webs: 5,
      databases: "Ilimitadas",
      storage: "60 GB",
      emails: 60,
      webBuilder: true,
      ssl: 5,
      emailMarketing: true
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const handleOpenDialog = (plan = null) => {
    setEditingPlan(
      plan || {
        id: Date.now().toString(),
        name: "",
        monthly: "",
        semiAnnual: "",
        annual: "",
        webs: "",
        databases: "",
        storage: "",
        emails: "",
        webBuilder: false,
        ssl: "",
        emailMarketing: false
      }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPlan(null);
  };

  const handleChange = (field, value) => {
    setEditingPlan((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePlan = () => {
    setPlans((prev) => {
      const exists = prev.find((p) => p.id === editingPlan.id);
      if (exists) {
        return prev.map((p) => (p.id === editingPlan.id ? editingPlan : p));
      } else {
        return [...prev, editingPlan];
      }
    });
    showAlert(editingPlan ? "Plan saved successfully!" : "Plan added!", "success");
    handleCloseDialog();
  };

  const handleDeletePlan = (id) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
    showAlert("Plan deleted successfully", "info");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            m: 6,
        }}
        >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Manage Hosting Plans
        </Typography>

        <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 30, bgcolor: "#FF6400", "&:hover": { bgcolor: "#FFBE02" } }}
        >
            Add Plan
        </Button>
        </Box>

      <PlansAdminList
        plans={plans}
        onEditPlan={handleOpenDialog}
        onDeletePlan={handleDeletePlan}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingPlan?.id && plans.some(p=>p.id===editingPlan.id) ? "Edit Plan" : "Add Plan"}</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Plan Name"
            fullWidth
            margin="dense"
            value={editingPlan?.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <TextField
            label="Monthly Price (US)"
            fullWidth
            margin="dense"
            type="number"
            value={editingPlan?.monthly || ""}
            onChange={(e) => handleChange("monthly", e.target.value)}
          />
          <TextField
            label="Semi-Annual Price (US)"
            fullWidth
            margin="dense"
            type="number"
            value={editingPlan?.semiAnnual || ""}
            onChange={(e) => handleChange("semiAnnual", e.target.value)}
          />
          <TextField
            label="Annual Price (US)"
            fullWidth
            margin="dense"
            type="number"
            value={editingPlan?.annual || ""}
            onChange={(e) => handleChange("annual", e.target.value)}
          />
          <TextField
            label="Number of Websites"
            fullWidth
            margin="dense"
            value={editingPlan?.webs || ""}
            onChange={(e) => handleChange("webs", e.target.value)}
          />
          <TextField
            label="Databases"
            fullWidth
            margin="dense"
            value={editingPlan?.databases || ""}
            onChange={(e) => handleChange("databases", e.target.value)}
          />
          <TextField
            label="Storage (NVMe SSD)"
            fullWidth
            margin="dense"
            value={editingPlan?.storage || ""}
            onChange={(e) => handleChange("storage", e.target.value)}
          />
          <TextField
            label="Email Accounts"
            fullWidth
            margin="dense"
            value={editingPlan?.emails || ""}
            onChange={(e) => handleChange("emails", e.target.value)}
          />
          <TextField
            label="SSL Certificates"
            fullWidth
            margin="dense"
            value={editingPlan?.ssl || ""}
            onChange={(e) => handleChange("ssl", e.target.value)}
          />
          <FormControlLabel
            control={
              <Switch
                checked={editingPlan?.webBuilder || false}
                onChange={(e) => handleChange("webBuilder", e.target.checked)}
              />
            }
            label="Web Builder"
          />
          <FormControlLabel
            control={
              <Switch
                checked={editingPlan?.emailMarketing || false}
                onChange={(e) => handleChange("emailMarketing", e.target.checked)}
              />
            }
            label="Email Marketing"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSavePlan} sx={{ bgcolor: "#FF6400" }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
