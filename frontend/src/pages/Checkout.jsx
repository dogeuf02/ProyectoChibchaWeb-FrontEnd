import { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Divider,
    Button,
} from '@mui/material';
import PaymentMethodSelector from '../components/Payments/PaymentMethodSelector';
import { createPlanAdquirido } from '../api/planAdquiridoApi';
import { useGlobalAlert } from '../context/AlertContext';

export default function CheckoutPage() {
    // Mock plan
    const selectedPlan = {
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
    };

    // Mock payment methods
    const [paymentMethods, setPaymentMethods] = useState([
        {
            id: 1,
            cardType: 'visa',
            cardNumber: '4111111111111111',
            expiryDate: '2026-01',
        },
        {
            id: 2,
            cardType: 'mastercard',
            cardNumber: '5500000000000004',
            expiryDate: '2025-08',
        },
    ]);

    const { showAlert } = useGlobalAlert();


    const [selectedMethodId, setSelectedMethodId] = useState(paymentMethods[0]?.id || null);

    const handleDelete = (id) => {
        const updated = paymentMethods.filter((m) => m.id !== id);
        setPaymentMethods(updated);
        if (selectedMethodId === id) {
            setSelectedMethodId(updated[0]?.id || null);
        }
    };

    const handlePay = async () => {
        if (!selectedMethodId) {
            showAlert('Please select a payment method.', 'warning');
            return;
        }

        const clienteId = 10002;
        const planClienteId = 1;
        const planPagoId = 1;

        const fechaHoy = new Date();
        const fechaCompra = fechaHoy.toISOString().split('T')[0];
        const fechaExpiracion = new Date(fechaHoy);
        fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 1);
        const fechaExpStr = fechaExpiracion.toISOString().split('T')[0];

        const payload = {
            idPlanAdquirido: 1,
            estadoPlan: 'ACTIVO',
            fechaCompra, 
            fechaExpiracion: fechaExpStr,
            fechaActualizacion: new Date().toISOString(),
            precioPlanAdquirido: selectedPlan.price.toFixed(2),
            cliente: clienteId,
            planCliente: planClienteId,
            planPago: planPagoId,
        };

        console.log(payload);

        try {
            const response = await createPlanAdquirido(payload);
            console.log('✅ Plan registered:', response.data);
            showAlert('Payment successful!', 'success');
            // Opcional: redirigir o limpiar
        } catch (error) {
            console.error('❌ Error during payment:', error);
            showAlert('There was a problem processing your payment.', 'error');
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
                                {selectedPlan.name}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1">Billing Cycle:</Typography>
                            <Typography variant="body1" sx={{ color: '#212121' }}>
                                {selectedPlan.interval}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle1" gutterBottom align="left">
                            Features:
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {selectedPlan.features.map((feat, i) => {
                                const [label, value] = feat.split(':').map((s) => s.trim());
                                return (
                                    <Box
                                        key={i}
                                        sx={{ display: 'flex', justifyContent: 'space-between' }}
                                    >
                                        <Typography variant="body2" sx={{ color: '#212121' }}>
                                            {label}:
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#212121' }}>
                                            {value}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Typography variant="h6">Total:</Typography>
                            <Typography variant="h6" sx={{ color: '#FF6400' }}>
                                ${selectedPlan.price.toFixed(2)}
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
        </Box>
    );
}
