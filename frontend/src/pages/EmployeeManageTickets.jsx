import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import TicketsList from "../components/TicketsList";
import ConfirmDialog from "../components/ConfirmDialog";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";

export default function EmployeeManageTickets({ role = "technician" }) {
  useScrollToTop();
  const { showAlert } = useGlobalAlert();

  const [tickets, setTickets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setTickets([
      {
        ticket_id: "TCK-001",
        client_id: "CL-1001",
        subject: "Website not loading",
        description: "The client's website is down since this morning.",
        status: "Open",
        level: "Level 3",
        assigned_to: "Alice Tech",
        comments: []
      },
      {
        ticket_id: "TCK-002",
        client_id: "CL-1005",
        subject: "Email configuration",
        description: "Client needs help setting up email accounts.",
        status: "In Progress",
        level: "Level 2",
        assigned_to: "Bob Tech",
        comments: []
      },
      {
        ticket_id: "TCK-003",
        client_id: "CL-1010",
        subject: "SSL Certificate expired",
        description: "Client's SSL certificate needs renewal.",
        status: "Open",
        level: "Level 1",
        assigned_to: null,
        comments: []
      }
    ]);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_id === id ? { ...ticket, status: newStatus } : ticket
      )
    );
    showAlert(`Status updated to ${newStatus}`, "success");
  };

  const handleLevelChange = (id, newLevel) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_id === id ? { ...ticket, level: newLevel } : ticket
      )
    );
    showAlert(`Level updated to ${newLevel}`, "info");
  };

  const handleAssignTech = (id, techName) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_id === id ? { ...ticket, assigned_to: techName } : ticket
      )
    );
    showAlert(`Ticket assigned to ${techName}`, "success");
  };

  const handleAddComment = (id, comment) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_id === id
          ? { ...ticket, comments: [...ticket.comments, comment] }
          : ticket
      )
    );
    showAlert("Comment added", "info");
  };

  const handleCloseTicket = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmClose = () => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_id === selectedId ? { ...ticket, status: "Closed" } : ticket
      )
    );
    setOpenDialog(false);
    setSelectedId(null);
    showAlert("Ticket closed successfully", "info");
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212121" }}>
          Manage Tickets ({role === "coordinator" ? "Coordinator View" : "Technician View"})
        </Typography>
      </Box>

      <TicketsList
        tickets={tickets}
        role={role}
        onStatusChange={handleStatusChange}
        onLevelChange={handleLevelChange}
        onAssignTech={handleAssignTech}
        onAddComment={handleAddComment}
        onCloseTicket={handleCloseTicket}
      />

      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmClose}
        title="Close Ticket"
        message="Are you sure you want to close this ticket? This action cannot be undone."
        confirmText="Close Ticket"
      />
    </Box>
  );
}
