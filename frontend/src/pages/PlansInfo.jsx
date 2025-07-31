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
} from '@mui/material';

const plans = [
  {
    title: 'CHIBCHAPLATA',
    color: '#696460',
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
    color: '#A3775C',
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
    color: '#B59709',
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
    <Box id='Plans' sx={{ bgcolor: '#f5f5f5', py: 8 }}>
      <Container>
        <Typography variant="h2" align="center" gutterBottom>
          Hosting Plans
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h4"
                    component="div"
                    sx={{ color: plan.color }}
                  >
                    {plan.title}
                  </Typography>

                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Monthly price: {plan.price.monthly}
                  </Typography>
                  <Typography variant="body1">
                    Semi-annual price: {plan.price.semiAnnual}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Annual price: {plan.price.annual}
                  </Typography>

                  <List dense>
                    {plan.features.map((feature, i) => (
                      <ListItem key={i} sx={{ py: 0 }}>
                        <Typography variant="body2" color="text.secondary">
                          {feature}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
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
