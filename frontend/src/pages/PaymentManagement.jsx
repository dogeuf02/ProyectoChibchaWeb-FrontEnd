import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PaymentCardForm from '../components/Payments/PaymentCardForm';
import PaymentManagementTable from '../components/Payments/PaymentManagementTable';
import { createPayMethod, getPayMethodsByUserId } from '../api/payMethodApi';
import { useAuth } from '../context/AuthContext';

export default function PaymentManagement() {
  const { specificId, role } = useAuth();
  const normalizedRole = role?.toLowerCase();

  const [payments, setPayments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCard, setNewCard] = useState({
    tipoMedioPago: 'visa',
    nombreTitular: '',
    numeroTarjetaCuenta: '',
    correoPse: '',
    banco: null,
  });

  // ✅ función reutilizable para cargar métodos de pago
  const fetchPayments = async () => {
    const response = await getPayMethodsByUserId(normalizedRole, specificId);
    if (response.exito && Array.isArray(response.data)) {
      setPayments(response.data);
    } else {
      console.error('No se pudieron cargar los métodos de pago:', response.mensaje);
    }
  };

  const handleAddPayment = async () => {
    const nuevoMetodo = {
      ...newCard,
      fechaRegistro: new Date().toISOString(),
      cliente: specificId, // o distribuidor según backend
    };

    const response = await createPayMethod(nuevoMetodo);
    if (response.exito) {
      await fetchPayments(); // ✅ refresca la lista después de crear
      setShowForm(false);
      setNewCard({
        tipoMedioPago: 'visa',
        numeroTarjetaCuenta: '',
        nombreTitular: '',
        correoPse: '',
        banco: '',
      });
    } else {
      console.error('Error creando el método:', response.mensaje);
    }
  };

  const disableSave = !(
    newCard.tipoMedioPago &&
    newCard.numeroTarjetaCuenta &&
    newCard.nombreTitular &&
    newCard.banco
  );

  const handleDelete = (id) => {
    setPayments(payments.filter((p) => p.id !== id));
  };

  useEffect(() => {
    if (specificId && role) {
      fetchPayments();
    }
  }, [specificId, role]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        My Payment Methods
      </Typography>

      <PaymentManagementTable payments={payments} onDelete={handleDelete} />

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
            disableSave={disableSave}
          />
        </Paper>
      )}
    </Box>
  );
}
