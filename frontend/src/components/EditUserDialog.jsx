import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem
} from "@mui/material";

export default function EditUserDialog({ open, onClose, onSave, userData, onChange, fields, isEditMode, documentTypes = [], extraOptions = {} }) {


  const positionOptions = extraOptions.positionOptions || [];
  return (


    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {fields.map(({ name, label, type }) => {
            const isEmailField = name === "email";
            const isDocTypeField = name === "company_document_type";
            const isPositionField = name === "position";

            // Campo select para tipo de documento
            if (isDocTypeField && documentTypes.length > 0) {
              return (
                <TextField
                  key={name}
                  select
                  label={label}
                  name={name}
                  value={
                    documentTypes.find((d) => d.nombreTipoDoc === userData[name])
                      ? userData[name]
                      : ''
                  }
                  onChange={(e) => onChange(name, e.target.value)}
                  fullWidth
                  disabled={!isEditMode}
                  sx={{
                    '& label': { color: '#a5a5a5ff' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#bdbdbd' },
                      '&:hover fieldset': { borderColor: '#ff6f00' },
                      '&.Mui-focused fieldset': { borderColor: '#ffc107' },
                    }
                  }}
                >
                  {documentTypes.map((type) => (
                    <MenuItem key={type.nombreTipoDoc} value={type.nombreTipoDoc}>
                      {type.nombreTipoDoc}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }
            if (isPositionField && positionOptions.length > 0) {
              return (
                <TextField
                  key={name}
                  select
                  label={label}
                  name={name}
                  value={userData[name] || ''}
                  onChange={(e) => onChange(name, e.target.value)}
                  fullWidth
                  disabled={!isEditMode}
                  sx={{
                    '& label': { color: '#a5a5a5ff' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#bdbdbd' },
                      '&:hover fieldset': { borderColor: '#ff6f00' },
                      '&.Mui-focused fieldset': { borderColor: '#ffc107' },
                    }
                  }}
                >
                  {positionOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }

            // Campos normales
            return (
              <TextField
                key={name}
                label={label}
                type={type || "text"}
                name={name}
                value={userData[name] || ""}
                onChange={(e) => onChange(name, e.target.value)}
                fullWidth
                InputLabelProps={type === "date" ? { shrink: true } : {}}
                InputProps={{
                  readOnly: isEditMode && isEmailField,
                  style: isEditMode && isEmailField ? { backgroundColor: "#f0f0f0" } : {}
                }}
                disabled={isEmailField}
              />
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: "#212121", borderRadius: 30 }}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          sx={{ backgroundColor: "#FF6300", color: "#FAFAFA", borderRadius: 30, "&:hover": { backgroundColor: "#FFBE02", color: "#212121" } }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );

}
