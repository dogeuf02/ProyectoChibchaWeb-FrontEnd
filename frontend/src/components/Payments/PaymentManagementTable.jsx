import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Divider,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';



export default function PaymentManagementTable({ payments, onDelete }) {
  return (
    <Paper sx={{ p: 3, bgcolor: '#FAFAFA', mb: 4 }} elevation={3}>
      {payments.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No saved payment methods.
        </Typography>
      ) : (
        payments.map((payment) => (
          <Box
            key={payment.id}
            sx={{
              border: '1px solid #ddd',
              borderRadius: 2,
              p: 2,
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f5f5f5',
            }}
          >
            <Box>
              <Typography variant="subtitle1">
                {payment.cardType.toUpperCase()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                **** **** **** {payment.cardNumber.slice(-4)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Expires: {payment.expiryDate}
              </Typography>
            </Box>

            <IconButton onClick={() => onDelete(payment.id)}>
              <DeleteIcon color="error" />
            </IconButton>
          </Box>
        ))
      )}
    </Paper>
  );
}
