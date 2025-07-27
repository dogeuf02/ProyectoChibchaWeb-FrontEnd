import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import EmployeeList from "../components/EmployeeList";
import ConfirmDialog from "../components/ConfirmDialog";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";

export default function AdminManageEmployees() {
  useScrollToTop();
  const { showAlert } = useGlobalAlert();
  const [employees, setEmployees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setEmployees([
      { id: "EMP001", firstName: "Carlos", lastName: "Ramírez", position: "Support", phone: "3214567890", email: "carlos@example.com", createdAt: "2023-06-10" },
      { id: "EMP002", firstName: "Ana", lastName: "Gómez", position: "Manager", phone: "3219876543", email: "sad", createdAt: "2023-06-10" },
      { id: "EMP003", firstName: "Luis", lastName: "Pérez", position: "Developer", phone: "3211234567", email: "pianadsgkj@agmasdk", createdAt: "2023-06-10" },

    ]);
  }, []);

  const handleRequestDelete = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    setEmployees(prev => prev.filter(emp => emp.id !== selectedId));
    setOpenDialog(false);
    setSelectedId(null);
    showAlert("Employee deleted successfully", "success");

  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>Manage Employees</Typography>

      <EmployeeList
        employees={employees}
        onRequestDelete={handleRequestDelete}
      />

      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        confirmText="Confirm Delete"
      />
    </Box>
  );
}
