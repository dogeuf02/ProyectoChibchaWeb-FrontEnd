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

function Row({ distributor, onRequestDelete }) {
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
            {distributor.company_name}
          </Typography>
        </TableCell>
        <TableCell>{distributor.email}</TableCell>
        <TableCell>{distributor.status}</TableCell>
        <TableCell>{distributor.role}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={6} sx={{ bgcolor: '#fafafa', p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom color="text.primary">
                Details
              </Typography>
              <Typography variant="body2">Distributor ID: {distributor.distributor_id}</Typography>
              <Typography variant="body2">Document Type: {distributor.company_document_type}</Typography>
              <Typography variant="body2">Document Number: {distributor.company_document_number}</Typography>
              <Typography variant="body2">Company Address: {distributor.company_address}</Typography>

              {distributor.status === "ACTIVO" && (
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
                  onClick={() => onRequestDelete(distributor.distributor_id)}
                >
                  Delete distributor
                </Button>
              )}

            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function DistributorsList({ distributors, onRequestDelete }) {
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
              <TableCell sx={{ fontWeight: 'bold' }}>Company Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {distributors
              .filter(dist => dist.distributor_id?.toString().includes(searchId))
              .map((dist) => (
                <Row key={dist.distributor_id} distributor={dist} onRequestDelete={onRequestDelete} />
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
