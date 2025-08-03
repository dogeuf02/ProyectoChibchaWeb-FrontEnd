import { useState } from 'react';
import {
  Container,
  TextField,
  Typography,
  Box,
  Paper,
  Button,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisaIcon from '@mui/icons-material/Payment';
import { useTranslation } from 'react-i18next';

export default function PaymentInfo() {
  const { t } = useTranslation(); // 👈 hook

  const [hasCard, setHasCard] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardType: 'mastercard',
    cardNumber: '1234567812345678',
    cvc: '123',
    expiryDate: '2025-12',
  });

  const cardTypes = [
    { value: 'visa', label: 'Visa', icon: <VisaIcon fontSize="small" /> },
    { value: 'mastercard', label: 'MasterCard', icon: <VisaIcon fontSize="small" /> },
    { value: 'diners', label: 'Diners', icon: <VisaIcon fontSize="small" /> },
  ];

  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setHasCard(true);
    setShowForm(false);
  };

  const handleDelete = () => {
    setHasCard(false);
    setPaymentData({ cardType: 'visa', cardNumber: '', cvc: '', expiryDate: '' });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, bgcolor: '#fafafa' }}>
        <Typography variant="h5" gutterBottom>
          {t('payment.title')}
        </Typography>

        {hasCard && !showForm ? (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              border: '1px solid #ccc',
              borderRadius: 2,
              p: 2,
              mt: 2,
              backgroundColor: '#f5f5f5',
            }}
          >
            <Box>
              <Typography variant="subtitle1">
                {cardTypes.find((c) => c.value === paymentData.cardType)?.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                **** **** **** {paymentData.cardNumber.slice(-4)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('payment.expires')}: {paymentData.expiryDate}
              </Typography>
            </Box>
            <IconButton onClick={handleDelete}>
              <DeleteIcon color="error" />
            </IconButton>
          </Box>
        ) : showForm ? (
          <Box component="form" noValidate>
            <TextField
              select
              label={t('payment.cardType')}
              name="cardType"
              value={paymentData.cardType}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {cardTypes.find((type) => type.value === paymentData.cardType)?.icon}
                  </InputAdornment>
                ),
              }}
            >
              {cardTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label={t('payment.cardNumber')}
              name="cardNumber"
              value={paymentData.cardNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
              inputProps={{ maxLength: 19 }}
            />

            <Box display="flex" gap={2}>
              <TextField
                label={t('payment.cvc')}
                name="cvc"
                value={paymentData.cvc}
                onChange={handleChange}
                fullWidth
                margin="normal"
                inputProps={{ maxLength: 4 }}
              />
              <TextField
                label={t('payment.expiryDate')}
                name="expiryDate"
                type="month"
                value={paymentData.expiryDate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                bgcolor: '#ff6f00',
                borderRadius: 30,
                '&:hover': { bgcolor: '#ffa000' },
              }}
              onClick={handleSave}
              disabled={!paymentData.cardNumber || !paymentData.cvc || !paymentData.expiryDate}
            >
              {t('payment.saveButton')}
            </Button>
          </Box>
        ) : (
          <Box textAlign="center" sx={{ mt: 4 }}>
            <IconButton
              onClick={() => setShowForm(true)}
              sx={{ bgcolor: '#ff6f00', color: 'white', '&:hover': { bgcolor: '#ffa000' } }}
            >
              <AddIcon />
            </IconButton>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {t('payment.addMethod')}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
