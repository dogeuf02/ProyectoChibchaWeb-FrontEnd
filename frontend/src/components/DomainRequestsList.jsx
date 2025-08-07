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
import { useTranslation } from "react-i18next";

function Row({ request, onAccept, onReject, onGenerateXml }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const fullDomain = `${request.dominio.nombreDominio}${request.dominio.tld}`;

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
                <TableCell>{request.dominio.estado}</TableCell>
                <TableCell>{request.nombreUsuario || "-"}</TableCell>
                <TableCell>{request.rolUsuario || "-"}</TableCell>
                <TableCell>{request.nombreAdmin || "-"}</TableCell> {/*Placeholder for reviewedBy */}
            </TableRow>

            <TableRow>
                <TableCell colSpan={7} sx={{ bgcolor: '#fafafa', p: 0 }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="subtitle1" gutterBottom color="text.primary">
                                {t('domainRequestsManagement.list.details')}
                            </Typography>
                            <Typography variant="body2">{t('domainRequestsManagement.list.id')}: {request.idSolicitud}</Typography>
                            <Typography variant="body2">{t('domainRequestsManagement.list.fullDomain')}: {fullDomain}</Typography>
                            <Typography variant="body2">{t('domainRequestsManagement.list.domainStatus')}: {request.dominio.estado}</Typography>
                            <Typography variant="body2">{t('domainRequestsManagement.list.requestStatus')}: {request.estado}</Typography>

                            <Typography variant="subtitle2" sx={{ mt: 2 }}>{t('domainRequestsManagement.list.applicantInfo')}</Typography>
                            <Typography variant="body2">{t('domainRequestsManagement.list.applicantName')}: {request.nombreUsuario || "-"}</Typography>
                            <Typography variant="body2">{t('domainRequestsManagement.list.applicantRole')}: {request.rolUsuario || "-"}</Typography>

                            {request.estado === 'En Revision' && (
                                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        sx={{ borderRadius: 30 }}
                                        onClick={() => onAccept(request)}
                                    >
                                        {t('domainRequestsManagement.list.accept')}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={{ borderRadius: 30 }}
                                        onClick={() => onReject(request)}
                                    >
                                        {t('domainRequestsManagement.list.reject')}
                                    </Button>
                                </Box>
                            )}{request.estado === 'Aprobada' && (
                                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ borderRadius: 30 }}
                                        onClick={() => onGenerateXml(request.idSolicitud)}
                                    >
                                        Generar XML
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

export default function DomainRequestsList({ domainRequests, onAccept, onReject, onGenerateXml }) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder={t('domainRequestsManagement.list.searchField')}
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
                            <TableCell><b>{t('domainRequestsManagement.list.domain')}</b></TableCell>
                            <TableCell><b>{t('domainRequestsManagement.list.domainStatus')}</b></TableCell>
                            <TableCell><b>{t('domainRequestsManagement.list.requestStatus')}</b></TableCell>
                            <TableCell><b>{t('domainRequestsManagement.list.applicant')}</b></TableCell>
                            <TableCell><b>{t('domainRequestsManagement.list.applicantRole')}</b></TableCell>
                            <TableCell><b>{t('domainRequestsManagement.list.reviewedBy')}</b></TableCell>
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
                                    onGenerateXml={onGenerateXml}
                                />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
