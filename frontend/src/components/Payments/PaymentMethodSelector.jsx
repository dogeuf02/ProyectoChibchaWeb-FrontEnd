import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Radio,
  FormControlLabel,
  RadioGroup,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentCardForm from './PaymentCardForm';
import { useAuth } from '../../context/AuthContext';
import { createPayMethod, getPayMethodsByUserId } from '../../api/payMethodApi';
import { useGlobalAlert } from '../../context/AlertContext';
import { useTranslation } from 'react-i18next';

export default function PaymentMethodSelector({
  methods = [],
  selectedId,
  onSelect,
  onDelete,
  onAdd,
  bankOptions = []
}) {
  const [newMethod, setNewMethod] = useState({
    tipoMedioPago: 'visa',
    nombreTitular: '',
    numeroTarjetaCuenta: '',
    banco: null,
  });

  const { specificId, role } = useAuth();
  const { showAlert } = useGlobalAlert();
  const { t } = useTranslation();

  const handleAdd = async () => {
    if (!newMethod.numeroTarjetaCuenta || !newMethod.banco) {
      showAlert(t('checkout.alerts.fillFields'), 'warning');
      return;
    }

    const nuevoMetodo = {
      tipoMedioPago: newMethod.tipoMedioPago,
      nombreTitular: newMethod.nombreTitular,
      numeroTarjetaCuenta: newMethod.numeroTarjetaCuenta,
      correoPse: '',
      banco: newMethod.banco,
      fechaRegistro: new Date().toISOString(),
      cliente: specificId,
    };

    try {
      const response = await createPayMethod(nuevoMetodo);
      if (response.exito) {
        const userType = role.toLowerCase();
        const refresh = await getPayMethodsByUserId(userType, specificId);

        if (refresh.exito) {
          const adapted = refresh.data.map((p) => ({
            id: p.idMedioPago,
            cardType: p.tipoMedioPago,
            cardNumber: p.numeroTarjetaCuenta,
            expiryDate: p.fechaExpiracion || 'N/A',
          }));
          onAdd && onAdd(adapted[adapted.length - 1]);
          showAlert(t('checkout.alerts.addSuccess'), 'success');
        }
      } else {
        showAlert(response.mensaje || t('checkout.alerts.addError'), 'error');
      }
    } catch {
      showAlert(t('checkout.alerts.addError'), 'error');
    }

    setNewMethod({ tipoMedioPago: 'visa', numeroTarjetaCuenta: '', nombreTitular: '', banco: null });
  };

  return (
    <Paper sx={{ p: 3, bgcolor: '#FAFAFA' }} elevation={3}>
      <Typography variant="h6" gutterBottom>
        {methods.length > 0
          ? t('checkout.paymentMethodSelector.select')
          : t('checkout.paymentMethodSelector.add')}
      </Typography>

      {methods.length === 0 ? (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('checkout.paymentMethodSelector.noMethods')}
          </Typography>
          <PaymentCardForm
            data={newMethod}
            onChange={setNewMethod}
            onSave={handleAdd}
            isNew
            disableSave={!newMethod.numeroTarjetaCuenta || !newMethod.nombreTitular || !newMethod.banco}
            bankOptions={bankOptions}
          />
        </Box>
      ) : (
        <RadioGroup value={selectedId?.toString()} onChange={(e) => onSelect(parseInt(e.target.value))}>
          {methods.map((method) => (
            <Box
              key={method.id}
              sx={{
                border: '1px solid',
                borderColor: method.id === selectedId ? '#FF6400' : 'transparent',
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
                    <Typography variant="subtitle1">{method.cardType.toUpperCase()}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      **** **** **** {method.cardNumber.slice(-4)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('checkout.paymentMethodSelector.expires')}: {method.expiryDate}
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
