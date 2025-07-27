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
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

export default function NavbarMUI() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const rol = 'usuario'; // Puedes cambiar esto según tu lógica

  const navItems = [
    { label: 'Chibchaweb', to: '#Home' },
    { label: 'Domains', to: '#Domains' },
    { label: 'Hosting plan', to: '#Plans' },
    { label: 'Distributor', to: '#Distributor' },
  ];

  if (rol === 'admin') {
    navItems.push({ label: 'Admin', to: '/admin' });
  }

  const handleNavigateToSection = (hash) => {
    if (window.location.pathname !== '/') {
      window.location.href = '/' + hash; // redirige a "/#Section"
    } else {
      window.location.hash = hash; // actualiza hash sin recargar
    }
  };

  return (
    <>
      <AppBar
  position="fixed"
  sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#212121' }}
>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Menú lateral en móviles o botones normales en desktop */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile ? (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              navItems.map((item, index) => (
                <Button
                  key={index}
                  color="inherit"
                  onClick={() => handleNavigateToSection(item.to)}
                >
                  {item.label}
                </Button>
              ))
            )}
          </Box>

          {/* Botón Login */}
          {rol === 'usuario' && (
            <Button
              onClick={() => navigate('/login')}
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
          role="presentation"
          onClick={() => setDrawerOpen(false)}
        >
          <List>
            {navItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => handleNavigateToSection(item.to)}>
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
