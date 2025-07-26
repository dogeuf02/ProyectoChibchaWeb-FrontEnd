// src/components/NavbarMUI.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

export default function NavbarMUI() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const rol = 'usuario'; // lógica de rol simulada

  const navItems = [
    { label: 'Chibchaweb', to: '/' },
    { label: 'Domains', to: '/Domains' },
    { label: 'Hosting plan', to: '/Plans' },
    { label: 'Distributor', to: '/RegisterDistributor' },
  ];

  if (rol === 'admin') {
    navItems.push({ label: 'Admin', to: '/admin' });
  }

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: '#212121' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Parte izquierda del navbar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile ? (
              <>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={() => setDrawerOpen(true)}
                >
                  <MenuIcon />
                </IconButton>
              </>
            ) : (
              navItems.map((item, index) => (
                <Button
                  key={index}
                  color="inherit"
                  component={Link}
                  to={item.to}
                >
                  {item.label}
                </Button>
              ))
            )}
          </Box>

          {/* Botón Login*/}
          {rol === 'usuario' && (
            <Button
              component={Link}
              to="/Login"
              variant="contained"
              sx={{ backgroundColor: '#FF6300' }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer lateral en móviles */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: 250 }}
          onClick={() => setDrawerOpen(false)}
          role="presentation"
        >
          <List>
            {navItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton component={Link} to={item.to}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
