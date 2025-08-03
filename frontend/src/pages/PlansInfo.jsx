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
  List,
  ListItem,
  Divider
} from '@mui/material';

const plans = [
  {
    title: 'CHIBCHAPLATA',
    color: '#C0C0C0',
    price: {
      monthly: '5 US',
      semiAnnual: '25 US',
      annual: '45 US',
    },
    features: [
      '2 websites',
      '20 databases',
      '20 GB NVMe SSD storage',
      '20 email accounts',
      'Website builder',
      '2 SSL Certificates, https',
      'Email Marketing',
    ],
  },
  {
    title: 'CHIBCHAPLATINO',
    color: '#CD7F32',
    price: {
      monthly: '8 US',
      semiAnnual: '40 US',
      annual: '72 US',
    },
    features: [
      '3 websites',
      '40 databases',
      '40 GB NVMe SSD storage',
      '40 email accounts',
      'Website builder',
      '3 SSL Certificates, https',
      'Email Marketing',
    ],
  },
  {
    title: 'CHIBCHAORO',
    color: '#FFD700',
    price: {
      monthly: '11 US',
      semiAnnual: '55 US',
      annual: '99 US',
    },
    features: [
      '5 websites',
      'Unlimited databases',
      '60 GB NVMe SSD storage',
      '60 email accounts',
      'Website builder',
      '5 SSL Certificates, https',
      'Email Marketing',
    ],
  },
];

export default function PlansInfo() {
  return (
    <Box id="Plans" sx={{ bgcolor: '#FAFAFA', py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ color: '#212121', fontWeight: 'bold' }}
        >
          Choose the Right Hosting Plan
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{ color: '#616161ff', mb: 4 }}
        >
          Flexible prices to grow with your business
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '30px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  bgcolor: '#fff',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    align="center"
                    sx={{ color: plan.color, fontWeight: 'bold', mb: 2 }}
                  >
                    {plan.title}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1"><strong>Monthly:</strong> {plan.price.monthly}</Typography>
                    <Typography variant="body1"><strong>Semi-Annual:</strong> {plan.price.semiAnnual}</Typography>
                    <Typography variant="body1"><strong>Annual:</strong> {plan.price.annual}</Typography>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <List dense>
                    {plan.features.map((feature, i) => (
                      <ListItem key={i} sx={{ py: 0.5 }}>
                        <Typography variant="body2" sx={{ color: '#212121' }}>
                          • {feature}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant="contained"
                    size="medium"
                    sx={{
                      bgcolor: '#FF6400',
                      borderRadius: '30px',
                      px: 4,
                      '&:hover': {
                        bgcolor: '#e25a00',
                      },
                    }}
                  >
                    Get the Plan
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
