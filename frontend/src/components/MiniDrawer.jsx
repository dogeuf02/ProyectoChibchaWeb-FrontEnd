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
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DnsIcon from '@mui/icons-material/Dns';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PeopleIcon from '@mui/icons-material/People';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';

// Cambiar esta constante según el rol actual del usuario:
const rol = localStorage.getItem("userRole");


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
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const [openManage, setOpenManage] = React.useState(false);

  const toggleDrawer = () => setOpen(!open);
  const handleToggleManage = () => setOpenManage((prev) => !prev);

  const manageItems = [
    { text: 'Clients', icon: <PeopleIcon />, path: '/admin/Manageclients' },
    { text: 'Distributors', icon: <SupervisorAccountIcon />, path: '/admin/ManageDistributors' },
    { text: 'Employees', icon: <PersonIcon />, path: '/admin/ManageEmployees' },
    { text: 'Domain Request', icon: <AssignmentIcon />, path: '/admin/ManageDomainRequests' },
    { text: 'Distributor Request', icon: <AssignmentIcon />, path: '/admin/ManageDistributorRequests' },
  ];

  // Para rutas dinámicas por rol
  const getPath = (base) => {
    if (rol === 'Administrador') return `/admin/${base}`;
    if (rol === 'Cliente') return `/client/${base}`;
    if (rol === 'Distribuidor') return `/distributor/${base}`;
    if (rol === 'Empleado') return `/employee/${base}`;
    return '/';
  };

  const sharedItems = [
    { text: 'Profile', icon: <AccountCircleIcon />, basePath: 'manageProfile' },
  ];

  const clientDistributorItems = [
    { text: 'Payments', icon: <CreditCardIcon />, basePath: 'payments' },
    { text: 'MyDomains', icon: <DnsIcon />, basePath: 'mydomains' },
    { text: 'Domain Request', icon: <DnsIcon />, basePath: 'DomainRequest' },
  ];

  const clientOnlyItems = [
    { text: 'My Plans', icon: <ListAltIcon />, path: '/client/myplans' },
  ];

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
              ? theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />
              : theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          {/* Botón Profile siempre visible para todos los roles */}
          {sharedItems.map(({ text, icon, basePath }) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => navigate(getPath(basePath))}
                sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}

          {/* Buttons solo para client y distributor */}
          {(rol === 'Cliente' || rol === 'Distribuidor') &&
            clientDistributorItems.map(({ text, icon, basePath }) => (
              <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={() => navigate(getPath(basePath))}
                  sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}

          {/* Solo para client: MyPlans */}
          {rol === 'client' &&
            clientOnlyItems.map(({ text, icon, path }) => (
              <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={() => navigate(path)}
                  sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}

          {/* Admin: Sección Manage */}
          {rol === 'Administrador' && (
            <>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={handleToggleManage}
                  sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                    <SupervisorAccountIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage" sx={{ opacity: open ? 1 : 0 }} />
                  {open && (openManage ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>

              <Collapse in={openManage} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {manageItems.map(({ text, icon, path }) => (
                    <ListItemButton key={text} sx={{ pl: open ? 6 : 2.5 }} onClick={() => navigate(path)}>
                      <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>{icon}</ListItemIcon>
                      <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </>
          )}

          {/* Logout siempre visible */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => navigate('/')}
              sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
