import { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PaymentCardForm from '../components/Payments/PaymentCardForm';
import PaymentManagementTable from '../components/Payments/PaymentManagementTable';

export default function PaymentManagement() {
  const [payments, setPayments] = useState([
    {
      id: 1,
      cardType: 'mastercard',
      cardNumber: '1234567812345678',
      cvc: '123',
      expiryDate: '2025-12',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newCard, setNewCard] = useState({
    cardType: 'visa',
    cardNumber: '',
    cvc: '',
    expiryDate: '',
  });

  const handleAddPayment = () => {
    const newPayment = { ...newCard, id: Date.now() };
    setPayments([...payments, newPayment]);
    setNewCard({ cardType: 'visa', cardNumber: '', cvc: '', expiryDate: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setPayments(payments.filter((p) => p.id !== id));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        My Payment Methods
      </Typography>

      {/* ✅ Lista delegada a componente */}
      <PaymentManagementTable payments={payments} onDelete={handleDelete} />

      {/* ✅ Botón o formulario */}
      {!showForm ? (
        <Box textAlign="center" mt={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 30,
              bgcolor: '#FF6400',
              '&:hover': { bgcolor: '#FFBE02' },
            }}
            onClick={() => setShowForm(true)}
          >
            Add Payment Method
          </Button>
        </Box>
      ) : (
        <Paper sx={{ p: 3, bgcolor: '#FAFAFA', mt: 2 }} elevation={3}>
          <Typography variant="h6" gutterBottom>
            New Payment Method
          </Typography>

          <PaymentCardForm
            data={newCard}
            onChange={setNewCard}
            onSave={handleAddPayment}
            isNew
            disableSave={
              !newCard.cardNumber || !newCard.cvc || !newCard.expiryDate
            }
          />
        </Paper>
      )}
    </Box>
  );
}
