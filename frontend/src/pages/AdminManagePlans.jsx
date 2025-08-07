// src/pages/AdminManageDomains.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Box, Typography, Button, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, Paper, IconButton
} from "@mui/material";
import { useGlobalAlert } from "../context/AlertContext";
import { useGlobalLoading } from "../context/LoadingContext";
import { getPlansInfo } from "../api/planApi";
import { useTranslation } from "react-i18next";

export default function AdminManagePlans() {
  const { showAlert } = useGlobalAlert();
  const { showLoader, hideLoader } = useGlobalLoading();
  const { t } = useTranslation();

  const [rows, setRows] = useState([]);

  const load = async () => {
    try {
      showLoader();
      const res = await getPlansInfo();
      if (!res.exito) {
        showAlert(res.mensaje || t("adminPlans.loadError"), "error");
        return;
      }
      const adapted = (res.data || []).map((item) => ({
        id: item.id,
        price: Number(item.precio),
        planId: item.planCliente?.idPlanCliente,
        planName: item.planCliente?.nombrePlanCliente,
        websites: item.planCliente?.numeroWebs,
        databases: item.planCliente?.numeroBaseDatos,
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
      showAlert(t("adminPlans.loadError"), "error");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    load();
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

  const yesNo = (v) => (v ? t("adminPlans.yes") : t("adminPlans.no"));

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", m: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {t("adminPlans.title")}
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#fff3e0" }}>
              <TableCell><b>#</b></TableCell>
              <TableCell><b>{t("adminPlans.plan")}</b></TableCell>
              <TableCell><b>{t("adminPlans.interval")}</b></TableCell>
              <TableCell><b>{t("adminPlans.price")}</b></TableCell>
              <TableCell><b>{t("adminPlans.websites")}</b></TableCell>
              <TableCell><b>{t("adminPlans.databases")}</b></TableCell>
              <TableCell><b>{t("adminPlans.storage")}</b></TableCell>
              <TableCell><b>{t("adminPlans.emailAccounts")}</b></TableCell>
              <TableCell><b>{t("adminPlans.siteBuilder")}</b></TableCell>
              <TableCell><b>{t("adminPlans.sslCerts")}</b></TableCell>
              <TableCell><b>{t("adminPlans.emailMarketing")}</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  {t("adminPlans.noData")}
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
                  <TableCell>{r.databases ?? t("adminPlans.unlimited")}</TableCell>
                  <TableCell>{r.storageGb}</TableCell>
                  <TableCell>{r.emailAccounts}</TableCell>
                  <TableCell>{yesNo(r.siteBuilder)}</TableCell>
                  <TableCell>{r.sslCerts}</TableCell>
                  <TableCell>{yesNo(r.emailMarketing)}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" disabled />
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
