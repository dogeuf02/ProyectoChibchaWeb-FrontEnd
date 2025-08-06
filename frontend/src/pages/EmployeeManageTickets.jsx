import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import TicketsList from "../components/Tickets/TicketsList";
import ConfirmDialog from "../components/ConfirmDialog";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";
import { getAllTickets } from "../api/ticketApi";
import { getTechnicianOptions } from "../api/employeeApi";
import { statusOptions, levelOptions } from "../components/Tickets/ticketOptions";
import { getEmployees } from "../api/employeeApi";
import { getTicketWithHistory, updateTicket } from "../api/ticketApi"
import { createHistorialEntry } from "../api/ticketHistoryApi";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../api/userApi";




export default function EmployeeManageTickets() {
  useScrollToTop();
  const { showAlert } = useGlobalAlert();

  const [tickets, setTickets] = useState([]);

  const [technicians, setTechnicians] = useState([]);
  const [employeeMap, setEmployeeMap] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { role, userId, specificId } = useAuth();
  const [employeeRole, setEmployeeRole] = useState(null);
  const isCoordinator = employeeRole?.toLowerCase().includes("coordinador");
  const isTechnician = employeeRole?.toLowerCase().includes("tecnico");

  useEffect(() => {
    const fetchRole = async () => {
      if (!role || !userId) return;
      const res = await getUserProfile(role, userId);
      if (res.exito) {
        setEmployeeRole(res.data.cargoEmpleado);
      }
    };
    fetchRole();
  }, [role, userId]);


  useEffect(() => {
    if (!employeeRole) return;
    const fetchTicketsAndData = async () => {
      try {
        const rawList = await getAllTickets();
        const ticketsWithHistory = await Promise.all(
          rawList.map(async (t) => {
            const full = await getTicketWithHistory(t.idTicket);

            const sorted = [...(full.historial || [])].sort(
              (a, b) => new Date(b.fechaAccion) - new Date(a.fechaAccion)
            );

            const lastAssigned = sorted.find(h => h.empleadoReceptor !== null);
            const lastReceptor = lastAssigned ? parseInt(lastAssigned.empleadoReceptor) : null;

            return {
              ticket_id: full.idTicket,
              client_id: full.cliente?.toString(),
              distributor_id:full.distribuidor?.toString(),
              subject: full.asunto,
              description: full.descripcion,
              status: full.estado,
              level: full.nivelComplejidad,
              assigned_to: lastReceptor,
              comments: [],
            };
          })
        );

        const isTechnician = employeeRole?.toLowerCase().includes("tecnico");
        const isCoordinator = employeeRole?.toLowerCase().includes("coordinador");

        let filtered = ticketsWithHistory;

        if (isTechnician) {
          filtered = ticketsWithHistory.filter(
            (t) => parseInt(t.assigned_to) === parseInt(specificId)
          );
        } else if (isCoordinator) {
          switch (employeeRole) {
            case "Coordinador nv 1":
              filtered = ticketsWithHistory.filter(t => t.level === "nivel-1");
              break;
            case "Coordinador nv 2":
              filtered = ticketsWithHistory.filter(t => t.level === "nivel-2");
              break;
            case "Coordinador nv 3":
              filtered = ticketsWithHistory.filter(t => t.level === "nivel-3");
              break;
            default:
              filtered = [];
          }
        }


        setTickets(filtered);

        const techs = await getTechnicianOptions(employeeRole);
        setTechnicians(techs);

        const { exito, empleados } = await getEmployees();
        if (exito) {
          const map = {};
          empleados.forEach(emp => {
            map[emp.id] = emp.email;
          });
          setEmployeeMap(map);
        }

      } catch (err) {
        console.error("Error loading tickets:", err);
      }
    };



    fetchTicketsAndData();
  }, [employeeRole]);






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

  const handleAssignTech = (id, techId) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_id === id ? { ...ticket, assigned_to: techId } : ticket
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

  const handleConfirmClose = async () => {
    const ticketToClose = tickets.find((t) => t.ticket_id === selectedId);
    const coordinatorId = localStorage.getItem("idEmpleado");

    if (!ticketToClose) return;

    const updatedTicket = {
      idTicket: ticketToClose.ticket_id,
      asunto: ticketToClose.subject,
      descripcion: ticketToClose.description,
      nivelComplejidad: ticketToClose.level,
      estado: "Cerrado",
      fechaCreacion: ticketToClose.fechaCreacion,
      fechaCierre: new Date().toISOString(),
      distribuidor: ticketToClose.distributor_id,
      cliente: ticketToClose.client_id,
    };

    try {
      await updateTicket(ticketToClose.ticket_id, updatedTicket);

      const historialPayload = {
        idHistorialTicket: 0,
        accionTicket: "solucionado",
        comentarios: "Ticket cerrado manualmente",
        fechaAccion: new Date().toISOString(),
        ticket: ticketToClose.ticket_id,
        empleadoRealizador: parseInt(coordinatorId),
        empleadoReceptor: null,
      };

      await createHistorialEntry(historialPayload);

      // actualizar el estado en el frontend
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.ticket_id === selectedId
            ? { ...ticket, status: "Cerrado" }
            : ticket
        )
      );

      showAlert("Ticket cerrado con éxito", "success");
    } catch (error) {
      console.error("Error cerrando ticket:", error);
      showAlert("Error al cerrar el ticket", "error");
    } finally {
      setOpenDialog(false);
      setSelectedId(null);
    }
  };

  const handleUpdateTicket = (updatedTicket) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_id === updatedTicket.ticket_id ? updatedTicket : ticket
      )
    );
  };


  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212121" }}>
          Manage Tickets ({isCoordinator ? "Coordinator View" : "Technician View"})
        </Typography>
      </Box>

      <TicketsList
        tickets={tickets}
        statusOptions={statusOptions}
        levelOptions={levelOptions}
        availableTechnicians={technicians}
        onStatusChange={handleStatusChange}
        onLevelChange={handleLevelChange}
        onAssignTech={handleAssignTech}
        onAddComment={handleAddComment}
        onCloseTicket={handleCloseTicket}
        employeeMap={employeeMap}
        onUpdateTicket={handleUpdateTicket}
        showAlert={showAlert}
        employeeRole={employeeRole}
      />


      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmClose} // ✅ importante
        title="Close Ticket"
        message="Are you sure you want to close this ticket? This action cannot be undone."
        confirmText="Close Ticket"
      />
    </Box>
  );
}
