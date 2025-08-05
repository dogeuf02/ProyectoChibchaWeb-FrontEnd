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
import TicketsViewList from "../components/TicketsViewList";
import { useGlobalAlert } from "../context/AlertContext";

export default function MyTickets() {
  const { showAlert } = useGlobalAlert();
  const [tickets, setTickets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", description: "" });

  useEffect(() => {
    // Datos de ejemplo
    setTickets([
      {
        ticket_id: "TCK-1001",
        subject: "Website down",
        description: "My website is not loading since last night.",
        status: "Open",
        level: "Level 2",
        comments: ["Initial investigation started."],
        employee_id: "EMP-001",
        employee_name: "Alice Tech",
      },
      {
        ticket_id: "TCK-1002",
        subject: "Email setup",
        description: "I need help configuring my email.",
        status: "In Progress",
        level: "Level 1",
        comments: [],
        employee_id: "EMP-002",
        employee_name: "Bob Tech",
      },
    ]);
  }, []);

  const handleAddTicket = () => {
    if (!newTicket.subject || !newTicket.description) {
      showAlert("Please fill in all fields", "warning");
      return;
    }

    const newId = `TCK-${Math.floor(Math.random() * 9000) + 1000}`;
    const ticketToAdd = {
      ticket_id: newId,
      subject: newTicket.subject,
      description: newTicket.description,
      status: "Open",
      level: "Level 1",
      comments: [],
      employee_id: null,
      employee_name: null,
    };

    setTickets((prev) => [...prev, ticketToAdd]);
    setNewTicket({ subject: "", description: "" });
    setOpenDialog(false);
    showAlert(
      "Your request has been submitted. We'll keep you informed.",
      "success"
    );
  };

  const disableSave = !newTicket.subject || !newTicket.description;

  return (
    <Box sx={{ p: 4 }}>
      {/* Header con título a la izquierda y botón a la derecha */}
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
        <TicketsViewList tickets={tickets} />
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
