import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import TicketsList from "../components/TicketsList";
import ConfirmDialog from "../components/ConfirmDialog";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";

export default function EmployeeManageTickets() {
  useScrollToTop();
  const { showAlert } = useGlobalAlert();

  const [tickets, setTickets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    // Simulated initial data
    setTickets([
      {
        ticket_id: "TCK-001",
        client_id: "CL-1001",
        subject: "Website not loading",
        description: "The client's website is down since this morning.",
        status: "Pending",
        priority: "High",
      },
      {
        ticket_id: "TCK-002",
        client_id: "CL-1005",
        subject: "Email configuration",
        description: "Client needs help setting up email accounts.",
        status: "In Progress",
        priority: "Medium",
      },
      {
        ticket_id: "TCK-003",
        client_id: "CL-1010",
        subject: "SSL Certificate expired",
        description: "Client's SSL certificate needs renewal.",
        status: "Pending",
        priority: "Low",
      },
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

  const handlePriorityChange = (id, newPriority) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_id === id ? { ...ticket, priority: newPriority } : ticket
      )
    );
    showAlert(`Priority updated to ${newPriority}`, "info");
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
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212121" }}>
          Support Tickets
        </Typography>
      </Box>

      <TicketsList
        tickets={tickets}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
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
