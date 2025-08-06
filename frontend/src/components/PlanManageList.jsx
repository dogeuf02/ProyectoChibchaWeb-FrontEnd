import { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Collapse, Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function PlansAdminList({ plans, onEditPlan, onDeletePlan }) {
  const [openRow, setOpenRow] = useState({});

  const toggleRow = (id) => {
    setOpenRow((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#fff3e0" }}>
            <TableCell />
            <TableCell><b>Name</b></TableCell>
            <TableCell><b>Monthly (US)</b></TableCell>
            <TableCell><b>Semi-Annual (US)</b></TableCell>
            <TableCell><b>Annual (US)</b></TableCell>
            <TableCell><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {plans.map((plan) => {
            const isOpen = openRow[plan.id] || false;

            return (
              <>
                <TableRow key={plan.id} hover>
                  <TableCell>
                    <IconButton size="small" onClick={() => toggleRow(plan.id)}>
                      {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>{plan.monthly}</TableCell>
                  <TableCell>{plan.semiAnnual}</TableCell>
                  <TableCell>{plan.annual}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => onEditPlan(plan)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDeletePlan(plan.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={6} sx={{ p: 0, bgcolor: "#fafafa" }}>
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                      <Box sx={{ m: 2 }}>
                        <b>Plan Details:</b>
                        <ul>
                          <li>Websites: {plan.webs}</li>
                          <li>Databases: {plan.databases}</li>
                          <li>Storage: {plan.storage}</li>
                          <li>Email Accounts: {plan.emails}</li>
                          <li>SSL Certificates: {plan.ssl}</li>
                          <li>Web Builder: {plan.webBuilder ? "Yes" : "No"}</li>
                          <li>Email Marketing: {plan.emailMarketing ? "Yes" : "No"}</li>
                        </ul>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
