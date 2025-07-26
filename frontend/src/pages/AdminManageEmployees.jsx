import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import EmployeeList from "../components/EmployeeList";

export default function AdminManageEmployees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    setEmployees([
      { id: "EMP001", firstName: "Carlos", lastName: "Ramírez", position: "Support", phone: "3214567890", email: "carlos@example.com", createdAt: "2023-06-10" },
      { id: "EMP001", firstName: "Carlos", lastName: "Ramírez", position: "Support", phone: "3214567890", email: "carlos@example.com", createdAt: "2023-06-10" },
    ]);
  }, []);

  const handleDelete = (id) => {
    const confirm = window.confirm("Delete this employee?");
    if (confirm) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 6 }}>
      <Typography variant="h5" gutterBottom>Manage Employees</Typography>
      <EmployeeList employees={employees} onDelete={handleDelete} />
    </Box>
  );
}
