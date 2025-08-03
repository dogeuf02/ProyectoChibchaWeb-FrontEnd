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
  Divider,
} from '@mui/material';

const cardData = [
  {
    title: 'Commercial',
    description:
      'Dominio .com',
    image: '/com.png',
    color: '#FF6400',
  },
  {
    title: 'Network',
    description:
      'Dominio .net',
    image:
      'https://imagedelivery.net/LqiWLm-3MGbYHtFuUbcBtA/06b15861-1a43-4706-3825-cb2cd043c400/public',
    color: '#6C63FF',
  },
  {
    title: 'Organization',
    description:
      'Dominio .org',
    image: '/org.png',
    color: '#FF6400',
  },
];


import { useTranslation } from 'react-i18next';

export default function DomainsInfo() {

  const { t } = useTranslation();

  const domains = [
    {
      title: t('domains.domainInfo.com.title'),
      description: t('domains.domainInfo.com.description'),
      image: "/com.png"
    },
    {
      title: t('domains.domainInfo.net.title'),
      description: t('domains.domainInfo.net.description'),
      image: "/net.png"
    },
    {
      title: t('domains.domainInfo.org.title'),
      description: t('domains.domainInfo.org.description'),
      image: "/org.png"
    },
  ];
  console.log(domains)
  return (
    <Box id="Domains" sx={{ bgcolor: '#FAFAFA', py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ color: '#212121', fontWeight: 'bold' }}
        >
          Choose Your Domain
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{ color: '#616161ff', mb: 4 }}
        >
          Select the perfect domain for your website
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {domains.map((card, index) => (
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
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={card.image}
                  alt={card.title}
                  sx={{
                    height: 150,
                    objectFit: 'contain',
                    mt: 2,
                  }}
                />

                <CardContent>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{ fontWeight: 'bold', color: card.color, mb: 1 }}
                  >
                    {card.title}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{
                      px: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {card.description}
                  </Typography>
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
