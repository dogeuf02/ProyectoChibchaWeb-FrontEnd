// src/components/NavbarMUI.jsx
import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';

export default function NavbarMUI() {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#212121'}}>
      <Toolbar>
        <Box sx={{ backgroundColor: '#212121', flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button color="inherit">Chibchaweb</Button>
          <Button color="inherit">Domains</Button>
          <Button color="inherit">Hosting plan</Button>
          <Button color="inherit">Distributor</Button>
        </Box>
        <Button sx={{ backgroundColor: '#FF6300'}} variant="contained">Login</Button>
      </Toolbar>
    </AppBar>
  );
}