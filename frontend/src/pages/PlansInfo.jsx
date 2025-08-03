import React, { useState } from "react";
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

// Simulación de usuario
const mockUser = {
  isLoggedIn: true,       // Si está logIn
  role: "client",
  hasPaymentMethod: true  // Cambia a false para probar redirección
};

const plans = [
  {
    title: "CHIBCHAPLATA",
    color: "#C0C0C0",
    price: { monthly: 5, semiAnnual: 25, annual: 45 },
    features: [
      "2 websites",
      "20 databases",
      "20 GB NVMe SSD storage",
      "20 email accounts",
      "Website builder",
      "2 SSL Certificates, https",
      "Email Marketing"
    ]
  },
  {
    title: "CHIBCHAPLATINO",
    color: "#CD7F32",
    price: { monthly: 8, semiAnnual: 40, annual: 72 },
    features: [
      "3 websites",
      "40 databases",
      "40 GB NVMe SSD storage",
      "40 email accounts",
      "Website builder",
      "3 SSL Certificates, https",
      "Email Marketing"
    ]
  },
  {
    title: "CHIBCHAORO",
    color: "#FFD700",
    price: { monthly: 11, semiAnnual: 55, annual: 99 },
    features: [
      "5 websites",
      "Unlimited databases",
      "60 GB NVMe SSD storage",
      "60 email accounts",
      "Website builder",
      "5 SSL Certificates, https",
      "Email Marketing"
    ]
  }
];

export default function PlansInfo() {
  const navigate = useNavigate();
  const { showAlert } = useGlobalAlert();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openBillingDialog, setOpenBillingDialog] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");

  const handleGetPlan = (plan) => {
    // Verificar login como cliente
    if (!mockUser.isLoggedIn || mockUser.role !== "client") {
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

  return (
    <Box id="Plans" sx={{ bgcolor: "#FAFAFA", py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ color: "#212121", fontWeight: "bold" }}
        >
          Choose the Right Hosting Plan
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{ color: "#616161ff", mb: 4 }}
        >
          Flexible prices to grow with your business
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan, index) => (
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
                    {plan.title}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      <strong>Monthly:</strong> {plan.price.monthly} US
                    </Typography>
                    <Typography variant="body1">
                      <strong>Semi-Annual:</strong> {plan.price.semiAnnual} US
                    </Typography>
                    <Typography variant="body1">
                      <strong>Annual:</strong> {plan.price.annual} US
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <List dense>
                    {plan.features.map((feature, i) => (
                      <ListItem key={i} sx={{ py: 0.5 }}>
                        <Typography variant="body2" sx={{ color: "#212121" }}>
                          • {feature}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
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
                    Get the Plan
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
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
              sx={{ bgcolor: "#FF6400", borderRadius: 30, "&:hover":{ bgcolor: "#e25a00" } }}
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
