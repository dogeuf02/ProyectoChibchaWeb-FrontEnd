import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Collapse,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const billingLabels = {
  monthly: "Monthly",
  semiAnnual: "Semi-Annual",
  annual: "Annual",
};

// Fila individual con colapsable
function PlanRow({ plan, onRequestDelete }) {
  const [open, setOpen] = useState(false);
  const price = plan.prices[plan.billingCycle] || 0;

  return (
    <>
      <TableRow hover sx={{ "& td": { borderBottom: "1px solid #f0f0f0" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{plan.type}</TableCell>
        <TableCell>{billingLabels[plan.billingCycle]}</TableCell>
        <TableCell>${price}</TableCell>
        <TableCell>
          <IconButton color="error" onClick={() => onRequestDelete(plan.id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Fila colapsable */}
      <TableRow>
        <TableCell colSpan={5} sx={{ p: 0, bgcolor: "#fafafa" }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Plan Features
              </Typography>
              {plan.features.map((feature, idx) => (
                <Typography
                  key={idx}
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 0.5,
                    pl: 1,
                    "&::before": {
                      content: '"•"',
                      mr: 1,
                    },
                  }}
                >
                  {feature}
                </Typography>
              ))}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function PlanList({ plans, onRequestDelete }) {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#fff3e0" }}>
            <TableCell />
            <TableCell sx={{ fontWeight: "bold" }}>Plan Type</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Billing</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Price (US)</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {plans.map((plan) => (
            <PlanRow key={plan.id} plan={plan} onRequestDelete={onRequestDelete} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
