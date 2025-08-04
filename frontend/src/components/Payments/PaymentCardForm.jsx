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
        label="Tipo de Tarjeta"
        name="tipoMedioPago"
        value={data.tipoMedioPago}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {cardTypes.find((type) => type.value === data.tipoMedioPago)?.icon}
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
        label="Número de Tarjeta"
        name="numeroTarjetaCuenta"
        value={data.numeroTarjetaCuenta}
        onChange={handleChange}
        fullWidth
        margin="normal"
        inputProps={{ maxLength: 19 }}
      />

      <TextField
        label="Nombre del Titular"
        name="nombreTitular"
        value={data.nombreTitular}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Correo PSE (si aplica)"
        name="correoPse"
        value={data.correoPse}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Banco ID"
        name="banco"
        value={data.banco || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
      />

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
          {isNew ? 'Agregar Método' : 'Guardar Cambios'}
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
