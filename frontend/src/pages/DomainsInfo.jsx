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
    <Box id="Domains" sx={{ bgcolor: '#f5f5f5', py: 8 }} >
      <Container>
        <Typography variant="h2" align="center" gutterBottom>
          {t('domains.domainsTitle')}
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {domains.map((card, index) => (
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
                    {t('domains.moreInfo')}
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
