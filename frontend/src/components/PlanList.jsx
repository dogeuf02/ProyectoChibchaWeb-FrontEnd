import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function PlanList({ plans, onRequestDelete }) {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#fff3e0" }}>
            <TableCell sx={{ fontWeight: "bold" }}>Plan Type</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id} hover>
              <TableCell>{plan.type}</TableCell>
              <TableCell>{plan.description}</TableCell>
              <TableCell>${plan.price.toFixed(2)}</TableCell>
              <TableCell>
                <IconButton color="error" onClick={() => onRequestDelete(plan.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
