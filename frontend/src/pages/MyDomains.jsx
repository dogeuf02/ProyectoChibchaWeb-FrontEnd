import React from "react";
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
} from "@mui/material";

export default function MyDomainsPage() {
  const domains = [
    { id: 1, name: "chibchaweb", tld: ".com", status: "active" },
    { id: 2, name: "tiendachibcha", tld: ".store", status: "expired" },
    { id: 3, name: "portafolio", tld: ".dev", status: "active" },
    { id: 4, name: "miempresa", tld: ".org", status: "pending" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "expired":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 10 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212121", mb: 6 }}>
        My Domains
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#fff3e0" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Domain Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>TLD</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {domains.map((domain) => (
              <TableRow key={domain.id} hover>
                <TableCell>{domain.name}</TableCell>
                <TableCell>{domain.tld}</TableCell>
                <TableCell>
                  <Chip label={domain.status} color={getStatusColor(domain.status)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
