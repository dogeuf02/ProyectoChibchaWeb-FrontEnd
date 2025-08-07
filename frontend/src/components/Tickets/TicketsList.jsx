// components/Tickets/TicketsList.jsx
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import TicketRow from "./TicketRow";
import { useTranslation } from "react-i18next";

export default function TicketsList({
  tickets,
  role,
  onStatusChange,
  onLevelChange,
  onAssignTech,
  onAddComment,
  onCloseTicket,
  statusOptions,
  levelOptions,
  availableTechnicians,
  employeeMap,
  onUpdateTicket,
  showAlert,
  employeeRole,
  readOnly,
}) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const isCoordinator = employeeRole?.toLowerCase().includes("coordinador");

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder={t("tickets.table.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#fff3e0" }}>
              <TableCell />
              <TableCell><b>{t("tickets.table.ticketId")}</b></TableCell>
              {!readOnly && <TableCell><b>{t("tickets.table.clientId")}</b></TableCell>}
              {!readOnly && <TableCell><b>{t("tickets.table.distributorId")}</b></TableCell>}
              <TableCell><b>{t("tickets.table.subject")}</b></TableCell>
              {readOnly && <TableCell><b>{t("tickets.table.description")}</b></TableCell>}
              <TableCell><b>{t("tickets.table.status")}</b></TableCell>
              <TableCell><b>{t("tickets.table.level")}</b></TableCell>
              {isCoordinator && <TableCell><b>{t("tickets.table.assignedTo")}</b></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {(tickets || [])
              .filter((t) => {
                const ticketId = t.ticket_id?.toLowerCase() || "";
                const clientId = t.client_id?.toString().toLowerCase() || "";
                const search = searchTerm.toLowerCase();
                return ticketId.includes(search) || clientId.includes(search);
              })
              .map((ticket, index) => (
                <TicketRow
                  key={ticket.ticket_id || index}
                  ticket={ticket}
                  role={role}
                  onStatusChange={onStatusChange}
                  onLevelChange={onLevelChange}
                  onAssignTech={onAssignTech}
                  onAddComment={onAddComment}
                  onCloseTicket={onCloseTicket}
                  statusOptions={statusOptions}
                  levelOptions={levelOptions}
                  availableTechnicians={availableTechnicians}
                  employeeMap={employeeMap}
                  onUpdateTicket={onUpdateTicket}
                  showAlert={showAlert}
                  employeeRole={employeeRole}
                  readOnly={readOnly}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
