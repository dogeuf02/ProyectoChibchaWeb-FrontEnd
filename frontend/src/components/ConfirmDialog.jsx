import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button
} from "@mui/material";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#FAFAFA",
          borderRadius: 3,
          boxShadow: 8,
          p: 2,
        },
      }}
    >
      <DialogTitle sx={{ color: "#212121", fontWeight: "bold", textAlign: "center" }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: "#212121", textAlign: "center" }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#BDBDBD",
            color: "#212121",
            borderRadius: 30,
            ":hover": {
              borderColor: "#FFBE02",
              backgroundColor: "#FFBE02",
              color: "#212121",
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          sx={{
            backgroundColor: "#f04507ff",
            borderRadius: 30,
            ":hover": {
              backgroundColor: "#FFBE02",
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
