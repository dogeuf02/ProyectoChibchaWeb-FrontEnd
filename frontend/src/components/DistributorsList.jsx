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

function Row({ distributor, onRequestDelete, onRequestEdit }) {
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
                {t('distributorManagement.list.details')}
              </Typography>
              <Typography variant="body2">{t('distributorManagement.list.id')}: {distributor.distributor_id}</Typography>
              <Typography variant="body2">{t('distributorManagement.list.docType')}: {distributor.company_document_type}</Typography>
              <Typography variant="body2">{t('distributorManagement.list.docNumber')}: {distributor.company_document_number}</Typography>
              <Typography variant="body2">{t('distributorManagement.list.companyAddress')}: {distributor.company_address}</Typography>

              {distributor.status === "ACTIVO" && (
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#FF6300",
                      borderRadius: 30,
                      "&:hover": { backgroundColor: "#FFBE02", color: "#212121" },
                    }}
                    onClick={() => onRequestEdit(distributor)}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ borderRadius: 30 }}
                    onClick={() => onRequestDelete(distributor.distributor_id)}
                  >
                    {t('distributorManagement.deleteDialog.title')}
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

export default function DistributorsList({ distributors, onRequestDelete, onRequestEdit }) {
  const { t } = useTranslation();
  const [searchId, setSearchId] = useState('');

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder={t('distributorManagement.list.searchField')}
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
              <TableCell sx={{ fontWeight: 'bold' }}>{ t('distributorManagement.list.companyName')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{ t('distributorManagement.list.email')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{ t('distributorManagement.list.status')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{ t('distributorManagement.list.role')}</TableCell>
            </TableRow>
          </TableHead>
<TableBody>
  {distributors.length > 0 ? (
    distributors
      .filter(dist => dist.distributor_id?.toString().includes(searchId))
      .map((dist) => (
        <Row
          key={dist.distributor_id}
          distributor={dist}
          onRequestDelete={onRequestDelete}
          onRequestEdit={onRequestEdit}
        />
      ))
  ) : (
    <TableRow>
      <TableCell colSpan={6} align="center">
        No distributors found
      </TableCell>
    </TableRow>
  )}
</TableBody>

        </Table>
      </TableContainer>
    </>
  );
}
