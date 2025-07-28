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
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavbarMUI() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const rol = 'usuario'; // Puedes cambiar esto según tu lógica
  const [anchorEl, setAnchorEl] = useState(null);
  const { authenticated, role, logout } = useAuth();
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


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleGoToProfile = () => {
    handleMenuClose();
    navigate('/ManageProfile');
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
          {/* Autenticado: menú, no autenticado: login */}
          {console.log(authenticated + "is")}
          {!authenticated ? (
            <Button
              onClick={() => navigate('/login')}
              variant="contained"
              sx={{ backgroundColor: '#FF6300' }}
            >
              Login
            </Button>
          ) : (
            <>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                onClick={handleMenuOpen}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {role}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleGoToProfile}>Mi perfil</MenuItem>
                {role === 'Administrador' && (
                  <MenuItem onClick={() => { navigate('/admin/ManageEmployees'); handleMenuClose(); }}>
                    Gestión empleados
                  </MenuItem>
                  
                )}
                {role === 'Administrador' && (
                  <MenuItem onClick={() => { navigate('/admin/ManageDistributors'); handleMenuClose(); }}>
                    Gestión Distribuidores
                  </MenuItem>
                  
                )}
                 {role === 'Administrador' && (
                  <MenuItem onClick={() => { navigate('/admin/ManageClients'); handleMenuClose(); }}>
                    Gestión Clientes
                  </MenuItem>
                  
                )}
                {role === 'empleado' && (
                  <MenuItem onClick={() => { navigate('/dashboard-empleado'); handleMenuClose(); }}>
                    Panel empleado
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
              </Menu>
            </>
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
