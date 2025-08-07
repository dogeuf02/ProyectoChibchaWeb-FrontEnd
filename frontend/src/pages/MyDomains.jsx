import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useGlobalAlert } from "../context/AlertContext";
import { getActiveDomains } from "../api/domainOwnApi";
import { useAuth } from "../context/AuthContext"
import { getRoleAndId } from "../api/userApi";
import getTodayDate from "../utils/dateUtils";
import { ROLE } from '../enum/roleEnum';
import { createTransferRequest } from "../api/transferRequest";
import { useTranslation } from "react-i18next";

export default function MyDomainsPage() {
  const { role, specificId, email } = useAuth();
  const { showAlert } = useGlobalAlert();
  const { t } = useTranslation();

  const [domains, setDomains] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [targetEmail, setTargetEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case t("myDomains.status.inUse"):
        return "success";
      case t("myDomains.status.expired"):
        return "error";
      case t("myDomains.status.pending"):
        return "warning";
      default:
        return "default";
    }
  };

  const handleTransferClick = (domain) => {
    setSelectedDomain(domain);
    setOpenDialog(true);
  };

  const handleConfirmTransfer = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(targetEmail)) {
      setEmailError(true);
      return;
    }

    if (email === targetEmail) {
      showAlert(t("myDomains.alerts.sameEmail"), "warning");
      return;
    }

    const result = await getRoleAndId(targetEmail);

    if (result && result.exito) {
      let idCliente = null;
      let idDistribuidor = null;

      if (result.data.rol === ROLE.CLIENT) {
        idCliente = result.data.id;
      } else {
        idDistribuidor = result.data.id;
      }
      const transferRequest = {
        fechaSolicitudTraslado: getTodayDate(),
        estadoTraslado: t("myDomains.status.pending"),
        pertenece: selectedDomain.idPertenece,
        cliente: idCliente,
        distribuidor: idDistribuidor,
      };

      const createResult = await createTransferRequest(transferRequest);
      if(createResult.exito){
        showAlert(t("myDomains.alerts.transferSuccess"), "success");
      }
    } else if (!result) {
      showAlert(t("myDomains.alerts.emailNotRegistered"), "error");
      return;
    } else {
      showAlert(result.mensaje, "error");
    }
    setOpenDialog(false);
    setTargetEmail("");
    setEmailError(false);
    setSelectedDomain(null);
  };

  useEffect(() => {
    const fetchDomains = async () => {
      const result = await getActiveDomains(role, specificId);
      if (result) {
        setDomains(result);
      }
    }

    fetchDomains();
  }, [role, specificId, email]);

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212121" }}>
          {t("myDomains.title")}
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <colgroup>
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
          </colgroup>

          <TableHead>
            <TableRow sx={{ bgcolor: "#fff3e0" }}>
              <TableCell sx={{ fontWeight: "bold" }}>{t("myDomains.table.domainName")}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{t("myDomains.table.tld")}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{t("myDomains.table.status")}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                {t("myDomains.table.transfer")}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {domains.map((domain) => {
              const isExpired = domain.estado === t("myDomains.status.expired");
              const isPending = domain.estado === t("myDomains.status.pending");

              return (
                <TableRow key={domain.idDominio} hover>
                  <TableCell>{domain.nombreDominio}</TableCell>
                  <TableCell>{domain.tld}</TableCell>
                  <TableCell>
                    <Chip label={domain.estado} color={getStatusColor(domain.estado)} />
                  </TableCell>
                  <TableCell align="center">
                    {isExpired ? (
                      <Button variant="contained" size="small" disabled sx={{ borderRadius: 30, bgcolor: "#BDBDBD", color: "#fff" }}>
                        {t("myDomains.actions.transfer")}
                      </Button>
                    ) : isPending ? (
                      <Chip label={t("myDomains.actions.pendingTransfer")} variant="outlined" color="warning" sx={{ fontWeight: "bold" }} />
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleTransferClick(domain)}
                        sx={{ borderRadius: 30, bgcolor: "#FF6300", color: "#fff", "&:hover": { bgcolor: "#e65c00" } }}
                      >
                        {t("myDomains.actions.transfer")}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{t("myDomains.dialog.title")}</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            {t("myDomains.dialog.instruction", {
              domain: `${selectedDomain?.name || ""}${selectedDomain?.tld || ""}`,
            })}
          </Typography>

          <TextField
            fullWidth
            label={t("myDomains.dialog.emailField")}
            type="email"
            value={targetEmail}
            onChange={(e) => { setTargetEmail(e.target.value); setEmailError(false); }}
            error={emailError}
            helperText={emailError && t("myDomains.dialog.emailError")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: "#212121", borderRadius: 30 }}>
            {t("myDomains.dialog.cancel")}
          </Button>
          <Button variant="contained" onClick={handleConfirmTransfer} sx={{ bgcolor: "#FF6300", color: "#fff", borderRadius: 30, "&:hover": { bgcolor: "#e65c00" } }}>
            {t("myDomains.dialog.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
