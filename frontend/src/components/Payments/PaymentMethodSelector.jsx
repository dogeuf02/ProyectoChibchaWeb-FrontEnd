import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Radio,
  FormControlLabel,
  RadioGroup,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentCardForm from './PaymentCardForm';

export default function PaymentMethodSelector({
  methods = [],
  selectedId,
  onSelect,
  onDelete,
  onAdd,
}) {
  const [newMethod, setNewMethod] = useState({
    cardType: 'visa',
    cardNumber: '',
    cvc: '',
    expiryDate: '',
  });

  const handleAdd = () => {
    if (!newMethod.cardNumber || !newMethod.cvc || !newMethod.expiryDate) return;
    const newEntry = {
      ...newMethod,
      id: Date.now(),
    };
    onAdd(newEntry);
    setNewMethod({
      cardType: 'visa',
      cardNumber: '',
      cvc: '',
      expiryDate: '',
    });
  };

  const handleChange = (event) => {
    onSelect(parseInt(event.target.value));
  };

  return (
    <Paper sx={{ p: 3, bgcolor: '#FAFAFA' }} elevation={3}>
      <Typography variant="h6" gutterBottom>
        {methods.length > 0 ? 'Select a Payment Method' : 'Add a Payment Method'}
      </Typography>

      {/* Agregar nuevo incluso si ya hay uno */}
      {methods.length === 0 ? (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            You don’t have any saved payment methods.
          </Typography>
          <PaymentCardForm
            data={newMethod}
            onChange={setNewMethod}
            onSave={handleAdd}
            isNew
            disableSave={
              !newMethod.cardNumber || !newMethod.cvc || !newMethod.expiryDate
            }
          />
        </Box>
      ) : (
        <RadioGroup value={selectedId?.toString()} onChange={handleChange}>
          {methods.map((method) => (
            <Box
              key={method.id}
              sx={{
                border: '1px solid',
                borderColor:
                  method.id === selectedId ? '#FF6400' : 'transparent',
                borderRadius: 2,
                p: 2,
                mb: 2,
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <FormControlLabel
                value={method.id.toString()}
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="subtitle1">
                      {method.cardType.toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      **** **** **** {method.cardNumber.slice(-4)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expires: {method.expiryDate}
                    </Typography>
                  </Box>
                }
              />
              {onDelete && (
                <IconButton onClick={() => onDelete(method.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              )}
            </Box>
          ))}
        </RadioGroup>
      )}

    </Paper>
  );
}
