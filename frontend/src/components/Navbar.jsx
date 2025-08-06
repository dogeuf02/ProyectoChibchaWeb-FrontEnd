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
  Typography,
  Avatar
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { ROLE } from '../enum/roleEnum';

export default function NavbarMUI() {
  const { t, i18n } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { authenticated, role, logout } = useAuth();

  const navItems = [
    { label: t('title'), to: '#Home' },
    { label: t('domains.domainsTitle'), to: '#Domains' },
    { label: t('hosting.hostingTitle'), to: '#Plans' },
    { label: t('distributor.title'), to: '#Distributor' },
  ];

  const handleNavigateToSection = (hash) => {
    if (window.location.pathname !== '/') {
      window.location.href = '/' + hash;
    } else {
      window.location.hash = hash;
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  // ✅ Alternar idioma
  const handleLanguageToggle = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  // ✅ Bandera según idioma actual
  const getLanguageFlag = () => {
    return i18n.language === 'en'
      ? "https://flagcdn.com/w40/us.png" // Bandera EEUU
      : "https://flagcdn.com/w40/co.png"; // Bandera Colombia
  };

  const checkRole = (role) => {
    switch (role) {
      case ROLE.ADMIN: return "Administrator";
      case ROLE.CLIENT: return "Client";
      case ROLE.EMPLOYEE: return "Employee";
      case ROLE.DISTRIBUTOR: return "Distributor";
      default: return "";
    }
  };

  const menuItemsByRole = {
    [ROLE.ADMIN]: [
      { label: 'My Profile', path: '/admin' },
      { label: 'Clients Management', path: '/admin/ManageClients' },
      { label: 'Distributor Management', path: '/admin/ManageDistributors' },
      { label: 'Employees Management', path: '/admin/ManageEmployees' },
      { label: 'Domain Request Management', path: '/admin/ManageDomainRequests' },
      { label: 'Distributor Request Management', path: '/admin/ManageDistributorRequests' },
      { label: 'Domains Management', path: '/admin/ManageDomains' },
      { label: 'Plans Management', path: '/admin/ManagePlans' },
      { label: 'Administrators Management', path: '/admin/manageAdministrators' },
    ],
    [ROLE.CLIENT]: [
      { label: 'My Profile', path: '/client' },
      { label: 'Payment Management', path: '/client/paymentManagement' },
      { label: 'My Plans', path: '/client/myplans' },
      { label: 'My Domains', path: '/client/mydomains' },
      { label: 'Domain Request', path: '/client/DomainRequest' },
      { label: 'My Tickets', path: '/client/MyTickets' },
    ],
    [ROLE.DISTRIBUTOR]: [
      { label: 'My Profile', path: '/distributor' },
      { label: 'Payment Management', path: '/distributor/paymentManagement' },
      { label: 'My Domains', path: '/distributor/mydomains' },
      { label: 'Domain Request', path: '/distributor/DomainRequest' },
      { label: 'My Tickets', path: '/distributor/MyTickets' },
    ],
    [ROLE.EMPLOYEE]: [
      { label: 'My Profile', path: '/employee' },
      { label: 'Tickets Management', path: '/employee/ManageTickets' },
    ],
  };

  const roleMenuItems = menuItemsByRole[role] || [];

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#212121' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Izquierda: Navegación */}
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

          {/* Derecha: idioma + login/usuario */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* ✅ Bandera idioma actual */}
            <IconButton onClick={handleLanguageToggle}>
              <Avatar
                src={getLanguageFlag()}
                alt="Language"
                sx={{ width: 28, height: 28 }}
              />
            </IconButton>

            {!authenticated ? (
              <Button
                onClick={() => navigate('/login')}
                variant="contained"
                sx={{
                  backgroundColor: '#FF6300',
                  borderRadius: 30,
                  '&:hover': { bgcolor: '#ffc107', color: '#212121' }
                }}
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

                  {roleMenuItems.map((item, idx) => (
                    <MenuItem
                      key={idx}
                      onClick={() => { navigate(item.path); handleMenuClose(); }}
                    >
                      {item.label}
                    </MenuItem>
                  ))}

                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </Box>
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
