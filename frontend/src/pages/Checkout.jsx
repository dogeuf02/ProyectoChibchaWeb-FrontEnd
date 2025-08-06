import {
    Box,
    Paper,
    Typography,
    Divider,
    Button,
} from '@mui/material';
import PaymentMethodSelector from '../components/Payments/PaymentMethodSelector';
import { createPlanAdquirido } from '../api/purchasedPlanApi';
import { useGlobalAlert } from '../context/AlertContext';
import { useGlobalLoading } from '../context/LoadingContext';
import { useEffect, useState } from 'react';
import { getPayMethodsByUserId } from '../api/payMethodApi';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';
import { deletePayMethod } from '../api/payMethodApi';
import { getBanks } from '../api/payMethodApi';
import { useTranslation } from 'react-i18next';

export default function CheckoutPage() {
    // Mock plan
    const { t } = useTranslation();
    const [selectedPlan, setSelectedPlan] = useState({
        name: 'CHIBCHA-PLATINUM',
        interval: 'Annual',
        price: 240.0,
        features: [
            'NVMe Storage: 100GB',
            'SSL Certificates: 5',
            'Email Accounts: 100',
            'Email Marketing: Included',
            'Website Builder: Included',
        ],
    });

    const [bankOptions, setBankOptions] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedMethodId, setSelectedMethodId] = useState(paymentMethods[0]?.id || null);
    //const [checkoutData, setCheckoutData] = useState(null);

    const { role, specificId } = useAuth();
    const { showAlert } = useGlobalAlert();
    const { showLoader, hideLoader } = useGlobalLoading();

    useEffect(() => {
        const checkoutData = JSON.parse(localStorage.getItem('checkoutData'));
        console.log("checkout from checkout:", checkoutData);
        setSelectedPlan({
            idPlan: checkoutData.idPlanCliente,
            idPlanPago: checkoutData.modalidad.idPlanPago,
            nombrePlanCliente: checkoutData.nombrePlanCliente,
            intervaloPago: checkoutData.modalidad.intervaloPago,
            almacenamientoNvme: checkoutData.caracteristicas.almacenamientoNvme,
            creadorWeb: checkoutData.caracteristicas.creadorWeb,
            emailMarketing: checkoutData.caracteristicas.emailMarketing,
            numeroBaseDatos: checkoutData.caracteristicas.numeroBaseDatos,
            numeroCertificadoSslHttps: checkoutData.caracteristicas.numeroCertificadoSslHttps,
            numeroCuentasCorreo: checkoutData.caracteristicas.numeroCuentasCorreo,
            numeroWebs: checkoutData.caracteristicas.numeroWebs,
            price: checkoutData.modalidad.precio,
        });
    }, [])

    useEffect(() => {
        const fetchPayments = async () => {
            if (specificId && role) {
                const normalizedRole = role.toLowerCase();
                const response = await getPayMethodsByUserId(normalizedRole, specificId);
                if (response.exito && Array.isArray(response.data)) {
                    const adapted = response.data.map((p) => ({
                        id: p.idMedioPago,
                        cardType: p.tipoMedioPago,
                        cardNumber: p.numeroTarjetaCuenta,
                        expiryDate: p.fechaExpiracion || 'N/A',
                    }));
                    setPaymentMethods(adapted);
                    setSelectedMethodId(adapted[0]?.id || null);
                }
            }
        };

        const fetchBanks = async () => {
            const response = await getBanks();
            if (response.exito) {
                setBankOptions(response.data); // [{ idBanco, nombreBanco }]
            } else {
                showAlert('Failed to load banks', 'error');
            }
        };

        fetchPayments();
        fetchBanks();
    }, [role, specificId]);


    const handleDelete = (id) => {
        setSelectedIdToDelete(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedIdToDelete) return;

        const response = await deletePayMethod(selectedIdToDelete);
        if (response.exito) {
            showAlert('Payment method deleted successfully', 'success');
            // Refrescar lista
            const normalizedRole = role.toLowerCase();
            const updated = await getPayMethodsByUserId(normalizedRole, specificId);
            if (updated.exito) {
                const adapted = updated.data.map((p) => ({
                    id: p.idMedioPago,
                    cardType: p.tipoMedioPago,
                    cardNumber: p.numeroTarjetaCuenta,
                    expiryDate: p.fechaExpiracion || 'N/A',
                }));
                setPaymentMethods(adapted);
                setSelectedMethodId(adapted[0]?.id || null);
            }
        } else {
            showAlert(response.mensaje || 'Failed to delete payment method', 'error');
        }

        setConfirmOpen(false);
        setSelectedIdToDelete(null);
    };


    const handlePay = async () => {
        if (!selectedMethodId) {
            showAlert('Please select a payment method.', 'warning');
            return;
        }

        //const specificId = 10002;
        const planClienteId = selectedPlan;
        const planPagoId = 1;

        const fechaHoy = new Date();
        const fechaCompra = fechaHoy.toISOString().split('T')[0];
        const fechaExpiracion = new Date(fechaHoy);
        fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 1);
        const fechaExpStr = fechaExpiracion.toISOString().split('T')[0];

        const payload = {
            //idPlanAdquirido: s,
            estadoPlan: 'ACTIVO',
            fechaCompra,
            fechaExpiracion: fechaExpStr,
            fechaActualizacion: new Date().toISOString(),
            precioPlanAdquirido: selectedPlan.price,
            cliente: specificId,
            planCliente: selectedPlan.idPlan,
            planPago: selectedPlan.idPlanPago,
        };

        console.log(payload);

        try {
            showLoader();

            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await createPlanAdquirido(payload);
            console.log('✅ Plan registered:', response.data);
            localStorage.removeItem('checkoutData');
            showAlert('Payment successful!', 'success');
        } catch (error) {
            console.error('❌ Error during payment:', error);
            showAlert('There was a problem processing your payment.', 'error');
        } finally {
            hideLoader();
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Checkout Summary
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    gap: 4,
                    mt: 4,
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                }}
            >
                {/* PAYMENT SELECTOR */}
                <Box sx={{ flex: '0 1 700px', maxWidth: 550 }}>
                    <PaymentMethodSelector
                        methods={paymentMethods}
                        selectedId={selectedMethodId}
                        onSelect={setSelectedMethodId}
                        onDelete={handleDelete}
                        onAdd={(newEntry) => {
                            setPaymentMethods((prev) => [...prev, newEntry]);
                            setSelectedMethodId(newEntry.id);
                        }}
                        bankOptions={bankOptions}
                    />


                </Box>

                {/* PLAN SUMMARY */}
                <Box sx={{ width: 400 }}>
                    <Paper sx={{ p: 4, bgcolor: '#FAFAFA' }} elevation={3}>
                        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                            Selected Plan
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1">Plan:</Typography>
                            <Typography variant="body1" sx={{ color: '#FF6400' }}>
                                {selectedPlan.nombrePlanCliente}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1">Billing Cycle:</Typography>
                            <Typography variant="body1" sx={{ color: '#212121' }}>
                                {selectedPlan.intervaloPago}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle1" gutterBottom align="left">
                            Features:
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: "left", gap: 1 }}>
                            <Typography variant="body1">
                                <strong>• {selectedPlan.numeroBaseDatos} </strong>
                                {t("hosting.hostingPlans.features.databases")}
                            </Typography>
                            <Typography variant="body1">
                                <strong>• {selectedPlan.numeroWebs} </strong>
                                {t("hosting.hostingPlans.features.websites")}
                            </Typography>
                            <Typography variant="body1">
                                <strong>• {selectedPlan.almacenamientoNvme} </strong>
                                {t("hosting.hostingPlans.features.storage")}
                            </Typography>
                            <Typography variant="body1">
                                <strong>• {selectedPlan.numeroCuentasCorreo} </strong>
                                {t("hosting.hostingPlans.features.emailAccounts")}
                            </Typography>
                            {selectedPlan.creadorWeb && (
                                <Typography variant="body1">
                                    <strong>• </strong>
                                    {t("hosting.hostingPlans.features.builder")}
                                </Typography>
                            )}
                            <Typography variant="body1">
                                <strong>• {selectedPlan.numeroCertificadoSslHttps} </strong>
                                {t("hosting.hostingPlans.features.sslCertificates")}
                            </Typography>
                            {selectedPlan.emailMarketing && (
                                <Typography variant="body1">
                                    <strong>• </strong>
                                    {t("hosting.hostingPlans.features.emailMarketing")}
                                </Typography>
                            )}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Typography variant="h6">Total:</Typography>
                            <Typography variant="h6" sx={{ color: '#FF6400' }}>
                                ${selectedPlan.price.toFixed(2)} dolarines
                            </Typography>
                        </Box>
                    </Paper>

                    <Box textAlign="right" sx={{ mt: 4 }}>
                        <Button
                            variant="contained"
                            onClick={handlePay}
                            sx={{
                                px: 6,
                                py: 1.5,
                                borderRadius: 30,
                                bgcolor: '#FF6400',
                                '&:hover': { bgcolor: '#FFBE02' },
                            }}
                        >
                            Pay Now
                        </Button>
                    </Box>
                </Box>
            </Box>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Payment Method"
                message="Are you sure you want to delete this payment method? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />
        </Box>
    );
}
