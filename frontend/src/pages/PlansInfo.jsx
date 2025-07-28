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

const cardData = [
  {
    title: 'CHIBCHAORO',
    description: 'Descripción breve del servicio número 1.',
    color: '#B59709',
  },
  {
    title: 'CHIBCHAPLATA',
    description: 'Descripción breve del servicio número 2.',
    color: '#696460',
  },
  {
    title: 'CHIBCHAPLATINO',
    description: 'Descripción breve del servicio número 3.',
    color: '#A3775C',
  },
];

export default function PlansInfo() {
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
                    Get the plan
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
