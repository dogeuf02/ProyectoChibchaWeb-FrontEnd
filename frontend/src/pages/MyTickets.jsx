import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useGlobalAlert } from "../context/AlertContext";
import { getAllTickets, getTicketWithHistory, createTicket } from "../api/ticketApi";
import TicketsList from "../components/Tickets/TicketsList"
import { statusOptions, levelOptions } from "../components/Tickets/ticketOptions";
import { useAuth } from "../context/AuthContext";

export default function MyTickets() {

  const { role, specificId } = useAuth();
  const { showAlert } = useGlobalAlert();
  const [tickets, setTickets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", description: "" });

  useEffect(() => {
    fetchTickets();
  }, [role, specificId]);

  const fetchTickets = async () => {
    try {
      const allTickets = await getAllTickets();

      // Filtrar por cliente o distribuidor
      const userTickets = allTickets.filter((ticket) => {
        if (role === "Cliente") return ticket.cliente == specificId;
        if (role === "Distribuidor") return ticket.distribuidor == specificId;
        return false;
      });

      // Para cada ticket, traer historial (opcional: solo el último)
      const enrichedTickets = await Promise.all(
        userTickets.map(async (ticket) => {
          const result = await getTicketWithHistory(ticket.idTicket);
          const historial = result?.historial || [];


          // Tomar el último historial si existe
          const lastAction = historial.sort(
            (a, b) => new Date(b.fechaAccion) - new Date(a.fechaAccion)
          )[0];

          return {
            ticket_id: ticket.idTicket,
            subject: ticket.asunto,
            description: ticket.descripcion,
            status: ticket.estado,
            level: ticket.nivelComplejidad,
            fechaCreacion: ticket.fechaCreacion,
            fechaCierre: ticket.fechaCierre,
            client_id: ticket.cliente,
            distributor_id: ticket.distribuidor,
            assigned_to: lastAction?.empleadoReceptor || null,
            history: historial
          };


        })

      );



      setTickets(enrichedTickets);
    } catch (error) {
      console.error("Error loading user tickets:", error);
      showAlert("Failed to load your tickets", "error");
    }
  };

  const handleAddTicket = async () => {
    if (!newTicket.subject || !newTicket.description) {
      showAlert("Please fill in all fields", "warning");
      return;
    }

    const now = new Date().toISOString();

    const payload = {
      asunto: newTicket.subject,
      descripcion: newTicket.description,
      nivelComplejidad: "nivel-1",
      estado: "Abierto",
      fechaCreacion: now,
      fechaCierre: null,
      distribuidor: role === "Distribuidor" ? parseInt(specificId) : null,
      cliente: role === "Cliente" ? parseInt(specificId) : null,
    };

    try {
      await createTicket(payload);
      await fetchTickets();

      setNewTicket({ subject: "", description: "" });
      setOpenDialog(false);
      showAlert("Your request has been submitted. We'll keep you informed.", "success");
    } catch (error) {
      console.error("Error creating ticket:", error);
      showAlert("There was an error submitting your ticket", "error");
    }
  };


  const disableSave = !newTicket.subject || !newTicket.description;

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          m: 6,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#212121" }}
        >
          My Support Tickets
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 30,
            bgcolor: "#FF6400",
            "&:hover": { bgcolor: "#FFBE02" },
          }}
          onClick={() => setOpenDialog(true)}
        >
          Add Ticket
        </Button>
      </Box>

      {/* Tabla o mensaje si no hay tickets */}
      {tickets.length === 0 ? (
        <Paper
          sx={{ p: 5, textAlign: "center", mt: 3, bgcolor: "#FAFAFA" }}
          elevation={2}
        >
          <Typography variant="h6" color="text.secondary">
            You haven't created any tickets yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Click the button above to create your first support ticket.
          </Typography>
        </Paper>
      ) : (
        <TicketsList
          tickets={tickets}
          role={role}
          showAlert={showAlert}
          statusOptions={statusOptions}
          levelOptions={levelOptions}
          employeeMap={{}} // puedes conectar esto si tienes empleados disponibles
          availableTechnicians={[]} // igual que arriba
          employeeRole={role}
          readOnly={true}
        />
      )}

      {/* Dialog para agregar ticket */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold" }}>New Ticket</DialogTitle>
        <DialogContent>
          <TextField
            label="Subject"
            fullWidth
            margin="normal"
            value={newTicket.subject}
            onChange={(e) =>
              setNewTicket((prev) => ({ ...prev, subject: e.target.value }))
            }
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={newTicket.description}
            onChange={(e) =>
              setNewTicket((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            sx={{ borderRadius: 30 }}
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              borderRadius: 30,
              bgcolor: "#FF6400",
              "&:hover": { bgcolor: "#FFBE02" },
            }}
            onClick={handleAddTicket}
            disabled={disableSave}
          >
            Submit Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
