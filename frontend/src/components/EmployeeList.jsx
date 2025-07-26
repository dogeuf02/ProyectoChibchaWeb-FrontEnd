import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Collapse,
  Box, Typography, IconButton, Button
} from "@mui/material";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function Row({ employee, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        hover
        sx={{ '& td': { borderColor: '#e0e0e0' } }}
      >
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography sx={{ fontWeight: 500 }}>{employee.firstName} {employee.lastName}</Typography>
        </TableCell>
        <TableCell>{employee.position}</TableCell>
        <TableCell>{employee.phone}</TableCell>
        <TableCell>{employee.email}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={6} sx={{ bgcolor: '#fafafa', p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom color="text.primary">
                Details
              </Typography>
              <Typography variant="body2">ID: {employee.id}</Typography>
              <Typography variant="body2">Created at: {employee.createdAt}</Typography>
              <Button
                variant="contained"
                color="error"
                sx={{
                  mt: 2,
                  backgroundColor: '#f04507ff',
                  ':hover': {
                    backgroundColor: '#FFBE02',
                    color: '#212121'
                  }
                }}
                onClick={() => onDelete(employee.id)}
              >
                Delete employee
              </Button>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function EmployeeList({ employees, onDelete }) {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#fff3e0' }}>
            <TableCell />
            <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Position</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((emp) => (
            <Row key={emp.id} employee={emp} onDelete={onDelete} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
