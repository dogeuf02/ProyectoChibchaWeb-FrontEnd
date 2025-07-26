import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';


export default function Home() {
  return (
    <Box
      id="Home"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: '#FAFAFA',
        bgcolor: '#212121',
      }}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // columna en móvil, fila en desktop
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4, // espacio entre texto e imagen
        }}
      >
        {/* Texto */}
        <Box
          sx={{
            flex: 1,
            textAlign: 'left',
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Chibchaweb
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'grey.400', lineHeight: 2 }}
          >
            Top web hosting company in Colombia.<br />
            ✓ Flexible plans for clients.<br />
            ✓ Commercial agreements for distributors.<br />
            ✓ Technical support service<br />
            ✓ Direct agreements with registrators
          </Typography>
        </Box>

        {/* Imagen */}
        <Box
          component="img"
          src="/banner.png"
          alt="Banner"
          sx={{
            flex: 1,
            width: '100%',
            maxWidth: 400,
            objectFit: 'contain',
          }}
        />
      </Container>
    </Box>
  );
}
