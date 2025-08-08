import React, { useEffect, useState, useRef } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    InputAdornment,
    Card,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { getTlds } from '../api/tldApi';
import { getCalculatedPrice } from '../api/domainApi';
import { useAuth } from '../context/AuthContext';
import { ROLE } from "../enum/roleEnum";
import { useGlobalAlert } from "../context/AlertContext";
import { useNavigate } from "react-router-dom";

export default function DomainFinder() {

    const navigate = useNavigate();
    const { showAlert } = useGlobalAlert();
    const { t } = useTranslation();
    const { authenticated, role } = useAuth();

    const [tlds, setTlds] = useState([]);
    const [selectedTld, setSelectedTld] = useState('');
    const [domainName, setDomainName] = useState('');
    const [loading, setLoading] = useState(false);
    const [priceResult, setPriceResult] = useState(null);
    // const [domainError, setDomainError] = useState(false); // NUEVO estado para error
    const MIN_LOADING_MS = 1000;
    const requestIdRef = useRef(0);

    const fetchTlds = async () => {
        const result = await getTlds();
        if (result && result.length > 0) {
            setTlds(result);
            setSelectedTld(result[0].tld);
        }
    };

    useEffect(() => {
        fetchTlds();
    }, []);

    const handleSearch = async () => {
        // validar campo vacío
        if (!domainName.trim()) {
            showAlert("El campo de dominio no puede estar vacío", "warning");
            return;
        }

        const thisRequestId = ++requestIdRef.current;
        setLoading(true);
        setPriceResult(null);

        const domainRequest = {
            domain: domainName.trim(),
            tld: selectedTld
        };

        const start = Date.now();
        try {
            const result = await getCalculatedPrice(domainRequest);
            const elapsed = Date.now() - start;

            if (elapsed < MIN_LOADING_MS) {
                await new Promise((res) => setTimeout(res, MIN_LOADING_MS - elapsed));
            }

            if (requestIdRef.current !== thisRequestId) return;

            setPriceResult(result);
        } catch (error) {
            if (requestIdRef.current !== thisRequestId) return;
            console.error("Error al calcular precio:", error);
            setPriceResult({ error: "No se pudo obtener el precio" });
        } finally {
            if (requestIdRef.current === thisRequestId) {
                setLoading(false);
            }
        }
    };

    const handleGetDomain = () => {
        if (authenticated) {
            switch (role) {
                case ROLE.CLIENT:
                    navigate(`/client/DomainRequest`);
                    break;
                case ROLE.DISTRIBUTOR:
                    navigate(`/distributor/DomainRequest`);
                    break;
                default:
                    showAlert("Debes iniciar sesión como cliente o distribuidor");
                    navigate(`/`);
            }
        } else {
            showAlert("Debes iniciar sesión para obtener un dominio.");
        }
    };

    return (
        <Box id="Domains" sx={{ bgcolor: '#FAFAFA', py: 8 }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h3"
                    align="center"
                    sx={{
                        fontWeight: 'bold',
                        mb: 6,
                        color: '#212121',
                        fontFamily: "'Roboto', sans-serif"
                    }}
                >
                    Encuentra el dominio que se ajusta a tus necesidades
                </Typography>

                <Card
                    sx={{
                        borderRadius: '30px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                        bgcolor: '#fff',
                        p: 4,
                        transition: 'all 0.3s ease',
                    }}
                >
                    {/* Buscador */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 2,
                            flexWrap: 'wrap',
                        }}
                    >
                        <TextField
                            placeholder="Escribe el nombre del dominio"
                            value={domainName}
                            onChange={(e) => setDomainName(e.target.value)}

                            sx={{
                                minWidth: 300,
                                '& label': { color: '#a5a5a5ff' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#bdbdbd' },
                                    '&:hover fieldset': { borderColor: '#ff6f00' },
                                    '&.Mui-focused fieldset': { borderColor: '#ffc107' },
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Select
                            value={selectedTld}
                            onChange={(e) => setSelectedTld(e.target.value)}
                            sx={{
                                minWidth: 120,
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#bdbdbd' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6f00' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ffc107' },
                            }}
                        >
                            {tlds.map((item, index) => (
                                <MenuItem key={index} value={item.tld}>
                                    {item.tld}
                                </MenuItem>
                            ))}
                        </Select>

                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: '#ff6f00',
                                borderRadius: 30,
                                px: 4,
                                height: '56px',
                                '&:hover': { bgcolor: '#ffc107', color: '#212121' }
                            }}
                            onClick={handleSearch}
                        >
                            Buscar
                        </Button>
                    </Box>

                    {/* Sección de resultado */}
                    {(loading || priceResult) && (
                        <Box
                            sx={{
                                mt: 4,
                                textAlign: 'center',
                                borderTop: '1px solid #eee',
                                pt: 3
                            }}
                        >
                            {loading ? (
                                <Box>
                                    <CircularProgress size={28} sx={{ color: '#ff6f00', mb: 1 }} />
                                    <Typography variant="body1" color="text.secondary">
                                        Calculando precio del dominio...
                                    </Typography>
                                </Box>
                            ) : priceResult?.error ? (
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 'bold', color: '#212121', mb: 1 }}
                                >
                                    {priceResult.error}
                                </Typography>
                            ) : (
                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 'bold', color: '#212121', mb: 1 }}
                                    >
                                        Precio: ${priceResult} USD
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="medium"
                                        onClick={handleGetDomain}
                                        sx={{
                                            bgcolor: '#FF6400',
                                            borderRadius: '30px',
                                            textTransform: 'none',
                                            px: 4,
                                            '&:hover': {
                                                bgcolor: '#e25a00',
                                            },
                                        }}
                                    >
                                        Obtener dominio
                                    </Button>
                                </Box>

                            )}
                        </Box>
                    )}
                </Card>
            </Container>
        </Box>
    );
}
