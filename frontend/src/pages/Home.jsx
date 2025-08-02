import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';


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
          <Typography
            variant="h2"
            sx={{ color: '#FFBE02', lineHeight: 2, fontWeight: 'bold'}}
          >
            CHIBCHAWEB
          </Typography>

          <Typography
            variant="h6"
            sx={{ color: 'grey.400', lineHeight: 2 }}
          >
            Top web hosting company in Colombia.<br />
            ✓ Flexible plans for clients.<br />
            ✓ Commercial agreements for distributors.<br />
            ✓ Technical support service<br />
            ✓ Direct agreements with registrators
          </Typography>
        </Box>

        {/* LOGO */}
        <Box
          component="img"
          src="/logo.png"
          alt="Banner"
          sx={{
            flex: 1,
            width: '100%',
            display: { xs: 'none', md: 'block' },
            width: '100%',
            maxWidth: 600 ,
            objectFit: 'contain',
          }}
        />
      </Container>
    </Box>
  );
}
