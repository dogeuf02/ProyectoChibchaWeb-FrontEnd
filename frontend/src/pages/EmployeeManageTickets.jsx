import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import TicketsList from "../components/Tickets/TicketsList";
import ConfirmDialog from "../components/ConfirmDialog";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";
import { getAllTickets, getTicketWithHistory, updateTicket } from "../api/ticketApi";
import { getTechnicianOptions, getEmployees } from "../api/employeeApi";
import { statusOptions, levelOptions } from "../components/Tickets/ticketOptions";
import { createHistorialEntry } from "../api/ticketHistoryApi";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../api/userApi";
import { useTranslation } from "react-i18next";

export default function EmployeeManageTickets() {
  useScrollToTop();
  const { showAlert } = useGlobalAlert();
  const { t } = useTranslation();

  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [employeeMap, setEmployeeMap] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { role, userId, specificId } = useAuth();
  const [employeeRole, setEmployeeRole] = useState(null);

  const isCoordinator = employeeRole?.toLowerCase().includes("coordinador");
  const isTechnician = employeeRole?.toLowerCase().includes("tecnico");

  // Obtener rol del empleado
  useEffect(() => {
    const fetchRole = async () => {
      if (!role || !userId) return;
      const res = await getUserProfile(role, userId);
      if (res.exito) setEmployeeRole(res.data.cargoEmpleado);
    };
    fetchRole();
  }, [role, userId]);

  // Obtener tickets filtrados por rol
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
            const lastAssigned = sorted.find((h) => h.empleadoReceptor !== null);
            const lastReceptor = lastAssigned ? parseInt(lastAssigned.empleadoReceptor) : null;

            return {
              ticket_id: full.idTicket,
              client_id: full.cliente?.toString(),
              distributor_id: full.distribuidor?.toString(),
              subject: full.asunto,
              description: full.descripcion,
              status: full.estado,
              level: full.nivelComplejidad,
              assigned_to: lastReceptor,
              comments: [],
            };
          })
        );

        let filtered = ticketsWithHistory;
        if (isTechnician) {
          filtered = ticketsWithHistory.filter(
            (t) => parseInt(t.assigned_to) === parseInt(specificId)
          );
        } else if (isCoordinator) {
          switch (employeeRole) {
            case "Coordinador nv 1":
              filtered = ticketsWithHistory.filter((t) => t.level === "nivel-1");
              break;
            case "Coordinador nv 2":
              filtered = ticketsWithHistory.filter((t) => t.level === "nivel-2");
              break;
            case "Coordinador nv 3":
              filtered = ticketsWithHistory.filter((t) => t.level === "nivel-3");
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
          empleados.forEach((emp) => {
            map[emp.id] = emp.email;
          });
          setEmployeeMap(map);
        }
      } catch (err) {
        console.error("Error loading tickets:", err);
      }
    };

    fetchTicketsAndData();
  }, [employeeRole, isCoordinator, isTechnician, specificId]);

  // Handlers
  const handleStatusChange = (id, newStatus) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_id === id ? { ...ticket, status: newStatus } : ticket
      )
    );
    showAlert(t("tickets.alerts.statusUpdated", { status: newStatus }), "success");
  };

  const handleLevelChange = (id, newLevel) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_id === id ? { ...ticket, level: newLevel } : ticket
      )
    );
    showAlert(t("tickets.alerts.levelUpdated", { level: newLevel }), "info");
  };

  const handleAssignTech = (id, techId) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_id === id ? { ...ticket, assigned_to: techId } : ticket
      )
    );
    showAlert(t("tickets.alerts.assignedSuccess"), "success");
  };

  const handleAddComment = (id, comment) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_id === id
          ? { ...ticket, comments: [...ticket.comments, comment] }
          : ticket
      )
    );
    showAlert(t("tickets.alerts.commentAdded"), "info");
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
        comentarios: t("tickets.history.closedManually"),
        fechaAccion: new Date().toISOString(),
        ticket: ticketToClose.ticket_id,
        empleadoRealizador: parseInt(coordinatorId),
        empleadoReceptor: null,
      };

      await createHistorialEntry(historialPayload);

      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.ticket_id === selectedId ? { ...ticket, status: "Cerrado" } : ticket
        )
      );

      showAlert(t("tickets.alerts.closeSuccess"), "success");
    } catch (error) {
      console.error("Error closing ticket:", error);
      showAlert(t("tickets.alerts.closeError"), "error");
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
          {t("tickets.manageTitle", {
            view: isCoordinator
              ? t("tickets.views.coordinator")
              : t("tickets.views.technician"),
          })}
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
        onConfirm={handleConfirmClose}
        title={t("tickets.confirmDialog.title")}
        message={t("tickets.confirmDialog.message")}
        confirmText={t("tickets.confirmDialog.confirm")}
        cancelText={t("tickets.confirmDialog.cancel")}
      />
    </Box>
  );
}
