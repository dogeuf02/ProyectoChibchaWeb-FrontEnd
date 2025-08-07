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

function Row({ admin, onRequestDelete }) {
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
            {admin.nombre} {admin.apellido}
          </Typography>
        </TableCell>
        <TableCell>{admin.correo}</TableCell>
        <TableCell>{admin.estado}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={6} sx={{ bgcolor: '#fafafa', p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom color="text.primary">
                {t("administratorManagement.list.details")}
              </Typography>
              <Typography variant="body2">{t("administratorManagement.list.id")}: {admin.id}</Typography>
              <Typography variant="body2">{t("administratorManagement.list.email")}: {admin.correo}</Typography>
              <Typography variant="body2">{t("administratorManagement.list.birthdate")}: {admin.fecha_nacimiento}</Typography>
              <Typography variant="body2">{t("administratorManagement.list.status")}: {admin.estado}</Typography>

              <Button
                variant="contained"
                color="error"
                sx={{
                  mt: 2,
                  backgroundColor: '#FF3D00',
                  borderRadius: 30,
                  ':hover': {
                    backgroundColor: '#FFBE02',
                    color: '#212121',
                  },
                }}
                onClick={() => onRequestDelete(admin)}
              >
                {t("administratorManagement.list.deleteButton")}
              </Button>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function AdministratorList({ admins, onRequestDelete }) {
  const { t } = useTranslation();
  const [searchId, setSearchId] = useState('');

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder={t("administratorManagement.list.searchField")}
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
              <TableCell sx={{ fontWeight: 'bold' }}>{t("administratorManagement.list.fullName")}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t("administratorManagement.list.email")}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t("administratorManagement.list.status")}</TableCell>
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
