import {
  Box,
  TextField,
  MenuItem,
  Button,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function PaymentCardForm({
  data,
  onChange,
  onDelete,
  onSave,
  isNew = false,
  disableSave = false,
  bankOptions = []
}) {
  const handleChange = (e) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <Box component="form" noValidate>
      {/* tipo de tarjeta */}
      <TextField
        select
        label="Card Type"
        name="tipoMedioPago"
        value={data.tipoMedioPago}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {['Debito', 'Credito', 'PSE'].map((tipo) => (
          <MenuItem key={tipo} value={tipo}>
            {tipo}
          </MenuItem>
        ))}
      </TextField>


      {/* banco */}
      <TextField
        select
        label="Bank"
        name="banco"
        value={data.banco}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {bankOptions.map((bank) => (
          <MenuItem key={bank.idBanco} value={bank.idBanco}>
            {bank.nombreBanco}
          </MenuItem>
        ))}
      </TextField>

      {/* nombre del titular */}
      <TextField
        label="Cardholder Name"
        name="nombreTitular"
        value={data.nombreTitular}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      {/* número de tarjeta */}
      <TextField
        label="Card Number"
        name="numeroTarjetaCuenta"
        value={data.numeroTarjetaCuenta}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      {/* email PSE */}
      {data.tipoMedioPago === 'PSE' && (
        <TextField
          label="PSE Email"
          name="correoPse"
          value={data.correoPse}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      )}
      {/* <TextField
        label="Expiration Date"
        name="fechaExpiracion"
        type="month"
        value={data.fechaExpiracion}
        onChange={handleChange}
        fullWidth
        margin="normal"
      /> */}



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
