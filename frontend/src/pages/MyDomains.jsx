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
import { getActiveDomains } from "../api/domainOwnApi";
import { useAuth } from "../context/AuthContext"
export default function MyDomainsPage() {
  const { role, specificId } = useAuth();
  const [domains, setDomains] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "En Uso":
        return "success";
      case "expired":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const handleTransferClick = (domain) => {
    setSelectedDomain(domain);
    setOpenDialog(true);
  };

  const handleConfirmTransfer = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
      return;
    }

    // Cambiar estado a pending
    setDomains((prevDomains) =>
      prevDomains.map((d) =>
        d.id === selectedDomain.id ? { ...d, status: "pending" } : d
      )
    );

    setOpenDialog(false);
    setEmail("");
    setEmailError(false);
    setSelectedDomain(null);
    alert("Transfer request sent successfully.");
  };

  useEffect(() => {
    const fetchDomains = async () => {
 
      const result = await getActiveDomains(role, specificId);
      console.log("domaData", result);
      if (result) {
        setDomains(result);
      }
    }

    fetchDomains();


  }, [role, specificId]);

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 10 }}>
      {/* Header con título alineado a la izquierda */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 6,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#212121" }}
        >
          My Domains
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          {/* Columnas uniformes */}
          <colgroup>
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
          </colgroup>

          <TableHead>
            <TableRow sx={{ bgcolor: "#fff3e0" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Domain Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>TLD</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Domain Transfer
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {domains.map((domain) => {
              const isExpired = domain.estado === "expired";
              const isPending = domain.estado === "pending";

              return (
                <TableRow key={domain.idDominio} hover>
                  <TableCell>{domain.nombreDominio}</TableCell>
                  <TableCell>{domain.tld}</TableCell>
                  <TableCell>
                    <Chip
                      label={domain.estado}
                      color={getStatusColor(domain.estado)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {isExpired ? (
                      <Button
                        variant="contained"
                        size="small"
                        disabled
                        sx={{
                          borderRadius: 30,
                          bgcolor: "#BDBDBD",
                          color: "#fff",
                        }}
                      >
                        Transfer
                      </Button>
                    ) : isPending ? (
                      <Chip
                        label="Pending Transfer"
                        variant="outlined"
                        color="warning"
                        sx={{ fontWeight: "bold" }}
                      />
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleTransferClick(domain)}
                        sx={{
                          borderRadius: 30,
                          bgcolor: "#FF6300",
                          color: "#fff",
                          "&:hover": { bgcolor: "#e65c00" },
                        }}
                      >
                        Transfer
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de transferencia */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Transfer Domain</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Enter the email of the user to transfer{" "}
            <strong>
              {selectedDomain?.name}
              {selectedDomain?.tld}
            </strong>{" "}
            to:
          </Typography>

          <TextField
            fullWidth
            label="Recipient Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(false);
            }}
            error={emailError}
            helperText={emailError && "Please enter a valid email address"}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ color: "#212121", borderRadius: 30 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmTransfer}
            sx={{
              bgcolor: "#FF6300",
              color: "#fff",
              borderRadius: 30,
              "&:hover": { bgcolor: "#e65c00" },
            }}
          >
            Confirm Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
