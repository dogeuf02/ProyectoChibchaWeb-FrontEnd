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

function Row({ distributorRequest, onRequestAccept, onRequestDeny }) {
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
            {distributorRequest.company_name}
          </Typography>
        </TableCell>
        <TableCell>{distributorRequest.email}</TableCell>
        <TableCell>{distributorRequest.status}</TableCell>
        <TableCell>{distributorRequest.role}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={6} sx={{ bgcolor: '#fafafa', p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom color="text.primary">
                Request Details
              </Typography>
              <Typography variant="body2">Distributor ID: {distributorRequest.distributor_id}</Typography>
              <Typography variant="body2">Document Type: {distributorRequest.company_document_type}</Typography>
              <Typography variant="body2">Document Number: {distributorRequest.company_document_number}</Typography>
              <Typography variant="body2">Company Address: {distributorRequest.company_address}</Typography>

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => onRequestAccept(distributorRequest.distributor_id)}
                >
                  Accept
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => onRequestDeny(distributorRequest.distributor_id)}
                >
                  Deny
                </Button>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function RegisterDistributorRequestsList({ requests, onRequestAccept, onRequestDeny }) {
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
            {(requests || [])
              .filter(req => req.distributor_id?.toString().includes(searchId))
              .map((req) => (
                <Row
                  key={req.distributor_id}
                  distributorRequest={req}
                  onRequestAccept={onRequestAccept}
                  onRequestDeny={onRequestDeny}
                />
              ))
            }
          </TableBody>

        </Table>
      </TableContainer>
    </>
  );
}
