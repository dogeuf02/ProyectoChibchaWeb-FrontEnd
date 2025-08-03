import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack
} from "@mui/material";

export default function EditUserDialog({ open, onClose, onSave, userData, onChange, fields, isEditMode }) {
  
  return (
    
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {fields.map(({ name, label, type }) => (
            <TextField
            
              key={name}
              label={label}
              type={type || "text"}
              value={userData[name] || ""}
              onChange={(e) => onChange(name, e.target.value)}
              fullWidth
              InputLabelProps={type === "date" ? { shrink: true } : {}}

              InputProps={{
                readOnly: isEditMode && name === "email",
                style: isEditMode && name === "email" ? { backgroundColor: "#f0f0f0" } : {}
              }}
            />

          ))}
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
