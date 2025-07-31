// pages/CardsPage.jsx
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
    title: 'Dominio .com',
    description: 'Descripción breve del servicio número 1.',
    image: '/com.png',
  },
  {
    title: 'Dominio .net',
    description: 'Descripción breve del servicio número 2.',
    image: 'https://imagedelivery.net/LqiWLm-3MGbYHtFuUbcBtA/06b15861-1a43-4706-3825-cb2cd043c400/public',
  },
  {
    title: 'Dominio .org',
    description: 'Descripción breve del servicio número 3.',
    image: '/org.png',
  },
];

export default function DomainsInfo() {
  return (
    <Box id="Domains" sx={{ bgcolor: '#f5f5f5', py: 8 }} >
      <Container>
        <Typography variant="h2" align="center" gutterBottom>
          Domains
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {cardData.map((card, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={card.image}
                  alt={card.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
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
