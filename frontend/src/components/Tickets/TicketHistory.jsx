import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function TicketHistory({ history = [], availableTechnicians = [] }) {
  const { t } = useTranslation();
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.fechaAccion) - new Date(a.fechaAccion)
  );

  const getReceptorEmail = (id) => {
    return availableTechnicians.find((t) => t.id === id)?.value || null;
  };

  const formatActionLabel = (action) => {
    switch (action) {
      case "asignado": return t("tickets.history.assigned");
      case "reasignado": return t("tickets.history.reassigned");
      case "solucionado": return t("tickets.history.resolved");
      case "escalado": return t("tickets.history.escalated");
      case "comentado": return t("tickets.history.comment");
      default: return action;
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" gutterBottom color="text.primary">
        {t("tickets.history.title")}
      </Typography>
      {sortedHistory.map((entry) => (
        <Box key={entry.idHistorialTicket} sx={{ mb: 2, p: 1, bgcolor: "#f5f5f5", borderRadius: 2 }}>
          <Typography variant="subtitle2">
            {formatActionLabel(entry.accionTicket)} – {new Date(entry.fechaAccion).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {entry.comentarios}
          </Typography>
          {entry.empleadoReceptor && (
            <Typography variant="body2" color="text.secondary">
              {t("tickets.history.assignedTo", {
                email: getReceptorEmail(entry.empleadoReceptor),
              })}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}
