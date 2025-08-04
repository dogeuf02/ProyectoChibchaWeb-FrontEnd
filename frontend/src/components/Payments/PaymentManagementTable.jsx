import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
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
            key={payment.idMedioPago}
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
              <Typography variant="subtitle1" fontWeight="bold">
                {payment.tipoMedioPago?.toUpperCase()}
              </Typography>

              {payment.numeroTarjetaCuenta && (
                <Typography variant="body2" color="text.secondary">
                  **** **** **** {payment.numeroTarjetaCuenta.slice(-4)}
                </Typography>
              )}

              {payment.nombreTitular && (
                <Typography variant="body2" color="text.secondary">
                  Titular: {payment.nombreTitular}
                </Typography>
              )}

              {payment.correoPse && (
                <Typography variant="body2" color="text.secondary">
                  Correo PSE: {payment.correoPse}
                </Typography>
              )}

              <Typography variant="body2" color="text.secondary">
                Registrado: {new Date(payment.fechaRegistro).toLocaleDateString()}
              </Typography>
            </Box>

            <IconButton onClick={() => onDelete(payment.idMedioPago)}>
              <DeleteIcon color="error" />
            </IconButton>
          </Box>
        ))
      )}
    </Paper>
  );
}
