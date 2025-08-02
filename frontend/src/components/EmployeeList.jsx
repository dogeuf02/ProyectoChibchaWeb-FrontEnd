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
import { useTranslation } from "react-i18next";

function Row({ employee, onRequestDelete }) {

  const { t } = useTranslation();
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
                {t('employeeManagement.list.details')}
              </Typography>
              <Typography variant="body2">ID: {employee.id}</Typography>
              {onRequestDelete && employee.estado === "ACTIVO" && (
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
                  onClick={() => onRequestDelete(employee.id)}
                >
                  {t('employeeManagement.deleteDialog.title')}
                </Button>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function EmployeeList({ employees, onRequestDelete }) {
  const { t } = useTranslation();
  const [searchId, setSearchId] = useState('');

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder={t('employeeManagement.list.searchField')}
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
              <TableCell sx={{ fontWeight: 'bold' }}>{t('employeeManagement.list.fullName')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('employeeManagement.list.position')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('employeeManagement.list.email')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('employeeManagement.list.status')}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {employees
              .filter(emp => {
                if (!searchId) return true;
                return emp.id?.toString().includes(searchId);
              }).map(emp => (
                <Row key={emp.id} employee={emp} onRequestDelete={onRequestDelete} />
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
