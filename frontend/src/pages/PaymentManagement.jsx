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
import { useTranslation } from 'react-i18next';
import { ROLE } from '../enum/roleEnum';
export default function PaymentManagement() {
  const { t } = useTranslation();
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
    fechaExpiracion: new Date().toISOString().slice(0, 7),
  });

  const fetchPayments = async () => {
    const response = await getPayMethodsByUserId(normalizedRole, specificId);
    if (response.exito && Array.isArray(response.data)) {
      setPayments(response.data);
    } else {
      console.error(t('paymentManagement.alerts.loadError'), response.mensaje);
    }
  };

  const fetchBanks = async () => {
    const response = await getBanks();
    if (response.exito) {
      setBankOptions(response.data);
    } else {
      console.error(t('paymentManagement.alerts.bankLoadError'), response.mensaje);
    }
  };

  const handleAddPayment = async () => {
    let clientId = null;
    let distributorId = null;
    console.log(role === ROLE.DISTRIBUTOR);
    if(role === ROLE.CLIENT){
      clientId = specificId;
    }else if(role === ROLE.DISTRIBUTOR){
      distributorId = specificId;
    }
    const nuevoMetodo = {
      ...newCard,
      fechaRegistro: new Date().toISOString(),
      cliente: clientId,
      distribuidor: distributorId
    };

    const response = await createPayMethod(nuevoMetodo);
    if (response.exito) {
      await fetchPayments();
      showAlert(t('paymentManagement.alerts.addSuccess'), 'success');
      setShowForm(false);
      setNewCard({
        tipoMedioPago: 'visa',
        numeroTarjetaCuenta: '',
        nombreTitular: '',
        correoPse: '',
        banco: null,
      });
    } else {
      showAlert(response.mensaje || t('paymentManagement.alerts.addError'), 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedIdToDelete) return;
    const response = await deletePayMethod(selectedIdToDelete);
    if (response.exito) {
      showAlert(t('paymentManagement.alerts.deleteSuccess'), 'success');
      await fetchPayments();
    } else {
      showAlert(response.mensaje || t('paymentManagement.alerts.deleteError'), 'error');
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
        {t('paymentManagement.title')}
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
            {t('paymentManagement.addButton')}
          </Button>
        </Box>
      ) : (
        <Paper sx={{ p: 3, bgcolor: '#FAFAFA', mt: 2 }} elevation={3}>
          <Typography variant="h6" gutterBottom>
            {t('paymentManagement.newPaymentMethod')}
          </Typography>

          <PaymentCardForm
            data={newCard}
            onChange={setNewCard}
            onSave={handleAddPayment}
            isNew
            disableSave={disableSave}
            bankOptions={bankOptions}
            onDelete={() => handleDelete(newCard.idMedioPago)}
          />
        </Paper>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('paymentManagement.deleteDialog.title')}
        message={t('paymentManagement.deleteDialog.message')}
        confirmText={t('paymentManagement.deleteDialog.confirmText')}
        cancelText={t('paymentManagement.deleteDialog.cancelText')}
      />
    </Box>
  );
}
