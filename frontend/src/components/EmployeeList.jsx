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

function Row({ employee, onRequestDelete, onRequestEdit }) {


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
            {employee.firstName} {employee.lastName}
          </Typography>
        </TableCell>
        <TableCell>{employee.position}</TableCell>
        <TableCell>{employee.email}</TableCell>
        <TableCell>{employee.estado}</TableCell>

      </TableRow>

      <TableRow>
        <TableCell colSpan={6} sx={{ bgcolor: '#fafafa', p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom color="text.primary">
                Details
              </Typography>

              <Typography variant="body2">ID: {employee.id}</Typography>


              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#FF6300",
                    borderRadius: 30,
                    "&:hover": { backgroundColor: "#FFBE02", color: "#212121" },
                  }}
                  onClick={() => onRequestEdit(employee)}
                >
                  Edit Profile
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  sx={{ borderRadius: 30 }}
                  onClick={() => onRequestDelete(employee.id)}
                >
                  Delete Employee
                </Button>
              </Box>
            </Box>
          </Collapse>

        </TableCell>
      </TableRow>
    </>
  );
}

export default function EmployeeList({ employees, onRequestDelete, onRequestEdit }) {
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
          sx={{ width: 250 }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#fff3e0' }}>
              <TableCell />
              <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Position</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {employees
              .filter(emp => {
                if (!searchId) return true;
                return emp.id?.toString().includes(searchId);
              }).map(emp => (
                <Row
                  key={emp.id}
                  employee={emp}
                  onRequestDelete={onRequestDelete}
                  onRequestEdit={onRequestEdit}
                />
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
