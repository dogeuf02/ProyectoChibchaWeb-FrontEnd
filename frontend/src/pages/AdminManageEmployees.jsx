import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import EmployeeList from "../components/EmployeeList";
import ConfirmDialog from "../components/ConfirmDialog";
import useScrollToTop from "../hooks/useScrollToTop";
import { useGlobalAlert } from "../context/AlertContext";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";


export default function AdminManageEmployees() {
  useScrollToTop();
  const { showAlert } = useGlobalAlert();
  const [employees, setEmployees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setEmployees([
     
  { id: "EMP002", firstName: "Molly", lastName: "Johnson", position: "QA Tester", phone: "2643941732", email: "dillonjoshua@hotmail.com", createdAt: "2025-02-28" },
  { id: "EMP003", firstName: "Brian", lastName: "Johnson", position: "Designer", phone: "1305982833", email: "jasonkennedy@walker.net", createdAt: "2025-05-31" },
  { id: "EMP004", firstName: "Annette", lastName: "Watts", position: "Sales", phone: "9897511196", email: "huynhpatrick@gmail.com", createdAt: "2025-02-03" },
  { id: "EMP005", firstName: "Shelley", lastName: "Wiggins", position: "Support", phone: "9113047766", email: "douglasspence@davenport.org", createdAt: "2024-08-02" },
  { id: "EMP006", firstName: "Jacob", lastName: "Cook", position: "Developer", phone: "8373481055", email: "mcneillrachel@rice-coleman.info", createdAt: "2023-10-18" },
  { id: "EMP007", firstName: "Brandi", lastName: "Wright", position: "Support", phone: "1399837995", email: "marksmith@bowman.biz", createdAt: "2024-04-04" },
  { id: "EMP008", firstName: "Steven", lastName: "Martinez", position: "Sales", phone: "3696275959", email: "claytontina@gmail.com", createdAt: "2023-12-30" },
  { id: "EMP009", firstName: "Gina", lastName: "Snyder", position: "Manager", phone: "7921075856", email: "hilltracy@cooke.biz", createdAt: "2023-10-22" },
  { id: "EMP010", firstName: "Brett", lastName: "Richards", position: "Support", phone: "1804921017", email: "freemanemily@flores.biz", createdAt: "2023-11-04" },
  { id: "EMP011", firstName: "Ryan", lastName: "Moore", position: "Developer", phone: "2091351587", email: "william84@blake.com", createdAt: "2023-08-11" },
  { id: "EMP012", firstName: "Joshua", lastName: "Williams", position: "DevOps", phone: "9916561212", email: "tracymyers@yahoo.com", createdAt: "2023-10-09" },
  { id: "EMP013", firstName: "Robert", lastName: "Henderson", position: "Developer", phone: "8039922584", email: "matthewbutler@williamson.com", createdAt: "2023-11-21" },
  { id: "EMP014", firstName: "Tammy", lastName: "Williams", position: "QA Tester", phone: "2301261724", email: "hollycarr@davidson.org", createdAt: "2024-02-18" },
  { id: "EMP015", firstName: "Earl", lastName: "Fields", position: "Sales", phone: "4372888293", email: "christineedwards@harper.com", createdAt: "2024-01-17" },
  { id: "EMP016", firstName: "James", lastName: "Young", position: "DevOps", phone: "8438373950", email: "marshallmelissa@hardy.com", createdAt: "2023-08-17" },
  { id: "EMP017", firstName: "Karen", lastName: "Sandoval", position: "Sales", phone: "5412041280", email: "alexanderrussell@gmail.com", createdAt: "2024-10-18" },
  { id: "EMP018", firstName: "Lauren", lastName: "Becker", position: "Sales", phone: "2089360296", email: "douglaswade@chan.biz", createdAt: "2025-04-01" },
  { id: "EMP019", firstName: "Lori", lastName: "Holloway", position: "QA Tester", phone: "4624268021", email: "juliamccarthy@graves.com", createdAt: "2023-08-21" },
  { id: "EMP020", firstName: "Jessica", lastName: "Davis", position: "Sales", phone: "2629340905", email: "michaelmorales@cohen.biz", createdAt: "2024-09-06" },
  { id: "EMP021", firstName: "Angela", lastName: "Jenkins", position: "Developer", phone: "3984629325", email: "youngjustin@adams-brooks.com", createdAt: "2024-07-27" },
  { id: "EMP022", firstName: "Theresa", lastName: "Doyle", position: "Support", phone: "1485795127", email: "wrightnicholas@hotmail.com", createdAt: "2023-09-27" },
  { id: "EMP023", firstName: "Melissa", lastName: "Johnson", position: "DevOps", phone: "9801183497", email: "melissawilson@taylor-brock.com", createdAt: "2024-02-27" },
  { id: "EMP024", firstName: "Chad", lastName: "Spencer", position: "Support", phone: "3802628912", email: "robertwright@alexander.info", createdAt: "2023-12-11" },
  { id: "EMP025", firstName: "Gregory", lastName: "Barnes", position: "QA Tester", phone: "9013267226", email: "wrightjason@reid.com", createdAt: "2024-05-02" },
  { id: "EMP026", firstName: "Julie", lastName: "Lopez", position: "Support", phone: "6289321348", email: "harpermatthew@franco.com", createdAt: "2024-08-16" },
  { id: "EMP027", firstName: "Samuel", lastName: "Bailey", position: "Manager", phone: "2536932097", email: "blakechristine@rodriguez.org", createdAt: "2023-07-30" },
  { id: "EMP028", firstName: "Jamie", lastName: "Martinez", position: "Manager", phone: "6379921861", email: "williamsholly@delacruz.biz", createdAt: "2023-12-28" },

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

  const handleAddEmployee = () => {
    // Validar campos vacíos
    const requiredFields = [

      'firstName',
      'lastName',
      'position',
      'phone',
      'email',
    ];

    const friendlyNames = {

      firstName: 'First Name',
      lastName: 'Last Name',
      position: 'Position',
      phone: 'Phone',
      email: 'Email',
    };

    for (const field of requiredFields) {
      if (!newEmployee[field] || newEmployee[field].trim() === '') {
        showAlert(`The field "${friendlyNames[field]}" is required.`, 'warning');
        return;
      }
    }

    // Si todo está bien, agrega el empleado
    setEmployees((prev) => [...prev, newEmployee]);
    setOpenForm(false);
    setNewEmployee({
      id: "",
      firstName: "",
      lastName: "",
      position: "",
      phone: "",
      email: "",
    });
    showAlert("Employee added successfully", "success");

  };

  const [openForm, setOpenForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({

    firstName: "",
    lastName: "",
    position: "",
    phone: "",
    email: "",
  });


  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 10 }}>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212121" }}>
          Employee Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
          sx={{
            backgroundColor: "#FF6300",
            color: "#FAFAFA",
            "&:hover": {
              backgroundColor: "#e65c00",
            },
          }}
        >
          Add Employee
        </Button>
      </Box>


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

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>

            <TextField
              label="First Name"
              value={newEmployee.firstName}
              onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={newEmployee.lastName}
              onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Position"
              value={newEmployee.position}
              onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              fullWidth
            />
            <TextField
              label="Phone"
              value={newEmployee.phone}
              onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
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
            Cancel
          </Button>
          <Button
            onClick={handleAddEmployee}
            variant="contained"
            sx={{ backgroundColor: "#FF6300", color: "#FAFAFA", "&:hover": { backgroundColor: "#e65c00" } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );

}
