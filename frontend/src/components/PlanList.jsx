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
  Chip,
  Stack,
} from "@mui/material";
import DoDisturbAltOutlinedIcon from '@mui/icons-material/DoDisturbAltOutlined';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import { useTranslation } from "react-i18next";

export default function PlanList({ plans, onRequestDelete }) {
  const { t } = useTranslation();

  const billingLabels = {
    monthly: t("myPlans.billing.monthly"),
    semiAnnual: t("myPlans.billing.semiAnnual"),
    annual: t("myPlans.billing.annual"),
  };

  function PlanRow({ plan, onRequestDelete }) {
    const [open, setOpen] = useState(false);
    const price = plan.prices[plan.billingCycle] || 0;

    const getPlanStyle = (type) => {
      const name = type?.toLowerCase();
      if (name.includes("gold")) return { background: "#f8e44b" };
      if (name.includes("silver")) return { background: "#CCCCCC" };
      if (name.includes("platinum"))
        return { background: "linear-gradient(135deg, #d08851ff 0%, #c88860ff 100%)", color: "#FAFAFA" };
      return { background: "#E0E0E0" };
    };

    return (
      <>
        <TableRow hover>
          <TableCell>
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>

          <TableCell>
            <Chip
              label={plan.type}
              sx={{ ...getPlanStyle(plan.type), fontWeight: "bold", px: 2, borderRadius: "20px" }}
            />
          </TableCell>

          <TableCell>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CreditCardIcon fontSize="small" color="action" />
              <Typography variant="body2">{billingLabels[plan.billingCycle]}</Typography>
            </Stack>
          </TableCell>

          <TableCell>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#FF6400" }}>
              ${price.toFixed(2)}
            </Typography>
          </TableCell>

          <TableCell>
            <IconButton color="error" onClick={() => onRequestDelete(plan.id)}>
              <DoDisturbAltOutlinedIcon />
            </IconButton>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell colSpan={5} sx={{ p: 0, bgcolor: "#FAFAFA" }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: "#212121" }}>
                  {t("myPlans.features.title")}
                </Typography>
                <Stack spacing={1}>
                  {plan.features.map((feature, idx) => (
                    <Stack direction="row" alignItems="center" spacing={1} key={idx}>
                      <ArrowRightOutlinedIcon sx={{ color: "#FF6400" }} fontSize="small" />
                      <Typography variant="body2" color="#424242">{feature}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#fff3e0" }}>
            <TableCell />
            <TableCell sx={{ fontWeight: "bold", color: "#212121" }}>
              {t("myPlans.table.planType")}
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#212121" }}>
              {t("myPlans.table.billing")}
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#212121" }}>
              {t("myPlans.table.price")}
            </TableCell>
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
