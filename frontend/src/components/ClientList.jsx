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
  InputAdornment
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function Row({ client, onRequestDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover sx={{ '& td': { borderColor: '#e0e0e0' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography sx={{ fontWeight: 500 }}>
            {client.nombre} {client.apellido}
          </Typography>
        </TableCell>
        <TableCell>{client.correo}</TableCell>
        <TableCell>{client.estado}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={6} sx={{ bgcolor: '#fafafa', p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom color="text.primary">
                Client Details
              </Typography>
              <Typography variant="body2">Client ID: {client.id_cliente}</Typography>
              <Typography variant="body2">Phone: {client.telefono}</Typography>
              <Typography variant="body2">Birth Date: {client.fechaNacimientoCliente}</Typography>

              {onRequestDelete && client.estado === "ACTIVO" && (
                <Button
                  variant="contained"
                  color="error"
                  sx={{ mt: 2 }}
                  onClick={() => onRequestDelete(client.id_cliente)}
                >
                  Delete client
                </Button>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function ClientList({ clients, onRequestDelete }) {
  const [searchId, setSearchId] = useState('');

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
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
            <TableRow sx={{ bgcolor: '#fff3e0' }}>
              <TableCell />
              <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(clients || [])
              .filter(c => c.id_cliente?.toString().toLowerCase().includes(searchId.toLowerCase()))
              .map((client) => (
                <Row
                  key={client.id_cliente}
                  client={client}
                  onRequestDelete={onRequestDelete}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
