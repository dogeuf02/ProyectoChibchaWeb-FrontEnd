import { Box, Typography } from "@mui/material";

export default function TicketHistory({ history = [], availableTechnicians = [] }) {
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.fechaAccion) - new Date(a.fechaAccion)
  );

  const getReceptorEmail = (id) => {
    return availableTechnicians.find((t) => t.id === id)?.value || null;
  };

  const formatActionLabel = (action) => {
    switch (action) {
      case "asignado": return "Assigned";
      case "reasignado": return "Reassigned";
      case "solucionado": return "Resolved";
      case "escalado": return "Escalated";
      case "comentado": return "Comment";
      default: return action;
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" gutterBottom color="text.primary">
        History
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
              Assigned to: {getReceptorEmail(entry.empleadoReceptor)}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}