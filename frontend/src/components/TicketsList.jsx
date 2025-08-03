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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Stack
} from "@mui/material";

import { useState } from "react";
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

function Row({
  ticket,
  role,
  onStatusChange,
  onLevelChange,
  onAssignTech,
  onAddComment,
  onCloseTicket,
  availableTechnicians
}) {
  const [open, setOpen] = useState(false);
  const [assignedTech, setAssignedTech] = useState(ticket.assigned_to || "");
  const [comment, setComment] = useState("");

  const handleAssign = () => {
    if (assignedTech) {
      onAssignTech(ticket.ticket_id, assignedTech);
    }
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      onAddComment(ticket.ticket_id, comment);
      setComment("");
    }
  };

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
          <Chip label={ticket.level} color={getLevelColor(ticket.level)} size="small" />
        </TableCell>
        {role === "coordinator" && (
          <TableCell>{ticket.assigned_to || "-"}</TableCell>
        )}
      </TableRow>

      <TableRow>
        <TableCell colSpan={role === "coordinator" ? 7 : 6} sx={{ bgcolor: "#fafafa", p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom color="text.primary">
                Ticket Details
              </Typography>
              <Typography variant="body2">Description: {ticket.description}</Typography>

              {/* Cambiar estado */}
              <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Change Status</InputLabel>
                  <Select
                    value={ticket.status}
                    label="Change Status"
                    onChange={(e) => onStatusChange(ticket.ticket_id, e.target.value)}
                  >
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Escalated">Escalated</MenuItem>
                    <MenuItem value="Closed">Closed</MenuItem>
                  </Select>
                </FormControl>

                {role === "coordinator" && (
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Change Level</InputLabel>
                    <Select
                      value={ticket.level}
                      label="Change Level"
                      onChange={(e) => onLevelChange(ticket.ticket_id, e.target.value)}
                    >
                      <MenuItem value="Level 1">Level 1</MenuItem>
                      <MenuItem value="Level 2">Level 2</MenuItem>
                      <MenuItem value="Level 3">Level 3</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Box>

              {/* Comentarios */}
              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <TextField
                  label="Add Comment"
                  size="small"
                  fullWidth
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button variant="contained" onClick={handleAddComment} sx={{borderRadius: 30, bgcolor: '#e25a00'}}>
                  Add
                </Button>
              </Box>

              {/* Asignación solo coordinador */}
              {role === "coordinator" && (
                <Box sx={{ mt: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 200, mr: 2 }}>
                    <InputLabel>Assign Technician</InputLabel>
                    <Select
                      value={assignedTech}
                      label="Assign Technician"
                      onChange={(e) => setAssignedTech(e.target.value)}
                    >
                      {availableTechnicians.map((tech) => (
                        <MenuItem key={tech} value={tech}>
                          {tech}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAssign}
                    disabled={!assignedTech}
                    sx={{borderRadius: 30, bgcolor: '#e25a00'}}
                  >
                    Assign
                  </Button>
                </Box>
              )}

              {/* Cerrar ticket */}
              {ticket.status !== "Closed" && (
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" color="error" onClick={() => onCloseTicket(ticket.ticket_id)}
                    sx={{borderRadius: 30}}>
                    Close Ticket
                  </Button>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function TicketsList({
  tickets,
  role,
  onStatusChange,
  onLevelChange,
  onAssignTech,
  onAddComment,
  onCloseTicket
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const availableTechnicians = ["Alice Tech", "Bob Tech", "Charlie Tech"];

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
              <TableCell><b>Ticket ID</b></TableCell>
              <TableCell><b>Client ID</b></TableCell>
              <TableCell><b>Subject</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Level</b></TableCell>
              {role === "coordinator" && <TableCell><b>Assigned To</b></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {(tickets || [])
              .filter(
                (t) =>
                  t.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  t.client_id.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((ticket) => (
                <Row
                  key={ticket.ticket_id}
                  ticket={ticket}
                  role={role}
                  onStatusChange={onStatusChange}
                  onLevelChange={onLevelChange}
                  onAssignTech={onAssignTech}
                  onAddComment={onAddComment}
                  onCloseTicket={onCloseTicket}
                  availableTechnicians={availableTechnicians}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
