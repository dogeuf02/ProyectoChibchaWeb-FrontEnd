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
import { useTranslation } from "react-i18next";

export default function PlansAdminPage() {
  const { showAlert } = useGlobalAlert();
  const { t } = useTranslation();

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
        showAlert(t("plansManagement.alerts.saved"), "success");
        return prev.map((p) => (p.id === editingPlan.id ? editingPlan : p));
      } else {
        showAlert(t("plansManagement.alerts.added"), "success");
        return [...prev, editingPlan];
      }
    });
    handleCloseDialog();
  };

  const handleDeletePlan = (id) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
    showAlert(t("plansManagement.alerts.deleted"), "info");
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
          {t("plansManagement.title")}
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 30, bgcolor: "#FF6400", "&:hover": { bgcolor: "#FFBE02" } }}
        >
          {t("plansManagement.addPlanButton")}
        </Button>
      </Box>

      <PlansAdminList
        plans={plans}
        onEditPlan={handleOpenDialog}
        onDeletePlan={handleDeletePlan}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPlan?.id && plans.some((p) => p.id === editingPlan.id)
            ? t("plansManagement.dialog.editTitle")
            : t("plansManagement.dialog.addTitle")}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label={t("plansManagement.dialog.nameField")}
            fullWidth
            margin="dense"
            value={editingPlan?.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <TextField
            label={t("plansManagement.dialog.monthlyField")}
            fullWidth
            margin="dense"
            type="number"
            value={editingPlan?.monthly || ""}
            onChange={(e) => handleChange("monthly", e.target.value)}
          />
          <TextField
            label={t("plansManagement.dialog.semiAnnualField")}
            fullWidth
            margin="dense"
            type="number"
            value={editingPlan?.semiAnnual || ""}
            onChange={(e) => handleChange("semiAnnual", e.target.value)}
          />
          <TextField
            label={t("plansManagement.dialog.annualField")}
            fullWidth
            margin="dense"
            type="number"
            value={editingPlan?.annual || ""}
            onChange={(e) => handleChange("annual", e.target.value)}
          />
          <TextField
            label={t("plansManagement.dialog.websField")}
            fullWidth
            margin="dense"
            value={editingPlan?.webs || ""}
            onChange={(e) => handleChange("webs", e.target.value)}
          />
          <TextField
            label={t("plansManagement.dialog.databasesField")}
            fullWidth
            margin="dense"
            value={editingPlan?.databases || ""}
            onChange={(e) => handleChange("databases", e.target.value)}
          />
          <TextField
            label={t("plansManagement.dialog.storageField")}
            fullWidth
            margin="dense"
            value={editingPlan?.storage || ""}
            onChange={(e) => handleChange("storage", e.target.value)}
          />
          <TextField
            label={t("plansManagement.dialog.emailsField")}
            fullWidth
            margin="dense"
            value={editingPlan?.emails || ""}
            onChange={(e) => handleChange("emails", e.target.value)}
          />
          <TextField
            label={t("plansManagement.dialog.sslField")}
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
            label={t("plansManagement.dialog.webBuilderField")}
          />
          <FormControlLabel
            control={
              <Switch
                checked={editingPlan?.emailMarketing || false}
                onChange={(e) => handleChange("emailMarketing", e.target.checked)}
              />
            }
            label={t("plansManagement.dialog.emailMarketingField")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t("plansManagement.dialog.cancelButton")}</Button>
          <Button variant="contained" onClick={handleSavePlan} sx={{ bgcolor: "#FF6400" }}>
            {t("plansManagement.dialog.saveButton")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
