import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';

import { useTranslation } from 'react-i18next';

export default function DistributorInfo() {

  const {t} = useTranslation();

  return (
    <Box id="Distributor" sx={{ bgcolor: '#FAFAFA', py: 8 }}>
      <Container maxWidth="md">
        <Card
          sx={{
            borderRadius: '30px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            textAlign: 'center',
            bgcolor: '#fff',
          }}
        >
          <CardContent sx={{ py: 6, px: 4 }}>
            {/* Título */}
            <Typography
              variant="h3"
              gutterBottom
              sx={{ color: '#212121', fontWeight: 'bold' }}
            >
               {t('distributor.title')}
            </Typography>

            {/* Descripción */}
            <Typography
              variant="h6"
              sx={{
                color: '#9E9E9E',
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.8,
                mb: 4,
              }}
            >
              {t('distributor.description')}
              <strong> Chibchaweb!</strong> Join our program and start growing your business with us.
            </Typography>

            {/* Botón de acción */}
            <Button
              href="/RegisterDistributor"
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#FF6300',
                borderRadius: '30px',
                px: 5,
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#e55a00',
                },
              }}
            >
              {t('Distributor.applyLink')}
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
