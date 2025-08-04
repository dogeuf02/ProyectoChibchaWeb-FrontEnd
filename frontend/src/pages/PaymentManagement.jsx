import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PaymentCardForm from '../components/Payments/PaymentCardForm';
import PaymentManagementTable from '../components/Payments/PaymentManagementTable';
import {
  createPayMethod,
  getPayMethodsByUserId,
  getBanks,
  deletePayMethod,
} from '../api/payMethodApi';
import { useAuth } from '../context/AuthContext';
import { useGlobalAlert } from '../context/AlertContext';
import ConfirmDialog from '../components/ConfirmDialog';


export default function PaymentManagement() {
  const { specificId, role } = useAuth();
  const normalizedRole = role?.toLowerCase();

  const { showAlert } = useGlobalAlert();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);

  const [payments, setPayments] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCard, setNewCard] = useState({
    tipoMedioPago: 'visa',
    nombreTitular: '',
    numeroTarjetaCuenta: '',
    correoPse: '',
    banco: null,
    fechaExpiracion: new Date().toISOString().slice(0, 7), // "YYYY-MM"

  });

  const fetchPayments = async () => {
    const response = await getPayMethodsByUserId(normalizedRole, specificId);
    if (response.exito && Array.isArray(response.data)) {
      setPayments(response.data);
    } else {
      console.error('No se pudieron cargar los métodos de pago:', response.mensaje);
    }
  };

  const fetchBanks = async () => {
    const response = await getBanks();
    if (response.exito) {
      setBankOptions(response.data); // [{ idBanco, nombreBanco }]
    } else {
      console.error('Error al cargar bancos:', response.mensaje);
    }
  };

  const handleAddPayment = async () => {
    const nuevoMetodo = {
      ...newCard,
      fechaRegistro: new Date().toISOString(),
      cliente: specificId,
    };



    const response = await createPayMethod(nuevoMetodo);
    if (response.exito) {
      await fetchPayments();
      showAlert('Payment method added successfully', 'success');
      setShowForm(false);
      setNewCard({
        tipoMedioPago: 'visa',
        numeroTarjetaCuenta: '',
        nombreTitular: '',
        correoPse: '',
        banco: null,
      });
    } else {
      showAlert(response.mensaje || 'Failed to add payment method', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedIdToDelete) return;
    const response = await deletePayMethod(selectedIdToDelete);
    if (response.exito) {
      showAlert('Payment method deleted successfully', 'success');
      await fetchPayments();
    } else {
      showAlert(response.mensaje || 'Failed to delete payment method', 'error');
    }
    setConfirmOpen(false);
    setSelectedIdToDelete(null);
  };

  const disableSave = !(
    newCard.tipoMedioPago &&
    newCard.numeroTarjetaCuenta &&
    newCard.nombreTitular &&
    newCard.banco
  );

  const handleDelete = (id) => {
    setSelectedIdToDelete(id);
    setConfirmOpen(true);
  };


  useEffect(() => {
    if (specificId && role) {
      fetchPayments();
      fetchBanks();
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
            bankOptions={bankOptions}
            onDelete={() => handleDelete(data.idMedioPago)}
          />
        </Paper>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Payment Method"
        message="Are you sure you want to delete this payment method? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />


    </Box>



  );


}
