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
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function NavbarMUI() {
  const {t} = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { authenticated, role, logout } = useAuth();
  const rolePathMap = {
  Administrador: '/admin/ManageProfile',
  Cliente: '/client/ManageProfile',
  Distribuidor: '/distributor/ManageProfile',
  Empleado: '/employee/ManageProfile'
};

  const navItems = [
    { label: t('title'), to: '#Home' },
    { label: t('domains.domainsTitle'), to: '#Domains' },
    { label: t('hosting.hostingTitle'), to: '#Plans' },
    { label: t('distributor.title'), to: '#Distributor' },
  ];

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
    switch (role) {
      case "Administrador":
        navigate('/admin/ManageProfile');
        break;
      case "Cliente":
        navigate('/client/ManageProfile');
        break;
      case "Empleado":
        navigate('/employee/ManageProfile');
        break;
      case "Distribuidor":
        navigate('/distributor/ManageProfile'); break;
    }
  };

  const checkRole = (role) =>{
    switch(role){
      case "Administrador":
        return "Administrator"
      case "Cliente":
        return "Client"
      case "Empleado":
        return "Employee"
      case "Distribuidor":
        return "Distributor" 
    }
  }


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
            <LanguageSwitcher/>
          {/* Botón Login */}
          {/* Autenticado: menú, no autenticado: login */}

          {!authenticated ? (
            <Button
              onClick={() => navigate('/login')}
              variant="contained"
              sx={{ backgroundColor: '#FF6300' }}
            >
              {t('login.button')}
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
                    {checkRole(role)}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleGoToProfile}>My profile</MenuItem>
                {role === 'Administrador' && (
                  <MenuItem onClick={() => { navigate('/admin/ManageEmployees'); handleMenuClose(); }}>
                    Employees management
                  </MenuItem>

                )}
                {role === 'Administrador' && (
                  <MenuItem onClick={() => { navigate('/admin/ManageDistributors'); handleMenuClose(); }}>
                    Distributors management
                  </MenuItem>

                )}
                {role === 'Administrador' && (
                  <MenuItem onClick={() => { navigate('/admin/ManageClients'); handleMenuClose(); }}>
                    Clients management
                  </MenuItem>

                )}
                {role === 'Administrador' && (
                  <MenuItem onClick={() => { navigate('/admin/ManageDistributorRequests'); handleMenuClose(); }}>
                    Manage distributor requests
                  </MenuItem>

                )}
                {role === 'Empleado' && (
                  <MenuItem onClick={() => { navigate('/'); handleMenuClose(); }}>
                    Employee panel
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
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
