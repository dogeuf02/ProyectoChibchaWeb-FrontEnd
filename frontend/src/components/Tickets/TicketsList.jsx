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
  InputAdornment
} from "@mui/material";

import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import TicketRow from "./TicketRow";

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
  const [searchTerm, setSearchTerm] = useState("");
  const isCoordinator = employeeRole?.toLowerCase().includes("coordinador");


  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by Ticket or Client ID"
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
              <TableCell><b>ID Ticket</b></TableCell>
              {!readOnly && <TableCell><b>Client ID</b></TableCell>}
              {!readOnly && <TableCell><b>Distributor ID</b></TableCell>}
              <TableCell><b>Subject</b></TableCell>
              {readOnly && <TableCell><b>Description</b></TableCell>}
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Level</b></TableCell>
              {isCoordinator && <TableCell><b>Assigned To</b></TableCell>}
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
