// src/pages/AdminManageDomains.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useGlobalAlert } from "../context/AlertContext";
import { useGlobalLoading } from "../context/LoadingContext";
import { useTranslation } from "react-i18next";
import { getAllDomains, createDomain, updateDomain, deleteDomain } from "../api/domainApi";
import { getTlds } from "../api/tldApi";
import ConfirmDialog from "../components/ConfirmDialog";


export default function AdminManageDomains() {

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDomainId, setSelectedDomainId] = useState(null);
  const { showAlert } = useGlobalAlert();
  const { showLoader, hideLoader } = useGlobalLoading();
  const { t } = useTranslation();

  const [domains, setDomains] = useState([]);
  const [tlds, setTlds] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDomain, setEditDomain] = useState(null);


  const openDeleteDialog = (id) => {
    setSelectedDomainId(id);
    setConfirmOpen(true);
  };

  const closeDeleteDialog = () => {
    setConfirmOpen(false);
    setSelectedDomainId(null);
  };


  const currency = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }),
    []
  );

  const loadData = async () => {
    try {
      showLoader();
      const [domRes, tldRes] = await Promise.all([getAllDomains(), getTlds()]);

      const tldMap = new Map(
        (tldRes || []).map((t) => [normalizeTld(t.tld), Number(t.precioTld)])
      );

      const adapted = (domRes || []).map((d) => {
        const tldNorm = normalizeTld(d.tld);
        return {
          id: d.idDominio,
          name: d.nombreDominio,
          tld: tldNorm,
          price: Number(d.precioDominio),
          status: d.estado,
          tldPrice: tldMap.get(tldNorm) ?? null,
        };
      });

      setTlds((tldRes || []).map((t) => ({ tld: normalizeTld(t.tld), price: Number(t.precioTld) })));
      setDomains(adapted);
    } catch (e) {
      showAlert("Error loading domains/TLDs", "error");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenDialog = (domain = null) => {
    setEditDomain(
      domain || {
        id: null,
        name: "",
        tld: "",
        price: "",
        status: "",
      }
    );
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditDomain(null);
  };


  const handleConfirmDelete = async () => {
    try {
      showLoader();
      await deleteDomain(selectedDomainId);
      showAlert("Domain deleted successfully", "success");
      await loadData();
    } catch (err) {
      showAlert("Error deleting domain", "error");
    } finally {
      hideLoader();
      closeDeleteDialog();
    }
  };


  const handleSaveDomain = async () => {
    if (!editDomain.name || !editDomain.tld) {
      showAlert(t("domainsManagement.alerts.requiredFields"), "warning");
      return;
    }

    const payload = {
      nombreDominio: editDomain.name,
      tld: editDomain.tld, // mantener con el punto
      estado: "Disponible"
    };

    if (editDomain.price) {
      payload.precioDominio = parseFloat(editDomain.price).toFixed(2);
    }

    try {
      showLoader();
      if (editDomain.id) {
        await updateDomain(editDomain.id, payload);
        showAlert(t("domainsManagement.alerts.updated"), "success");
      } else {
        await createDomain(payload);
        showAlert(t("domainsManagement.alerts.added"), "success");
      }
      await loadData();
      handleCloseDialog();
    } catch (err) {
      showAlert("Error saving domain", "error");
    } finally {
      hideLoader();
    }
  };





  // Helpers
  function normalizeTld(raw) {
    if (!raw) return "";
    return raw.startsWith(".") ? raw : `.${raw}`;
  }
  function stripDot(val) {
    return val?.startsWith(".") ? val.slice(1) : val;
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", m: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {t("domainsManagement.title")}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 30, bgcolor: "#FF6400", "&:hover": { bgcolor: "#FFBE02" } }}
        >
          {t("domainsManagement.addDomainButton")}
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#fff3e0" }}>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>{t("domainsManagement.list.name")}</b></TableCell>
              <TableCell><b>{t("domainsManagement.list.tld")}</b></TableCell>
              <TableCell><b>{t("domainsManagement.list.price")}</b></TableCell>
              <TableCell><b>TLD Price</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell align="right"><b>{t("domainsManagement.list.actions")}</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {domains.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  {t("domainsManagement.list.empty")}
                </TableCell>
              </TableRow>
            ) : (
              domains.map((d) => (
                <TableRow key={d.id} hover>
                  <TableCell>{d.id}</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.tld}</TableCell>
                  <TableCell>{currency.format(d.price || 0)}</TableCell>
                  <TableCell>{d.tldPrice != null ? currency.format(d.tldPrice) : "-"}</TableCell>
                  <TableCell>{d.status}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpenDialog(d)}>
                      <EditIcon />
                    </IconButton>
                    {/* TODO: add delete API when available */}
                    <IconButton
                      color="error"
                      onClick={() => openDeleteDialog(d.id)}
                    >
                      <DeleteIcon />
                    </IconButton>

                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editDomain?.id ? t("domainsManagement.dialog.editTitle") : t("domainsManagement.dialog.addTitle")}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="normal"
            label={t("domainsManagement.dialog.nameField")}
            fullWidth
            value={editDomain?.name || ""}
            onChange={(e) => setEditDomain((p) => ({ ...p, name: e.target.value }))}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>TLD</InputLabel>
            <Select
              label="TLD"
              value={editDomain?.tld || ""}
              onChange={(e) => setEditDomain((p) => ({ ...p, tld: e.target.value }))}
            >
              {tlds.map((t) => (
                <MenuItem key={t.tld} value={t.tld}>
                  {t.tld} {t.price ? `— ${currency.format(t.price)}` : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Campo para precio opcional */}
          {/* Campo para precio: solo editable en modo edición */}
          {editDomain?.id ? (
            <TextField
              margin="normal"
              label="Domain Price"
              type="number"
              fullWidth
              value={editDomain?.price ?? ""}
              onChange={(e) => setEditDomain((p) => ({ ...p, price: e.target.value }))}
            />
          ) : (
            <TextField
              margin="normal"
              label="Domain Price (calculated automatically)"
              type="number"
              fullWidth
              value=""
              disabled
              helperText="This price will be set automatically when creating the domain."
            />
          )}

        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDialog} sx={{ borderRadius: 30 }}>
            {t("domainsManagement.dialog.cancelButton")}
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveDomain}
            sx={{ borderRadius: 30, bgcolor: "#FF6400", "&:hover": { bgcolor: "#FFBE02" } }}
          >
            {t("domainsManagement.dialog.saveButton")}
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={confirmOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this domain?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Box>

  );
}
