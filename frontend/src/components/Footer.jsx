import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <Box component="footer" sx={{ bgcolor: '#212121', py: 2, textAlign: 'center' }}>
      <Typography variant="body2" color="#FAFAFA">
        {t('footer.copyright', { year: new Date().getFullYear() })}
      </Typography>
    </Box>
  );
}
