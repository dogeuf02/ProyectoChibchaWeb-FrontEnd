import React from 'react';
import MiniDrawer from '../components/MiniDrawer';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Box from '@mui/material/Box';

export default function DashboardLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar sx={{ zIndex: theme => theme.zIndex.drawer + 1 }} />
      <MiniDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px' }}>
        <Outlet />
      </Box>
    </Box>

  );
}
