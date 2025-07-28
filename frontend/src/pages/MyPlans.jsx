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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ConfirmDialog from "../components/ConfirmDialog";
import PlanList from "../components/PlanList";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";

export default function MyPlansPage() {
  useScrollToTop();
  const { showAlert } = useGlobalAlert();
  const [plans, setPlans] = useState([
    { id: "P1", type: "CHIBCHAORO", description: "Essential features for personal use", price: 9.99 },
    { id: "P2", type: "CHIBCHAPLATA", description: "Advanced tools for professionals", price: 19.99 },
    { id: "P3", type: "CHIBCHAPLATINO", description: "All features for large organizations", price: 49.99 },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [newPlan, setNewPlan] = useState({ type: "", description: "", price: "" });

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
    if (!newPlan.type || !newPlan.description || !newPlan.price) {
      showAlert("All fields are required", "warning");
      return;
    }

    const newId = `P${plans.length + 1}`;
    setPlans((prev) => [...prev, { ...newPlan, id: newId }]);
    setNewPlan({ type: "", description: "", price: "" });
    setOpenForm(false);
    showAlert("Plan added successfully", "success");
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
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

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth>
        <DialogTitle>Add New Plan</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Plan Type"
              value={newPlan.type}
              onChange={(e) => setNewPlan({ ...newPlan, type: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={newPlan.description}
              onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={newPlan.price}
              onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) })}
              fullWidth
            />
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
