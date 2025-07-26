// src/components/NavbarMUI.jsx
import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function NavbarMUI() {

  const rol = 'usuario'; // Simulación de rol, reemplazar con lógica real
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#212121' }}>
      <Toolbar>
        <Box sx={{ backgroundColor: '#212121', flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button color="inherit">Chibchaweb</Button>
          <Button color="inherit">Domains</Button>
          <Button color="inherit">Hosting plan</Button>
          <Button color="inherit"
            component={Link}
            to="/RegisterDistributor"
          >Distributor</Button>
          {/* Visible solo para distribuidores */}

          {rol === 'admin' && (
            <Button color="inherit">asdfasdfasdf</Button>
          )}
        </Box>

        {rol === 'usuario' && (
          <Button component={Link}
            to="/Login" sx={{ backgroundColor: '#FF6300' }} variant="contained">Login</Button>
        )}

      </Toolbar>
    </AppBar>
  );
}