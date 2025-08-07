import React, { useState, useEffect } from "react";
import EmployeeList from "../components/EmployeeList";
import ConfirmDialog from "../components/ConfirmDialog";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Box, Typography, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { createEmployee, getEmployees, deactivateUser } from '../api/employeeApi';
import { updateEmployeeProfile } from "../api/userApi";
import EditUserDialog from "../components/EditUserDialog";
import { useTranslation } from "react-i18next";

export default function AdminManageEmployees() {
  useScrollToTop();

  const [editEmployee, setEditEmployee] = useState(null);
  const { t } = useTranslation();
  const { showAlert } = useGlobalAlert();
  const [employees, setEmployees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const employeeFields = [
    { name: "firstName", label: "First Name" },
    { name: "lastName", label: "Last Name" },
    { name: "position", label: "Position" },
    { name: "email", label: "Email" }
  ];
  const positionOptions = [
    "Tecnico nv 1",
    "Tecnico nv 2",
    "Tecnico nv 3",
    "Coordinador nv 1",
    "Coordinador nv 2",
    "Coordinador nv 3"
  ];
  
  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await getEmployees();
      if (response.exito) {
        setEmployees(response.empleados);
      } else {
        showAlert(response.mensaje || "Error loading employees", "error");
      }
    };

    fetchEmployees();
  }, []);


  const handleRequestDelete = async (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    const employeeToDelete = employees.find(c => c.id === selectedId);

    if (!employeeToDelete) {
      showAlert("Client not found", "error");
      setOpenDialog(false);
      return;
    }
    console.log(employeeToDelete.email)

    try {
      const result = await deactivateUser(employeeToDelete.email);

      if (result.exito) {
        showAlert("Employee deactivated successfully", "success");
        const updated = await getEmployees();
        if (updated.exito) {
          setEmployees(updated.empleados);
        }
      } else {
        showAlert(result.mensaje || "Failed to deactivate employee", "error");
      }

    } catch (error) {
      console.error("❌ Error al desactivar usuario:", error);
      showAlert("Unexpected error during deactivation", "error");
    } finally {
      setOpenDialog(false);
      setSelectedId(null);
    }
  };


  const handleAddEmployee = async () => {
    const requiredFields = ['firstName', 'lastName', 'position', 'email'];

    const friendlyNames = {
      firstName: 'First Name',
      lastName: 'Last Name',
      position: 'Position',
      email: 'Email',
    };



    // Validación de campos
    for (const field of requiredFields) {
      if (!newEmployee[field] || newEmployee[field].trim() === '') {
        showAlert(`The field "${friendlyNames[field]}" is required.`, 'warning');
        return;
      }
    }

    try {
      // Construir objeto para enviar al backend
      const employee = {
        nombreEmpleado: newEmployee.firstName,
        apellidoEmpleado: newEmployee.lastName,
        cargoEmpleado: newEmployee.position,
        correo: newEmployee.email,
        contrasena: "employee@123" // temporalmente
      };

      const response = await createEmployee(employee);
      console.log("🔍 Respuesta al crear empleado:", response);

      if (response.exito) {
        // Obtener la lista actualizada
        const updated = await getEmployees();
        console.log("🔄 Lista actualizada de empleados:", updated);

        if (updated.exito && Array.isArray(updated.empleados)) {
          setEmployees(updated.empleados);
          showAlert("Employee added successfully", "success");
        } else {
          showAlert("Failed to refresh employee list", "warning");
          console.warn("⚠️ Error al actualizar lista de empleados:", updated);
        }

        // Limpiar formulario y cerrar modal
        setOpenForm(false);
        setNewEmployee({
          firstName: "",
          lastName: "",
          position: "",
          email: "",
        });
      } else {
        showAlert(response.mensaje || "Error adding employee", "error");
      }
    } catch (error) {
      console.error("Unexpected error creating employee:", error);
      showAlert("Unexpected error adding employee", "error");
    }
  };

  const handleRequestEdit = (employee) => {
    setEditEmployee({
      id: employee.id,
      firstName: employee.firstName || employee.nombreEmpleado,
      lastName: employee.lastName || employee.apellidoEmpleado,
      position: employee.position || employee.cargoEmpleado,
      email: employee.email
    });
  };

  const handleEditChange = (field, value) => {
    setEditEmployee((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    if (!editEmployee) return;

    const res = await updateEmployeeProfile(editEmployee.id, {
      nombreEmpleado: editEmployee.firstName,
      apellidoEmpleado: editEmployee.lastName,
      cargoEmpleado: editEmployee.position,
    });

    if (res?.status === 200 || res?.exito) {
      showAlert("Employee updated successfully", "success");
      const updated = await getEmployees();
      if (updated.exito) {
        setEmployees(updated.empleados);
      }
      setEditEmployee(null);
    } else {
      showAlert("Failed to update employee", "error");
    }
  };


  const [openForm, setOpenForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({

    firstName: "",
    lastName: "",
    position: "",
    email: "",
  });


  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 10 }}>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212121" }}>
          {t('employeeManagement.title')}
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
          sx={{
            backgroundColor: "#FF6300",
            color: "#FAFAFA",
            borderRadius: 30,
            "&:hover": {
              backgroundColor: "#e65c00",
            },
          }}
        >
          {t('employeeManagement.addEmployeeButton')}
        </Button>
      </Box>

      <EmployeeList
        employees={employees}
        onRequestDelete={handleRequestDelete}
        onRequestEdit={handleRequestEdit}
      />


      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title={t('employeeManagement.deleteDialog.title')}
        message={t('employeeManagement.deleteDialog.message')}
        confirmText={t('employeeManagement.deleteDialog.confirmText')}
      />

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth>
        <DialogTitle>{t('employeeManagement.addEmployeeDialog.title')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>

            <TextField
              label={t('employeeManagement.addEmployeeDialog.firstNameField')}
              value={newEmployee.firstName}
              onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('employeeManagement.addEmployeeDialog.lastnameField')}
              value={newEmployee.lastName}
              onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
              fullWidth
            />
            <TextField
              select
              label={t('employeeManagement.addEmployeeDialog.positionField')}
              value={newEmployee.position}
              onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              fullWidth
            >
              {positionOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label={t('employeeManagement.addEmployeeDialog.emailField')}
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenForm(false)}
            sx={{ color: "#212121" }}
          >
            {t('employeeManagement.addEmployeeDialog.cancelButton')}
          </Button>
          <Button
            onClick={handleAddEmployee}
            variant="contained"
            sx={{ backgroundColor: "#FF6300", color: "#FAFAFA", borderRadius: 30, "&:hover": { backgroundColor: "#e65c00" } }}
          >
            {t('employeeManagement.addEmployeeDialog.saveButton')}
          </Button>
        </DialogActions>
      </Dialog>
      <EditUserDialog
        open={!!editEmployee}
        onClose={() => setEditEmployee(null)}
        onSave={handleSaveEdit}
        userData={editEmployee || {}}
        onChange={handleEditChange}
        fields={employeeFields}
        extraOptions={{ positionOptions }}
        isEditMode={true}
      />


    </Box>
  );

}
