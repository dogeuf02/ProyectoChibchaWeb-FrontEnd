import {
    TableRow,
    TableCell,
    IconButton,
    Collapse,
    Box,
    Chip,
    Typography
} from "@mui/material";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TicketHistory from "./TicketHistory";
import TicketActions from "./TicketActions";
import { getTicketWithHistory, updateTicket } from "../../api/ticketApi";
import { createHistorialEntry } from "../../api/ticketHistoryApi";
import { useTranslation } from "react-i18next";

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
    readOnly = false,
}) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [tempStatus, setTempStatus] = useState(ticket.status);
    const [tempLevel, setTempLevel] = useState(ticket.level);
    const [tempAssignedTech, setTempAssignedTech] = useState(ticket.assigned_to);
    const [comment, setComment] = useState("");
    const [history, setHistory] = useState([]);
    const isCoordinator = employeeRole?.toLowerCase().includes("coordinador");

    const isClosed = ticket.status?.toLowerCase() === "cerrado" || ticket.status?.toLowerCase() === "closed";

    const toggleOpen = async () => {
        setOpen(!open);
        if (!open && history.length === 0 && !readOnly) {
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
                showAlert(t("tickets.alerts.noChanges"), "info");
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
                distribuidor: ticket.distributor_id,
                cliente: ticket.client_id,
            };

            await updateTicket(ticket.ticket_id, updatedTicket);

            const historialPayload = {
                idHistorialTicket: 0,
                accionTicket,
                comentarios: comment || t("tickets.history.assignedTo", { tech: newAssigned ?? "N/A" }),
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
            showAlert(t("tickets.alerts.updateSuccess"), "success");
        } catch (err) {
            console.error("Error al guardar cambios:", err);
            showAlert(t("tickets.alerts.updateError"), "error");
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
        if (isClosed) return "default";
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
                    {!readOnly && (
                        <IconButton size="small" onClick={toggleOpen}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    )}
                </TableCell>
                <TableCell>{ticket.ticket_id}</TableCell>
                {!readOnly && <TableCell>{ticket.client_id}</TableCell>}
                {!readOnly && <TableCell>{ticket.distributor_id || <i>-</i>}</TableCell>}
                <TableCell>{ticket.subject}</TableCell>
                {readOnly && <TableCell>{ticket.description}</TableCell>}
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
                        {employeeMap?.[ticket.assigned_to] || <i>{t("tickets.table.noAssigned")}</i>}
                    </TableCell>
                )}
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                {t("tickets.history.description")}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {ticket.description}
                            </Typography>

                            {!readOnly && (
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
                                    employeeRole={employeeRole}
                                    onClose={() => onCloseTicket(ticket.ticket_id)}
                                />
                            )}

                            {!readOnly && (
                                <TicketHistory
                                    history={history}
                                    availableTechnicians={availableTechnicians}
                                />
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}
