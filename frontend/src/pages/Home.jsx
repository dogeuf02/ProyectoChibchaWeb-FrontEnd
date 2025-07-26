import React from 'react';
import { Box, Typography, Button, Grid, Container, Link } from '@mui/material';

export default function PagPrincipal() {
  return (
    <>
      {/* Banner superior */}
      <Box
        sx={{
          backgroundColor: '#212121',
          color: '#fff',
          py: 6,
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            {/* Texto */}
            <Grid item xs={12} md={6}>
              <Typography variant="h4" color="#FF6300" gutterBottom>
                CHIBCHAWEB
              </Typography>
              <Typography variant="body1" paragraph>
                Top web hosting company in Colombia
              </Typography>
              <ul style={{ textAlign: 'left', paddingLeft: 20 }}>
                <li>Flexible plans for clients</li>
                <li>Commercial agreements for distributors</li>
                <li>Technical support service</li>
                <li>Direct agreements with registrators</li>
              </ul>
            </Grid>

            {/* Imagen (puedes reemplazar con la tuya) */}
            <Grid item xs={12} md={6} alignItems="Right">
              <Box
                component="img"
                src="/banner.png"
                alt="Illustration"
                sx={{ width: '100%', maxHeight: 300, objectFit: 'contain' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Sección de DOMINIOS */}
      <Box py={5} textAlign="center">
        <Typography variant="h5" color="#FF6300" gutterBottom>
          DOMAIN
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap', mt: 2 }}>
          {['.com', '.net', '.es', '.org', '.biz'].map((domain) => (
            <Typography key={domain} variant="h6">
              {domain}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Sección de HOSTING PLAN */}
      <Box py={5} textAlign="center">
        <Typography variant="h5" color="#FF6300" gutterBottom>
          HOSTING PLAN
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', mt: 2 }}>
          {['ChibchaOro', 'ChibchaPlata', 'ChibchaPlatino'].map((plan) => (
            <Typography key={plan} variant="h6" fontWeight="bold">
              {plan}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Sección DISTRIBUTOR */}
      <Box py={5} textAlign="center">
        <Typography variant="h5" color="#FF6300" gutterBottom>
          DISTRIBUTOR
        </Typography>
        <Typography variant="body1" paragraph>
          As a distributor you will be able to receive commission depending on your sales in Chibchaweb!
        </Typography>
        <Typography variant="body2">
          Do you want to be a partner?{' '}
          <Link href="#" sx={{ color: '#FF6300', fontWeight: 'bold' }}>
            Apply as Distributor
          </Link>
        </Typography>
      </Box>
    </>
  );
}
