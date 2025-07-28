import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
} from '@mui/material';

export default function DistributorInfo() {
  return (
    <Box id='Distributor' sx={{ bgcolor: '#f5f5f5', py: 8 }}>
      <Container>

        {/* Título */}
        <Typography variant="h2" align="center" gutterBottom>
          Distributor
        </Typography>

        {/* Texto descriptivo */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
            sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.8 }}
          >
            As a distributor you will be able to receive commission depending on your sales in Chibchaweb!
          </Typography>
        </Box>

        {/* Enlace para aplicar */}
        <Box sx={{ mt: 4 }}>
          <Typography align="center">
            <Link
              href="/RegisterDistributor"
              underline="hover"
              sx={{
                fontWeight: 'bold',
                fontSize: '1.2rem',
                color: '#FF6300',
                '&:hover': {
                  color: '#e55a00',
                },
              }}
            >
              Apply as a distributor →
            </Link>
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}
