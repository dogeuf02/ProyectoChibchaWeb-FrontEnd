import { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Collapse, Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useTranslation } from "react-i18next";

export default function PlansAdminList({ plans, onEditPlan, onDeletePlan }) {
  const [openRow, setOpenRow] = useState({});
  const { t } = useTranslation();

  const toggleRow = (id) => {
    setOpenRow((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#fff3e0" }}>
            <TableCell />
            <TableCell><b>{t("plansManagement.list.name")}</b></TableCell>
            <TableCell><b>{t("plansManagement.list.monthly")}</b></TableCell>
            <TableCell><b>{t("plansManagement.list.semiAnnual")}</b></TableCell>
            <TableCell><b>{t("plansManagement.list.annual")}</b></TableCell>
            <TableCell><b>{t("plansManagement.list.actions")}</b></TableCell>
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
                        <b>{t("plansManagement.list.details")}:</b>
                        <ul>
                          <li>{t("plansManagement.list.websites")}: {plan.webs}</li>
                          <li>{t("plansManagement.list.databases")}: {plan.databases}</li>
                          <li>{t("plansManagement.list.storage")}: {plan.storage}</li>
                          <li>{t("plansManagement.list.emails")}: {plan.emails}</li>
                          <li>{t("plansManagement.list.ssl")}: {plan.ssl}</li>
                          <li>{t("plansManagement.list.webBuilder")}: {plan.webBuilder ? t("plansManagement.list.yes") : t("plansManagement.list.no")}</li>
                          <li>{t("plansManagement.list.emailMarketing")}: {plan.emailMarketing ? t("plansManagement.list.yes") : t("plansManagement.list.no")}</li>
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
