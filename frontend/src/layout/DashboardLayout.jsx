import React from 'react';
import MiniDrawer from '../components/MiniDrawer';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div style={{ display: 'flex' }}>
      <MiniDrawer />
      <main style={{ flexGrow: 1, padding: '1rem', marginTop: '64px' }}>
        <Outlet />
      </main>
    </div>
  );
}
