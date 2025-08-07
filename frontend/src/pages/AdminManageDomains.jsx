// src/pages/AdminManageDomains.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Box, Typography, Button, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, Paper, IconButton
} from "@mui/material";
import { useGlobalAlert } from "../context/AlertContext";
import { useGlobalLoading } from "../context/LoadingContext";
import { getPlansInfo } from "../api/planApi";

export default function AdminManageDomains() {
  const { showAlert } = useGlobalAlert();
  const { showLoader, hideLoader } = useGlobalLoading();

  const [rows, setRows] = useState([]);

  const load = async () => {
    try {
      showLoader();
      const res = await getPlansInfo();
      if (!res.exito) {
        showAlert(res.mensaje || "Failed to load plans info", "error");
        return;
      }
      const adapted = (res.data || []).map((item) => ({
        id: item.id, // precio_plan id (PK)
        price: Number(item.precio),
        planId: item.planCliente?.idPlanCliente,
        planName: item.planCliente?.nombrePlanCliente,
        websites: item.planCliente?.numeroWebs,
        databases: item.planCliente?.numeroBaseDatos, // may be null if unlimited
        storageGb: item.planCliente?.almacenamientoNvme,
        emailAccounts: item.planCliente?.numeroCuentasCorreo,
        siteBuilder: Boolean(item.planCliente?.creadorWeb),
        sslCerts: item.planCliente?.numeroCertificadoSslHttps,
        emailMarketing: Boolean(item.planCliente?.emailMarketing),
        payPlanId: item.planPago?.idPlanPago,
        interval: item.planPago?.intervaloPago,
      }));
      setRows(adapted);
    } catch (e) {
      showAlert("Error loading plans info", "error");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fmt = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }),
    []
  );

  const yesNo = (v) => (v ? "Yes" : "No");

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", m: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Plans & Prices
        </Typography>


      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#fff3e0" }}>
              <TableCell><b>#</b></TableCell>
              <TableCell><b>Plan</b></TableCell>
              <TableCell><b>Interval</b></TableCell>
              <TableCell><b>Price</b></TableCell>
              <TableCell><b>Websites</b></TableCell>
              <TableCell><b>Databases</b></TableCell>
              <TableCell><b>Storage (GB NVMe)</b></TableCell>
              <TableCell><b>Email Accounts</b></TableCell>
              <TableCell><b>Site Builder</b></TableCell>
              <TableCell><b>SSL Certs</b></TableCell>
              <TableCell><b>Email Marketing</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No plan info yet
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.planName}</TableCell>
                  <TableCell>{r.interval}</TableCell>
                  <TableCell>{fmt.format(r.price || 0)}</TableCell>
                  <TableCell>{r.websites}</TableCell>
                  <TableCell>{r.databases ?? "Unlimited"}</TableCell>
                  <TableCell>{r.storageGb}</TableCell>
                  <TableCell>{r.emailAccounts}</TableCell>
                  <TableCell>{yesNo(r.siteBuilder)}</TableCell>
                  <TableCell>{r.sslCerts}</TableCell>
                  <TableCell>{yesNo(r.emailMarketing)}</TableCell>
                  <TableCell align="right">
                    {/* Placeholder for future edit/delete hooks if your API supports it */}
                    <IconButton size="small" disabled>
                      {/* actions would go here */}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
