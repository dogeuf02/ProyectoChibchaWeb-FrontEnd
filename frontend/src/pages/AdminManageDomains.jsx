import { useState } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useGlobalAlert } from "../context/AlertContext";
import { useTranslation } from "react-i18next";

export default function DomainsAdminPage() {
  const { showAlert } = useGlobalAlert();
  const { t } = useTranslation();

  const [domains, setDomains] = useState([
    { id: 1, name: "Commercial", tld: ".com", price: 12 },
    { id: 2, name: "Network", tld: ".net", price: 10 },
    { id: 3, name: "Organization", tld: ".org", price: 9 },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editDomain, setEditDomain] = useState(null);

  const handleOpenDialog = (domain = null) => {
    setEditDomain(domain || { id: null, name: "", tld: "", price: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditDomain(null);
  };

  const handleSaveDomain = () => {
    if (!editDomain.name || !editDomain.tld || !editDomain.price) {
      showAlert(t("domainsManagement.alerts.requiredFields"), "warning");
      return;
    }

    const normalizedDomain = {
      ...editDomain,
      tld: editDomain.tld.startsWith(".") ? editDomain.tld : `.${editDomain.tld}`,
      price: parseFloat(editDomain.price),
    };

    if (normalizedDomain.id) {
      setDomains((prev) =>
        prev.map((d) => (d.id === normalizedDomain.id ? normalizedDomain : d))
      );
      showAlert(t("domainsManagement.alerts.updated"), "success");
    } else {
      const newDomain = { ...normalizedDomain, id: Date.now() };
      setDomains((prev) => [...prev, newDomain]);
      showAlert(t("domainsManagement.alerts.added"), "success");
    }

    handleCloseDialog();
  };

  const handleDeleteDomain = (id) => {
    setDomains((prev) => prev.filter((d) => d.id !== id));
    showAlert(t("domainsManagement.alerts.deleted"), "info");
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          m: 6,
        }}
      >
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
              <TableCell sx={{ width: "20%" }}><b>ID</b></TableCell>
              <TableCell sx={{ width: "20%" }}><b>{t("domainsManagement.list.name")}</b></TableCell>
              <TableCell sx={{ width: "20%" }}><b>{t("domainsManagement.list.tld")}</b></TableCell>
              <TableCell sx={{ width: "20%" }}><b>{t("domainsManagement.list.price")}</b></TableCell>
              <TableCell sx={{ width: "20%" }} align="right"><b>{t("domainsManagement.list.actions")}</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {domains.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  {t("domainsManagement.list.empty")}
                </TableCell>
              </TableRow>
            ) : (
              domains.map((domain) => (
                <TableRow key={domain.id} hover>
                  <TableCell sx={{ width: "20%" }}>{domain.id}</TableCell>
                  <TableCell sx={{ width: "20%" }}>{domain.name}</TableCell>
                  <TableCell sx={{ width: "20%" }}>{domain.tld}</TableCell>
                  <TableCell sx={{ width: "20%" }}>${domain.price}</TableCell>
                  <TableCell sx={{ width: "20%" }} align="right">
                    <IconButton color="primary" onClick={() => handleOpenDialog(domain)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteDomain(domain.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Add/Edit */}
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
            onChange={(e) => setEditDomain((prev) => ({ ...prev, name: e.target.value }))}
          />
          <TextField
            margin="normal"
            label={t("domainsManagement.dialog.tldField")}
            fullWidth
            value={editDomain?.tld || ""}
            onChange={(e) => setEditDomain((prev) => ({ ...prev, tld: e.target.value }))}
          />
          <TextField
            margin="normal"
            label={t("domainsManagement.dialog.priceField")}
            type="number"
            fullWidth
            value={editDomain?.price || ""}
            onChange={(e) => setEditDomain((prev) => ({ ...prev, price: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined" sx={{ borderRadius: 30 }}>
            {t("domainsManagement.dialog.cancelButton")}
          </Button>
          <Button
            onClick={handleSaveDomain}
            variant="contained"
            sx={{ borderRadius: 30, bgcolor: "#FF6400", "&:hover": { bgcolor: "#FFBE02" } }}
          >
            {t("domainsManagement.dialog.saveButton")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
