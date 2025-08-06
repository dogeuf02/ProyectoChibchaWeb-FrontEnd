import {
    Box,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Button,
} from "@mui/material";

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
    const isCoordinator = employeeRole?.toLowerCase().includes("coordinador");
    const isTechnician = employeeRole?.toLowerCase().includes("tecnico");

    console.log("isClosed:", isClosed);
    console.log("isTechnician:", isTechnician);


    return (
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 150 }} disabled={isClosed}>
                    <InputLabel>Change Status</InputLabel>
                    <Select
                        value={tempStatus}
                        label="Change Status"
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
                        <InputLabel>Change Level</InputLabel>
                        <Select
                            value={tempLevel}
                            label="Change Level"
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
                label="Add Comment"
                size="small"
                fullWidth
                multiline
                maxRows={3}
                disabled={isClosed}
                value={comment}
                onChange={(e) => onChangeComment(e.target.value)}
            />

            <FormControl size="small" sx={{ minWidth: 200 }} disabled={isClosed}>
                <InputLabel>Assign Technician</InputLabel>
                <Select
                    value={tempAssignedTech}
                    label="Assign Technician"
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
                {/* Save Changes: solo si NO está cerrado */}
                {!isClosed && (
                    <Button
                        variant="contained"
                        onClick={onSave}
                        sx={{ borderRadius: 30, bgcolor: "#FFBE02", color: "#212121" }}
                    >
                        Save Changes
                    </Button>
                )}

                {/* Close Ticket: solo si NO está cerrado y NO es técnico */}
                {!isClosed && !isTechnician && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onClose}
                        sx={{ borderRadius: 30 }}
                    >
                        Close Ticket
                    </Button>
                )}
            </Box>
        </Box>
    );
}
