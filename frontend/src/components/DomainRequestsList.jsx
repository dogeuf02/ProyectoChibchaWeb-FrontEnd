import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Collapse,
    Box,
    Typography,
    IconButton,
    Button,
    TextField,
    InputAdornment
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function Row({ request, onAccept, onReject }) {
    const [open, setOpen] = useState(false);
    const fullDomain = `${request.nombreDominio}${request.tld}`;

    return (
        <>
            <TableRow hover sx={{ '& td': { borderColor: '#e0e0e0' } }}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{fullDomain}</TableCell>
                <TableCell>{request.estado}</TableCell>
                <TableCell>{request.estado}</TableCell>
                <TableCell>{request.nombreUsuario || "-"}</TableCell>
                <TableCell>{request.rolUsuario || "-"}</TableCell>
                <TableCell>-</TableCell> {/* Placeholder for reviewedBy */}
            </TableRow>

            <TableRow>
                <TableCell colSpan={7} sx={{ bgcolor: '#fafafa', p: 0 }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="subtitle1" gutterBottom color="text.primary">
                                Request Details
                            </Typography>
                            <Typography variant="body2">Request ID: {request.idSolicitud}</Typography>
                            <Typography variant="body2">Full Domain: {fullDomain}</Typography>
                            <Typography variant="body2">Domain Status: {request.estado}</Typography>
                            <Typography variant="body2">Request Status: {request.estado}</Typography>

                            <Typography variant="subtitle2" sx={{ mt: 2 }}>Applicant Info</Typography>
                            <Typography variant="body2">Name: {request.nombreUsuario || "-"}</Typography>
                            <Typography variant="body2">Role: {request.rolUsuario || "-"}</Typography>

                            {request.estado === 'pending' && (
                                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => onAccept(request.idSolicitud)}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => onReject(request.idSolicitud)}
                                    >
                                        Reject
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default function DomainRequestsList({ domainRequests, onAccept, onReject }) {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search by Domain or ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: 300 }}
                />
            </Box>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#fff3e0' }}>
                            <TableCell />
                            <TableCell><b>Domain</b></TableCell>
                            <TableCell><b>Domain Status</b></TableCell>
                            <TableCell><b>Request Status</b></TableCell>
                            <TableCell><b>Applicant</b></TableCell>
                            <TableCell><b>Role</b></TableCell>
                            <TableCell><b>Reviewed By</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(domainRequests || [])
                            .filter(req =>
                                `${req.nombreDominio}.${req.tld}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                req.idSolicitud.toString().includes(searchTerm)
                            )

                            .map((req) => (
                                <Row
                                    key={req.idSolicitud}
                                    request={req}
                                    onAccept={onAccept}
                                    onReject={onReject}
                                />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
