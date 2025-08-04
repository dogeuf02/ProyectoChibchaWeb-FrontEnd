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
import { useAuth } from '../../context/AuthContext';
import { createPayMethod, getPayMethodsByUserId } from '../../api/payMethodApi';
import { useGlobalAlert } from '../../context/AlertContext';



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


  const disableSave =
    !newMethod.numeroTarjetaCuenta ||
    !newMethod.nombreTitular ||
    !newMethod.banco;


  const { specificId, role } = useAuth();
  const { showAlert } = useGlobalAlert();


  const handleAdd = async () => {
    if (
      !newMethod.numeroTarjetaCuenta ||
      !newMethod.banco
    ) {
      showAlert('Please fill in all required fields', 'warning');
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
          showAlert('Payment method added successfully', 'success');
        }
      } else {
        showAlert(response.mensaje || 'Failed to add method', 'error');
      }
    } catch (err) {
      showAlert('Error adding payment method', 'error');
    }

    setNewMethod({
      cardType: 'visa',
      cardNumber: '',
      nombreTitular: '',
      banco: null,
    });
  };


  const handleChange = (e) => {
    onChange({ ...data, [e.target.name]: e.target.value });
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
              !newMethod.numeroTarjetaCuenta ||
              !newMethod.nombreTitular ||
              !newMethod.banco
            }


            bankOptions={bankOptions}
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
