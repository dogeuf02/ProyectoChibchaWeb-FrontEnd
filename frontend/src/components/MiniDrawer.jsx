import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCardIcon from '@mui/icons-material/AddCard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DnsIcon from '@mui/icons-material/Dns';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import { useAuth } from '../context/AuthContext';
import { ROLE } from '../enum/roleEnum';

import { useTranslation } from 'react-i18next';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer() {
  const { authenticated, role, logout } = useAuth();
  const { t } = useTranslation();

  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const [openManage, setOpenManage] = React.useState(false);

  const toggleDrawer = () => setOpen(!open);
  const handleToggleManage = () => setOpenManage((prev) => !prev);

  const manageItems = [
    { text: t('drawer.clients'), icon: <PersonIcon />, path: '/admin/Manageclients' },
    { text: t('drawer.distributors'), icon: <PeopleIcon />, path: '/admin/ManageDistributors' },
    { text: t('drawer.employees'), icon: <RecentActorsIcon />, path: '/admin/ManageEmployees' },
    { text: t('drawer.domainRequests'), icon: <AssignmentIcon />, path: '/admin/ManageDomainRequests' },
    { text: t('drawer.distributorRequests'), icon: <AssignmentIcon />, path: '/admin/ManageDistributorRequests' },
    { text: t('drawer.domains'), icon: <DnsIcon />, path: '/admin/ManageDomains' },
    { text: t('drawer.plans'), icon: <ListAltIcon />, path: '/admin/ManagePlans' },
    { text: t('drawer.administrators'), icon: <AdminPanelSettingsIcon />, path: '/admin/manageAdministrators' },
  ];

  // Para rutas dinámicas por rol
  const getPath = (base) => {
    if (role === ROLE.ADMIN) return `/admin/${base}`;
    if (role === ROLE.CLIENT) return `/client/${base}`;
    if (role === ROLE.DISTRIBUTOR) return `/distributor/${base}`;
    if (role === ROLE.EMPLOYEE) return `/employee/${base}`;
    return '/';
  };

  const sharedItems = [
    { text: t('drawer.profile'), icon: <AccountCircleIcon />, basePath: 'manageProfile' },
  ];

  const clientDistributorItems = [
    { text: t('drawer.payments'), icon: <AddCardIcon />, basePath: 'paymentManagement' },
    { text: t('drawer.myDomains'), icon: <DnsIcon />, basePath: 'mydomains' },
    { text: t('drawer.domainRequest'), icon: <DomainVerificationIcon />, basePath: 'DomainRequest' },
    { text: t('drawer.myTickets'), icon: <ConfirmationNumberIcon />, basePath: 'MyTickets' },
  ];

  const clientOnlyItems = [
    { text: t('drawer.myPlans'), icon: <ListAltIcon />, path: '/client/myplans' }
  ];

  const employeeOnlyItems = [
    { text: 'Manage Tickets', icon: <ConfirmationNumberIcon />, path: '/Employee/ManageTickets' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            boxSizing: 'border-box',
            top: '64px',
            height: 'calc(100% - 64px)',
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={toggleDrawer}>
            {open
              ? theme.direction === 'rtl'
                ? <ChevronRightIcon />
                : <ChevronLeftIcon />
              : theme.direction === 'rtl'
                ? <ChevronLeftIcon />
                : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          {/* Profile siempre visible */}
          {sharedItems.map(({ text, icon, basePath }) => {
            const path = getPath(basePath);
            const selected = location.pathname === path;
            return (
              <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={() => navigate(path)}
                  selected={selected}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    color: '#212121',
                    '&:hover': { backgroundColor: '#FFBE02', color: '#212121' },
                    '&.Mui-selected': {
                      backgroundColor: '#FF6400',
                      color: '#FAFAFA',
                      '& .MuiListItemIcon-root': { color: '#FAFAFA' },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: '#FF6400',
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{ whiteSpace: 'pre-line' }}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}

          {/* Client & Distributor */}
          {(role === ROLE.CLIENT || role === ROLE.DISTRIBUTOR) &&
            clientDistributorItems.map(({ text, icon, basePath }) => {
              const path = getPath(basePath);
              const selected = location.pathname === path;
              return (
                <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    onClick={() => navigate(path)}
                    selected={selected}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      color: '#212121',
                      '&:hover': { backgroundColor: '#FFBE02', color: '#212121' },
                      '&.Mui-selected': {
                        backgroundColor: '#FF6400',
                        color: '#FAFAFA',
                        '& .MuiListItemIcon-root': { color: '#FAFAFA' },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: '#FF6400',
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{ whiteSpace: 'pre-line' }}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}

          {/* ✅ Solo para CLIENT */}
          {role === ROLE.CLIENT &&
            clientOnlyItems.map(({ text, icon, path }) => {
              const selected = location.pathname === path;
              return (
                <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    onClick={() => navigate(path)}
                    selected={selected}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      color: '#212121',
                      '&:hover': { backgroundColor: '#FFBE02', color: '#212121' },
                      '&.Mui-selected': {
                        backgroundColor: '#FF6400',
                        color: '#FAFAFA',
                        '& .MuiListItemIcon-root': { color: '#FAFAFA' },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: '#FF6400',
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{ whiteSpace: 'pre-line' }}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}

          {/* Admin - Sección Manage */}
          {role === ROLE.ADMIN && (
            <>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={handleToggleManage}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    color: '#212121',
                    '&:hover': { backgroundColor: '#FFBE02', color: '#212121' },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: '#FF6400',
                    }}
                  >
                    <ManageAccountsIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('drawer.manage')} sx={{ opacity: open ? 1 : 0 }} />
                  {open && (openManage ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>

              <Collapse in={openManage} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {manageItems.map(({ text, icon, path }) => {
                    const selected = location.pathname === path;
                    return (
                      <ListItemButton
                        key={text}
                        onClick={() => navigate(path)}
                        selected={selected}
                        sx={{
                          pl: open ? 6 : 2.5,
                          color: '#212121',
                          '&:hover': { backgroundColor: '#FFBE02', color: '#212121' },
                          '&.Mui-selected': {
                            backgroundColor: '#FF6400',
                            color: '#FAFAFA',
                            '& .MuiListItemIcon-root': { color: '#FAFAFA' },
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 0, mr: 2, color: '#FF6400' }}>
                          {icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={text}
                          primaryTypographyProps={{ whiteSpace: 'pre-line' }}
                          sx={{ opacity: open ? 1 : 0 }}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            </>
          )}

          {/* Solo para EMPLOYEE */}
          {role === ROLE.EMPLOYEE &&
            employeeOnlyItems.map(({ text, icon, path }) => {
              const selected = location.pathname === path;
              return (
                <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    onClick={() => navigate(path)}
                    selected={selected}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      color: '#212121',
                      '&:hover': { backgroundColor: '#FFBE02', color: '#212121' },
                      '&.Mui-selected': {
                        backgroundColor: '#FF6400',
                        color: '#FAFAFA',
                        '& .MuiListItemIcon-root': { color: '#FAFAFA' },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: '#FF6400',
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{ whiteSpace: 'pre-line' }}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}

          {/* Logout siempre visible */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={t('drawer.logout')} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
