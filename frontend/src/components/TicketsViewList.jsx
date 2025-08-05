// src/components/TicketsViewList.jsx
import { useState } from "react";
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
  Chip,
  TextField,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case "open":
      return "info";
    case "in progress":
      return "warning";
    case "escalated":
      return "error";
    case "closed":
      return "success";
    default:
      return "default";
  }
}

function getLevelColor(level) {
  switch (level) {
    case "Level 1":
      return "success";
    case "Level 2":
      return "warning";
    case "Level 3":
      return "error";
    default:
      return "default";
  }
}

function Row({ ticket }) {
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
        <TableCell>{ticket.subject}</TableCell>
        <TableCell>
          <Chip label={ticket.status} color={getStatusColor(ticket.status)} size="small" />
        </TableCell>
        <TableCell>
          <Chip label={ticket.level} color={getLevelColor(ticket.level)} size="small" />
        </TableCell>
        <TableCell>{ticket.employee_id || "-"}</TableCell>
        <TableCell>{ticket.employee_name || "-"}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={7} sx={{ bgcolor: "#fafafa", p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom color="text.primary">
                Ticket Details
              </Typography>
              <Typography variant="body2">Description: {ticket.description}</Typography>

              {ticket.comments && ticket.comments.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Comments:</Typography>
                  {ticket.comments.map((c, i) => (
                    <Typography key={i} variant="body2" sx={{ ml: 2 }}>
                      • {c}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function TicketsViewList({ tickets }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by Ticket ID or Subject"
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
              <TableCell><b>Subject</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Level</b></TableCell>
              <TableCell><b>Employee ID</b></TableCell>
              <TableCell><b>Employee Name</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(tickets || [])
              .filter(
                (t) =>
                  t.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  t.subject.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((ticket) => (
                <Row key={ticket.ticket_id} ticket={ticket} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
