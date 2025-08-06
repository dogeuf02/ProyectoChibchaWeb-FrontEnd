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

export default function DomainsAdminPage() {
  const { showAlert } = useGlobalAlert();

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
      showAlert("All fields are required", "warning");
      return;
    }

    const normalizedDomain = {
      ...editDomain,
      tld: editDomain.tld.startsWith(".") ? editDomain.tld : `.${editDomain.tld}`,
      price: parseFloat(editDomain.price),
    };

    if (normalizedDomain.id) {
      // Edit existing domain
      setDomains((prev) =>
        prev.map((d) => (d.id === normalizedDomain.id ? normalizedDomain : d))
      );
      showAlert("Domain updated successfully", "success");
    } else {
      // Add new domain
      const newDomain = { ...normalizedDomain, id: Date.now() };
      setDomains((prev) => [...prev, newDomain]);
      showAlert("Domain added successfully", "success");
    }

    handleCloseDialog();
  };

  const handleDeleteDomain = (id) => {
    setDomains((prev) => prev.filter((d) => d.id !== id));
    showAlert("Domain deleted successfully", "info");
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
          Manage Domains
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 30, bgcolor: "#FF6400", "&:hover": { bgcolor: "#FFBE02" } }}
        >
          Add Domain
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#fff3e0" }}>
              <TableCell sx={{ width: "20%" }}><b>ID</b></TableCell>
              <TableCell sx={{ width: "20%" }}><b>Name</b></TableCell>
              <TableCell sx={{ width: "20%" }}><b>TLD</b></TableCell>
              <TableCell sx={{ width: "20%" }}><b>Price (USD/year)</b></TableCell>
              <TableCell sx={{ width: "20%" }} align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {domains.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No domains available. Click "Add Domain" to create one.
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
        <DialogTitle>{editDomain?.id ? "Edit Domain" : "Add Domain"}</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="normal"
            label="Name"
            fullWidth
            value={editDomain?.name || ""}
            onChange={(e) => setEditDomain((prev) => ({ ...prev, name: e.target.value }))}
          />
          <TextField
            margin="normal"
            label="TLD (e.g., .com)"
            fullWidth
            value={editDomain?.tld || ""}
            onChange={(e) => setEditDomain((prev) => ({ ...prev, tld: e.target.value }))}
          />
          <TextField
            margin="normal"
            label="Price (USD/year)"
            type="number"
            fullWidth
            value={editDomain?.price || ""}
            onChange={(e) => setEditDomain((prev) => ({ ...prev, price: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined" sx={{ borderRadius: 30 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveDomain}
            variant="contained"
            sx={{ borderRadius: 30, bgcolor: "#FF6400", "&:hover": { bgcolor: "#FFBE02" } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
