import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
} from '@mui/material';
import PaymentMethodSelector from '../components/Payments/PaymentMethodSelector';
import { createPlanAdquirido } from '../api/purchasedPlanApi';
import { useGlobalAlert } from '../context/AlertContext';
import { useGlobalLoading } from '../context/LoadingContext';
import { useEffect, useState } from 'react';
import { getPayMethodsByUserId, deletePayMethod, getBanks } from '../api/payMethodApi';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [bankOptions, setBankOptions] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethodId, setSelectedMethodId] = useState(null);

  const { role, specificId } = useAuth();
  const { showAlert } = useGlobalAlert();
  const { showLoader, hideLoader } = useGlobalLoading();
  const navigate = useNavigate();

  useEffect(() => {
    const checkoutData = JSON.parse(localStorage.getItem('checkoutData'));
    if (checkoutData) {
      setSelectedPlan({
        idPlan: checkoutData.idPlanCliente,
        idPlanPago: checkoutData.modalidad.idPlanPago,
        nombrePlanCliente: checkoutData.nombrePlanCliente,
        intervaloPago: checkoutData.modalidad.intervaloPago,
        almacenamientoNvme: checkoutData.caracteristicas.almacenamientoNvme,
        creadorWeb: checkoutData.caracteristicas.creadorWeb,
        emailMarketing: checkoutData.caracteristicas.emailMarketing,
        numeroBaseDatos: checkoutData.caracteristicas.numeroBaseDatos,
        numeroCertificadoSslHttps: checkoutData.caracteristicas.numeroCertificadoSslHttps,
        numeroCuentasCorreo: checkoutData.caracteristicas.numeroCuentasCorreo,
        numeroWebs: checkoutData.caracteristicas.numeroWebs,
        price: checkoutData.modalidad.precio,
      });
    }
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      if (specificId && role) {
        const normalizedRole = role.toLowerCase();
        const response = await getPayMethodsByUserId(normalizedRole, specificId);
        if (response.exito && Array.isArray(response.data)) {
          const adapted = response.data.map((p) => ({
            id: p.idMedioPago,
            cardType: p.tipoMedioPago,
            cardNumber: p.numeroTarjetaCuenta,
            expiryDate: p.fechaExpiracion || 'N/A',
          }));
          setPaymentMethods(adapted);
          setSelectedMethodId(adapted[0]?.id || null);
        }
      }
    };

    const fetchBanks = async () => {
      const response = await getBanks();
      if (response.exito) {
        setBankOptions(response.data);
      } else {
        showAlert(t('checkout.alerts.deleteError'), 'error');
      }
    };

    fetchPayments();
    fetchBanks();
  }, [role, specificId, t, showAlert]);

  const handleDelete = (id) => {
    setSelectedIdToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedIdToDelete) return;

    const response = await deletePayMethod(selectedIdToDelete);
    if (response.exito) {
      showAlert(t('checkout.alerts.deleteSuccess'), 'success');
      const normalizedRole = role.toLowerCase();
      const updated = await getPayMethodsByUserId(normalizedRole, specificId);
      if (updated.exito) {
        const adapted = updated.data.map((p) => ({
          id: p.idMedioPago,
          cardType: p.tipoMedioPago,
          cardNumber: p.numeroTarjetaCuenta,
          expiryDate: p.fechaExpiracion || 'N/A',
        }));
        setPaymentMethods(adapted);
        setSelectedMethodId(adapted[0]?.id || null);
      }
    } else {
      showAlert(response.mensaje || t('checkout.alerts.deleteError'), 'error');
    }

    setConfirmOpen(false);
    setSelectedIdToDelete(null);
  };

  const handlePay = async () => {
    if (!selectedMethodId) {
      showAlert(t('checkout.alerts.selectMethod'), 'warning');
      return;
    }

    const fechaHoy = new Date();
    const fechaCompra = fechaHoy.toISOString().split('T')[0];
    const fechaExpiracion = new Date(fechaHoy);
    fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 1);
    const fechaExpStr = fechaExpiracion.toISOString().split('T')[0];

    const payload = {
      estadoPlan: 'ACTIVO',
      fechaCompra,
      fechaExpiracion: fechaExpStr,
      fechaActualizacion: new Date().toISOString(),
      precioPlanAdquirido: selectedPlan.price,
      cliente: specificId,
      planCliente: selectedPlan.idPlan,
      planPago: selectedPlan.idPlanPago,
    };

    try {
      showLoader();
      await createPlanAdquirido(payload);
      localStorage.removeItem('checkoutData');
      showAlert(t('checkout.alerts.paymentSuccess'), 'success');
      navigate('/client/MyPlans');
    } catch (error) {
      showAlert(t('checkout.alerts.paymentError'), 'error');
    } finally {
      hideLoader();
    }
  };

  if (!selectedPlan) return null;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {t('checkout.title')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 4,
          mt: 4,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ flex: '0 1 700px', maxWidth: 550 }}>
          <PaymentMethodSelector
            methods={paymentMethods}
            selectedId={selectedMethodId}
            onSelect={setSelectedMethodId}
            onDelete={handleDelete}
            onAdd={(newEntry) => {
              setPaymentMethods((prev) => [...prev, newEntry]);
              setSelectedMethodId(newEntry.id);
            }}
            bankOptions={bankOptions}
          />
        </Box>

        {/* Plan Summary */}
        <Box sx={{ width: 400 }}>
          <Paper sx={{ p: 4, bgcolor: '#FAFAFA' }} elevation={3}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              {t('checkout.selectedPlan')}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1">{t('checkout.plan')}:</Typography>
              <Typography variant="body1" sx={{ color: '#FF6400' }}>
                {selectedPlan.nombrePlanCliente}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1">{t('checkout.billingCycle')}:</Typography>
              <Typography variant="body1" sx={{ color: '#212121' }}>
                {selectedPlan.intervaloPago}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom align="left">
              {t('checkout.features')}:
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: "left", gap: 1 }}>
              <Typography variant="body1">• {selectedPlan.numeroBaseDatos} DB</Typography>
              <Typography variant="body1">• {selectedPlan.numeroWebs} Sites</Typography>
              <Typography variant="body1">• {selectedPlan.almacenamientoNvme} GB NVMe</Typography>
              <Typography variant="body1">• {selectedPlan.numeroCuentasCorreo} Emails</Typography>
              {selectedPlan.creadorWeb && <Typography variant="body1">• Website Builder</Typography>}
              <Typography variant="body1">• {selectedPlan.numeroCertificadoSslHttps} SSL</Typography>
              {selectedPlan.emailMarketing && <Typography variant="body1">• Email Marketing</Typography>}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant="h6">{t('checkout.total')}:</Typography>
              <Typography variant="h6" sx={{ color: '#FF6400' }}>
                ${selectedPlan.price.toFixed(2)}
              </Typography>
            </Box>
          </Paper>

          <Box textAlign="right" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              onClick={handlePay}
              sx={{
                px: 6,
                py: 1.5,
                borderRadius: 30,
                bgcolor: '#FF6400',
                '&:hover': { bgcolor: '#FFBE02' },
              }}
            >
              {t('checkout.payNow')}
            </Button>
          </Box>
        </Box>
      </Box>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('checkout.confirmDialog.deleteTitle')}
        message={t('checkout.confirmDialog.deleteMessage')}
        confirmText={t('checkout.confirmDialog.confirm')}
        cancelText={t('checkout.confirmDialog.cancel')}
      />
    </Box>
  );
}
