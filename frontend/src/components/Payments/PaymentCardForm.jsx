import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisaIcon from '@mui/icons-material/Payment';

const cardTypes = [
  { value: 'visa', label: 'Visa', icon: <VisaIcon fontSize="small" /> },
  { value: 'mastercard', label: 'MasterCard', icon: <VisaIcon fontSize="small" /> },
  { value: 'diners', label: 'Diners', icon: <VisaIcon fontSize="small" /> },
];

export default function PaymentCardForm({
  data,
  onChange,
  onDelete,
  onSave,
  isNew = false,
  disableSave = false,
}) {
  const handleChange = (e) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <Box component="form" noValidate>
      <TextField
        select
        label="Card Type"
        name="cardType"
        value={data.cardType}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {cardTypes.find((type) => type.value === data.cardType)?.icon}
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
        label="Card Number"
        name="cardNumber"
        value={data.cardNumber}
        onChange={handleChange}
        fullWidth
        margin="normal"
        inputProps={{ maxLength: 19 }}
      />

      <Box display="flex" gap={2}>
        <TextField
          label="CVC"
          name="cvc"
          value={data.cvc}
          onChange={handleChange}
          fullWidth
          margin="normal"
          inputProps={{ maxLength: 4 }}
        />
        <TextField
          label="Expiry Date"
          name="expiryDate"
          type="month"
          value={data.expiryDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button
          variant="contained"
          sx={{
            borderRadius: 30,
            bgcolor: '#FF6400',
            '&:hover': { bgcolor: '#FFBE02' },
          }}
          onClick={onSave}
          disabled={disableSave}
        >
          {isNew ? 'Add Method' : 'Save Changes'}
        </Button>

        {!isNew && (
          <IconButton onClick={onDelete}>
            <DeleteIcon color="error" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
