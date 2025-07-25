import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

export default function MainLayout({ children }) {
  return (
    <Box display="flex" flexDirection="column" minHeight="120vh">
      <Navbar />

      <Container component="main" sx={{ flex: 1, py: 2 }}>
        {children}
      </Container>

      <Footer />
    </Box>
  );
}