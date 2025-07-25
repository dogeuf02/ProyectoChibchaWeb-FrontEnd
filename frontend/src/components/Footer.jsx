import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#f5f5f5', py: 2, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} ChibchaWeb. Todos los derechos reservados.
      </Typography>
    </Box>
  );
}
