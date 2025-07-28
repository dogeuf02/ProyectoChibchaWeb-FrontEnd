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

function Row({ admin, onRequestDelete }) {
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
            {admin.nombre} {admin.apellido}
          </Typography>
        </TableCell>
        <TableCell>{admin.correo}</TableCell>
        <TableCell>{admin.estado}</TableCell>
        <TableCell>{admin.rol}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={6} sx={{ bgcolor: '#fafafa', p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom color="text.primary">
                Administrator Details
              </Typography>
              <Typography variant="body2">ID: {admin.id}</Typography>
              <Typography variant="body2">Birthdate: {admin.fecha_nacimiento}</Typography>

              <Button
                variant="contained"
                color="error"
                sx={{
                  mt: 2,
                  ':hover': {
                    backgroundColor: '#FFBE02',
                    color: '#212121',
                  },
                }}
                onClick={() => onRequestDelete(admin.id)}
              >
                Delete administrator
              </Button>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}


export default function AdministratorList({ admins, onRequestDelete }) {
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
              <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins
              .filter(admin => admin.id?.toString().toLowerCase().includes(searchId.toLowerCase()))
              .map((admin) => (
                <Row key={admin.id} admin={admin} onRequestDelete={onRequestDelete} />
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
