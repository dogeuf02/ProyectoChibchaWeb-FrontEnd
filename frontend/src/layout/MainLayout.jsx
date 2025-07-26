import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

export default function MainLayout({ children }) {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }, [location]);


  return (
    <Box display="flex" flexDirection="column" minHeight="120vh" width={'100%'}>
      <Navbar />

      <Container
        component="main"
        disableGutters
        maxWidth={false}
        sx={{ flex: 1, py: 6, width: '100%' }}
      >
        {children}
      </Container>

      <Footer />
    </Box>
  );
}
