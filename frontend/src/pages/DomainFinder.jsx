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
        if (!domainName.trim()) {
            showAlert(t("domainFinder.alert.emptyDomain"), "warning");
            return;
        }
        if (!selectedTld || selectedTld.trim() === "") {
            showAlert(t("domainFinder.alert.emptyTld"), "warning");
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
            console.error("Error calculating price:", error);
            setPriceResult({ error: t("domainFinder.error.priceFetch") });
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
                    showAlert(t("domainFinder.alert.loginAsClientOrDistributor"));
                    navigate(`/`);
            }
        } else {
            showAlert(t("domainFinder.alert.loginToGetDomain"));
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
                    {t("domainFinder.title")}
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
                    {/* Search */}
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
                            placeholder={t("domainFinder.input.placeholder")}
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
                            {t("domainFinder.searchButton")}
                        </Button>
                    </Box>

                    {/* Result section */}
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
                                        {t("domainFinder.loadingMessage")}
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
                                        {t("domainFinder.priceLabel", { price: priceResult })}
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
                                        {t("domainFinder.getDomainButton")}
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
