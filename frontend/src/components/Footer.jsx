import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#212121', py: 2, textAlign: 'center' }}>
      <Typography variant="body2" color="#FAFAFA">
        © {new Date().getFullYear()} ChibchaWeb. Todos los derechos reservados.
      </Typography>
    </Box>
  );
}
