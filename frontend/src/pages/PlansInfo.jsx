import React from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
} from '@mui/material';
import { useTranslation } from 'react-i18next';


export default function PlansInfo() {
  const { t } = useTranslation();
  const cardData = [
    {
      title: t('hosting.hostingPlans.gold.title'),
      description: t('hosting.hostingPlans.gold.description'),
      color: '#B59709',
    },
    {
      title: t('hosting.hostingPlans.silver.title'),
      description: t('hosting.hostingPlans.silver.description'),
      color: '#696460',
    },
    {
      title: t('hosting.hostingPlans.platinum.title'),
      description: t('hosting.hostingPlans.platinum.description'),
      color: '#A3775C',
    },
  ];

  return (
    <Box id='Plans' sx={{ bgcolor: '#f5f5f5', py: 8 }}>
      <Container>
        <Typography variant="h2" align="center" gutterBottom>
          Hosting Plans
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {cardData.map((card, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h4"
                    component="div"
                    sx={{ color: card.color }}
                  >
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ mt: 'auto' }}>
                  <Button size="small" color="primary">
                    {t('hosting.hostingButton')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
