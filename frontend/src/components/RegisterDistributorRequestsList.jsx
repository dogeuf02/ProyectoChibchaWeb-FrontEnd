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

function Row({ distributorRequest, onRequestAccept, onRequestDeny }) {
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
                {t('domainRequestsManagement.list.details') }</Typography>
              <Typography variant="body2">{t('distributorRequestsManagement.list.id')}  {distributorRequest.distributor_id}</Typography>
              <Typography variant="body2">{t('distributorRequestsManagement.list.docType')} {distributorRequest.company_document_type}</Typography>
              <Typography variant="body2">{t('distributorRequestsManagement.list.docNumber')} {distributorRequest.company_document_number}</Typography>
              <Typography variant="body2">{t('distributorRequestsManagement.list.companyAddress')} {distributorRequest.company_address}</Typography>

              <Box sx={{ display: 'flex', gap: 2, mt: 2, }}>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ borderRadius: 30 }}
                  onClick={() => onRequestAccept(distributorRequest.distributor_id)}
                >
                  {t('distributorRequestsManagement.list.accept')} </Button>

                <Button
                  variant="contained"
                  color="error"
                  sx={{ borderRadius: 30 }}
                  onClick={() => onRequestDeny(distributorRequest.distributor_id)}
                >
                  {t('distributorRequestsManagement.list.deny')} </Button>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function RegisterDistributorRequestsList({ requests, onRequestAccept, onRequestDeny }) {
  const { t } = useTranslation(); 
  const [searchId, setSearchId] = useState('');

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder={t('distributorRequestsManagement.list.searchField')}
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
              <TableCell sx={{ fontWeight: 'bold' }}>{t('distributorRequestsManagement.list.companyName')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('domainRequestsManagement.list.email')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('distributorRequestsManagement.list.status')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('domainRequestsManagement.list.applicantRole')}</TableCell>
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
