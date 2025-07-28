import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import RegisterDistributorRequestsList from "../components/RegisterDistributorRequestsList";
import ConfirmDialog from "../components/ConfirmDialog";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function AdminManageDistributorRequests() {
  useScrollToTop();
  const { showAlert } = useGlobalAlert();

  const [distributors, setDistributors] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);


  useEffect(() => {
    setDistributors([
      {
        distributor_id: "DIST001",
        role: "Distributor",
        email: "empresa1@example.com",
        status: "Pending",
        company_document_type: "NIT",
        company_document_number: "900123456",
        company_name: "Distribuciones XYZ",
        company_address: "Calle 123 #45-67",
      },
      {
        distributor_id: "DIST002",
        role: "Distributor",
        email: "ventas@logistimax.com",
        status: "Pending",
        company_document_type: "CUIT",
        company_document_number: "20456789012",
        company_name: "LogistiMax",
        company_address: "Av. Siempre Viva 742",
      },
      {
        distributor_id: "DIST003",
        role: "Distributor",
        email: "contacto@distribureal.com",
        status: "Pending",
        company_document_type: "RUC",
        company_document_number: "10458963245",
        company_name: "DistribuReal SAC",
        company_address: "Carrera 8 #12-34",
      },
      {
        distributor_id: "DIST004",
        role: "Distributor",
        email: "info@andescorp.com",
        status: "Pending",
        company_document_type: "NIT",
        company_document_number: "901245678",
        company_name: "AndesCorp",
        company_address: "Cra 7 #56-78",
      },
      {
        distributor_id: "DIST005",
        role: "Distributor",
        email: "soporte@tecmundo.net",
        status: "Pending",
        company_document_type: "RIF",
        company_document_number: "J123456789",
        company_name: "TecMundo C.A.",
        company_address: "Zona Industrial, Calle 10",
      },
      {
        distributor_id: "DIST006",
        role: "Distributor",
        email: "ventas@alfaentregas.com",
        status: "Pending",
        company_document_type: "CPF_CNPJ",
        company_document_number: "12.345.678/0001-90",
        company_name: "Alfa Entregas",
        company_address: "Rua das Flores 100",
      },
      {
        distributor_id: "DIST007",
        role: "Distributor",
        email: "admin@fastmove.co",
        status: "Pending",
        company_document_type: "PASSPORT",
        company_document_number: "P20240987",
        company_name: "FastMove Intl",
        company_address: "Global Street 999",
      },
      {
        distributor_id: "DIST008",
        role: "Distributor",
        email: "servicio@neogistics.com",
        status: "Pending",
        company_document_type: "TIN",
        company_document_number: "TX10203948",
        company_name: "NeoGistics",
        company_address: "Loop Road 45",
      },
      {
        distributor_id: "DIST009",
        role: "Distributor",
        email: "gerencia@solucioneslog.com",
        status: "Pending",
        company_document_type: "OTHER",
        company_document_number: "X000111222",
        company_name: "SolucionesLog",
        company_address: "Av. Central #22-10",
      },
      {
        distributor_id: "DIST010",
        role: "Distributor",
        email: "contact@deliveryhub.org",
        status: "Pending",
        company_document_type: "BUSINESS_ID",
        company_document_number: "BI88776655",
        company_name: "DeliveryHub",
        company_address: "Main Street 101",
      }
    ]);
  }, []);


  const handleRequestAccept = (id) => {
    setDistributors(prev =>
      prev.map(dist =>
        dist.distributor_id === id ? { ...dist, status: "Approved" } : dist
      )
    );
    showAlert("Distributor request approved", "success");
  };

  const handleRequestDeny = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmDeny = () => {
    setDistributors(prev =>
      prev.map(dist =>
        dist.distributor_id === selectedId ? { ...dist, status: "Denied" } : dist
      )
    );
    setOpenDialog(false);
    setSelectedId(null);
    showAlert("Distributor request denied", "info");
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212121" }}>
          Apply as Distributor requests
        </Typography>
      </Box>

<RegisterDistributorRequestsList
  requests={distributors} // este valor debe ser un array
  onRequestAccept={handleRequestAccept}
  onRequestDeny={handleRequestDeny}
/>


      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDeny}
        title="Deny Registration Request"
        message="Are you sure you want to deny this registration request? This action cannot be undone."
        confirmText="Confirm Denial"
      />
    </Box>
  );
}