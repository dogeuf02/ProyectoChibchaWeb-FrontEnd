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

function Row({ client, onRequestDelete, onRequestEdit }) {

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
                {t('clientManagement.list.details')}
              </Typography>
              <Typography variant="body2">{t('clientManagement.list.id')}: {client.id_cliente}</Typography>
              <Typography variant="body2">{t('clientManagement.list.phone')}: {client.telefono}</Typography>
              <Typography variant="body2">{t('clientManagement.list.birthdate')}: {client.fechaNacimientoCliente}</Typography>

              {(onRequestDelete && client.estado === "ACTIVO") && (
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#FF6300",
                      borderRadius: 30,
                      color: "#FAFAFA",
                      "&:hover": {
                        backgroundColor: "#FFBE02",
                        color: "#212121",
                      },
                    }}
                    onClick={() => onRequestEdit(client)}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ borderRadius: 30 }}
                    onClick={() => onRequestDelete(client.id_cliente)}
                  >
                    {t('clientManagement.deleteDialog.title')}
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

export default function ClientList({ clients, onRequestDelete, onRequestEdit }) {
  const [searchId, setSearchId] = useState('');
  const { t } = useTranslation();
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder={t('clientManagement.list.searchField')}
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
              <TableCell sx={{ fontWeight: 'bold' }}>{t('clientManagement.list.fullName')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('clientManagement.list.email')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('clientManagement.list.status')}</TableCell>
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
                  onRequestEdit={onRequestEdit}
                />

              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
