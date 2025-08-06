// components/Tickets/TicketRow.jsx
import {
    TableRow,
    TableCell,
    IconButton,
    Collapse,
    Box,
    Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TicketHistory from "./TicketHistory";
import TicketActions from "./TicketActions";
import { getTicketWithHistory, updateTicket } from "../../api/ticketApi";
import { createHistorialEntry } from "../../api/ticketHistoryApi";


export default function TicketRow({
    ticket,
    onCloseTicket,
    availableTechnicians,
    statusOptions,
    levelOptions,
    employeeMap,
    onUpdateTicket,
    showAlert,
    employeeRole,

}) {
    const [open, setOpen] = useState(false);
    const [tempStatus, setTempStatus] = useState(ticket.status);
    const [tempLevel, setTempLevel] = useState(ticket.level);
    const [tempAssignedTech, setTempAssignedTech] = useState(ticket.assigned_to);
    const [comment, setComment] = useState("");
    const [history, setHistory] = useState([]);
    const isCoordinator = employeeRole?.toLowerCase().includes("coordinador");



    const isClosed = ticket.status === "Cerrado" || ticket.status === "Closed";

    const toggleOpen = async () => {
        setOpen(!open);
        if (!open && history.length === 0) {
            const fullTicket = await getTicketWithHistory(ticket.ticket_id);
            const sortedHistory = [...(fullTicket.historial || [])].sort(
                (a, b) => new Date(a.fechaAccion) - new Date(b.fechaAccion)
            );
            setHistory(sortedHistory);
        }
    };

    const handleSaveChanges = async () => {
        try {
            const oldAssigned = ticket.assigned_to;
            const newAssigned = parseInt(tempAssignedTech) || null;
            const oldStatus = ticket.status;
            const newStatus = tempStatus;
            const oldLevel = ticket.level;
            const newLevel = tempLevel;

            let accionTicket = "comentado";

            const changedTechnician =
                oldAssigned === null && newAssigned !== null
                    ? "asignado"
                    : oldAssigned !== null && newAssigned !== null && oldAssigned !== newAssigned
                        ? "reasignado"
                        : null;

            if (changedTechnician) {
                accionTicket = changedTechnician;
            } else if (oldStatus !== "Cerrado" && newStatus === "Cerrado") {
                accionTicket = "solucionado";
            } else if (oldLevel !== newLevel) {
                accionTicket = "escalado";
            } else if (comment.trim()) {
                accionTicket = "comentado";
            }

            const noChanges =
                !changedTechnician &&
                oldStatus === newStatus &&
                oldLevel === newLevel &&
                !comment.trim();

            if (noChanges) {
                showAlert("No se realizaron cambios", "info");
                return;
            }

            const updatedTicket = {
                idTicket: ticket.ticket_id,
                asunto: ticket.subject,
                descripcion: ticket.description,
                nivelComplejidad: tempLevel,
                estado: tempStatus,
                fechaCreacion: ticket.fechaCreacion,
                fechaCierre: tempStatus === "Cerrado" ? new Date().toISOString() : null,
                distribuidor: ticket.distribuidor,
                cliente: ticket.client_id,
            };

            await updateTicket(ticket.ticket_id, updatedTicket);

            const historialPayload = {
                idHistorialTicket: 0,
                accionTicket,
                comentarios: comment || `Asignado a ${newAssigned ?? "N/A"}`,
                fechaAccion: new Date().toISOString(),
                ticket: ticket.ticket_id,
                empleadoRealizador: parseInt(localStorage.getItem("idEmpleado")),
                empleadoReceptor: newAssigned,
            };

            await createHistorialEntry(historialPayload);

            const updatedTicketWithHistory = await getTicketWithHistory(ticket.ticket_id);
            const sortedUpdatedHistory = [...(updatedTicketWithHistory.historial || [])].sort(
                (a, b) => new Date(a.fechaAccion) - new Date(b.fechaAccion)
            );
            setHistory(sortedUpdatedHistory);

            if (typeof onUpdateTicket === "function") {
                onUpdateTicket({
                    ...ticket,
                    status: tempStatus,
                    level: tempLevel,
                    assigned_to: newAssigned,
                });
            }

            setComment("");
            showAlert("Ticket actualizado con éxito", "success");
        } catch (err) {
            console.error("Error al guardar cambios:", err);
            showAlert("Hubo un error al guardar los cambios", "error");
        }
    };

    const getStatusColor = (status) => {
        if (!status) return "default";
        const normalized = status.toLowerCase();
        switch (normalized) {
            case "abierto":
            case "open":
                return "info";
            case "en progreso":
            case "in progress":
                return "warning";
            case "escalado":
            case "escalated":
                return "error";
            case "cerrado":
            case "closed":
                return "default";
            default:
                return "default";
        }
    };
    const getLevelColor = (level) => {
        if (isClosed) return "default"; // ✅ gris si está cerrado

        switch (level) {
            case "nivel-1":
                return "success";
            case "nivel-2":
                return "warning";
            case "nivel-3":
                return "error";
            default:
                return "default";
        }
    };



    return (
        <>
            <TableRow hover sx={{ "& td": { borderColor: "#e0e0e0" } }}>
                <TableCell>
                    <IconButton size="small" onClick={toggleOpen}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{ticket.ticket_id}</TableCell>
                <TableCell>{ticket.client_id}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>
                    <Chip
                        label={ticket.status}
                        size="small"
                        color={getStatusColor(ticket.status)}
                    />
                </TableCell>
                <TableCell>
                    <Chip label={ticket.level} size="small" color={getLevelColor(ticket.level)} />
                </TableCell>

                {isCoordinator && (
                    <TableCell>
                        {employeeMap?.[ticket.assigned_to] || <i>No assigned</i>}
                    </TableCell>
                )}
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                            <TicketActions
                                isClosed={isClosed}
                                tempStatus={tempStatus}
                                tempLevel={tempLevel}
                                tempAssignedTech={tempAssignedTech}
                                comment={comment}
                                statusOptions={statusOptions}
                                levelOptions={levelOptions}
                                availableTechnicians={availableTechnicians}
                                onChangeStatus={setTempStatus}
                                onChangeLevel={setTempLevel}
                                onChangeTechnician={setTempAssignedTech}
                                onChangeComment={setComment}
                                onSave={handleSaveChanges}
                                employeeRole= {employeeRole}
                                onClose={() => onCloseTicket(ticket.ticket_id)}
                            />

                            <TicketHistory
                                history={history}
                                availableTechnicians={availableTechnicians}
                            />
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}
