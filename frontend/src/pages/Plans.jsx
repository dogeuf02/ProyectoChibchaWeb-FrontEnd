import React from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
} from '@mui/material';

const cardData = [
  {
    title: 'CHIBCHAORO',
    description: 'Descripción breve del servicio número 1.',
  },
  {
    title: 'CHIBCHAPLATA',
    description: 'Descripción breve del servicio número 2.',
  },
  {
    title: 'CHIBCHAPLATINO',
    description: 'Descripción breve del servicio número 3.',
  },
];

export default function Plans() {
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
                  <Typography gutterBottom variant="h5" component="div">
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ mt: 'auto' }}>
                  <Button size="small" color="primary">
                    Más información
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
