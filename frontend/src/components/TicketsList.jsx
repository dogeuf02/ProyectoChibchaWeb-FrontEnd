import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function getStatusColor(status) {
  switch (status) {
    case "Pending":
      return "warning";
    case "In Progress":
      return "info";
    case "Resolved":
      return "success";
    case "Closed":
      return "default";
    default:
      return "default";
  }
}

function getPriorityColor(priority) {
  switch (priority) {
    case "High":
      return "error";
    case "Medium":
      return "warning";
    case "Low":
      return "success";
    default:
      return "default";
  }
}

function Row({ ticket, onStatusChange, onPriorityChange, onCloseTicket }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover sx={{ "& td": { borderColor: "#e0e0e0" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{ticket.ticket_id}</TableCell>
        <TableCell>{ticket.client_id}</TableCell>
        <TableCell>{ticket.subject}</TableCell>
        <TableCell>
          <Chip label={ticket.status} color={getStatusColor(ticket.status)} size="small" />
        </TableCell>
        <TableCell>
          <Chip label={ticket.priority} color={getPriorityColor(ticket.priority)} size="small" />
        </TableCell>
        <TableCell>{ticket.status === "Closed" ? "—" : "Active"}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={7} sx={{ bgcolor: "#fafafa", p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom color="text.primary">
                Ticket Details
              </Typography>
              <Typography variant="body2">Ticket ID: {ticket.ticket_id}</Typography>
              <Typography variant="body2">Client ID: {ticket.client_id}</Typography>
              <Typography variant="body2">Subject: {ticket.subject}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Description: {ticket.description}
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select
                    value={ticket.status}
                    onChange={(e) => onStatusChange(ticket.ticket_id, e.target.value)}
                  >
                    {["Pending", "In Progress", "Resolved"].map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select
                    value={ticket.priority}
                    onChange={(e) => onPriorityChange(ticket.ticket_id, e.target.value)}
                  >
                    {["Low", "Medium", "High"].map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        {priority}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => onCloseTicket(ticket.ticket_id)}
                >
                  Close Ticket
                </Button>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function TicketsList({
  tickets,
  onStatusChange,
  onPriorityChange,
  onCloseTicket,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by Ticket ID or Client ID"
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
              <TableCell><b>Ticket ID</b></TableCell>
              <TableCell><b>Client ID</b></TableCell>
              <TableCell><b>Subject</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Priority</b></TableCell>
              <TableCell><b>Activity</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets
              .filter(
                (t) =>
                  t.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  t.client_id.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((ticket) => (
                <Row
                  key={ticket.ticket_id}
                  ticket={ticket}
                  onStatusChange={onStatusChange}
                  onPriorityChange={onPriorityChange}
                  onCloseTicket={onCloseTicket}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
