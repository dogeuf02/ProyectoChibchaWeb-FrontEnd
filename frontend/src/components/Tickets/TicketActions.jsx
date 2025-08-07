import {
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function TicketActions({
  isClosed,
  tempStatus,
  tempLevel,
  tempAssignedTech,
  comment,
  statusOptions,
  levelOptions,
  availableTechnicians,
  onChangeStatus,
  onChangeLevel,
  onChangeTechnician,
  onChangeComment,
  onSave,
  onClose,
  employeeRole,
}) {
  const { t } = useTranslation();
  const isCoordinator = employeeRole?.toLowerCase().includes("coordinador");
  const isTechnician = employeeRole?.toLowerCase().includes("tecnico");

  return (
    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 150 }} disabled={isClosed}>
          <InputLabel>{t("tickets.actions.changeStatus")}</InputLabel>
          <Select
            value={tempStatus}
            label={t("tickets.actions.changeStatus")}
            onChange={(e) => onChangeStatus(e.target.value)}
          >
            {(statusOptions || []).map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {!isTechnician && (
          <FormControl size="small" sx={{ minWidth: 150 }} disabled={isClosed}>
            <InputLabel>{t("tickets.actions.changeLevel")}</InputLabel>
            <Select
              value={tempLevel}
              label={t("tickets.actions.changeLevel")}
              onChange={(e) => onChangeLevel(e.target.value)}
            >
              {(levelOptions || []).map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      <TextField
        label={t("tickets.actions.addComment")}
        size="small"
        fullWidth
        multiline
        maxRows={3}
        disabled={isClosed}
        value={comment}
        onChange={(e) => onChangeComment(e.target.value)}
      />

      <FormControl size="small" sx={{ minWidth: 200 }} disabled={isClosed}>
        <InputLabel>{t("tickets.actions.assignTechnician")}</InputLabel>
        <Select
          value={tempAssignedTech}
          label={t("tickets.actions.assignTechnician")}
          onChange={(e) => onChangeTechnician(e.target.value)}
        >
          {availableTechnicians.map((opt) => (
            <MenuItem key={opt.id} value={opt.id}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", gap: 2 }}>
        {!isClosed && (
          <Button
            variant="contained"
            onClick={onSave}
            sx={{ borderRadius: 30, bgcolor: "#FFBE02", color: "#212121" }}
          >
            {t("tickets.actions.saveChanges")}
          </Button>
        )}

        {!isClosed && !isTechnician && (
          <Button
            variant="contained"
            color="error"
            onClick={onClose}
            sx={{ borderRadius: 30 }}
          >
            {t("tickets.actions.closeTicket")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
