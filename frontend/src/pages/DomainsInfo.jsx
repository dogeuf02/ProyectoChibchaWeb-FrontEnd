import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useTranslation } from 'react-i18next';

export default function DomainsCarousel() {

  const { t } = useTranslation();

  const domains = [
    {
      title: t('DomainsInfo.carousel.com.title'),
      description: t('DomainsInfo.carousel.com.description'),
      img: '/com.png',
    },
    {
      title: t('DomainsInfo.carousel.net.title'),
      description: t('DomainsInfo.carousel.net.description'),
      img: '/net.png',
    },
    {
      title: t('DomainsInfo.carousel.org.title'),
      description: t('DomainsInfo.carousel.org.description'),
      img: '/org.png',
    },
  ];

  return (
    <Box id="Domains" sx={{ bgcolor: '#FAFAFA', py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 'bold',
            mb: 6,
            color: '#212121',
            fontFamily: "'Roboto', sans-serif"
          }}
        >
          {t('DomainsInfo.carousel.title')}
        </Typography>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            600: { slidesPerView: 1 },
            900: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
          style={{ paddingBottom: '50px' }}
        >
          {domains.map((domain, index) => (
            <SwiperSlide key={index} style={{ display: 'flex', height: '100%' }}>
              <Card
                sx={{
                  borderRadius: '20px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  bgcolor: '#fff',
                  mx: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',          // Mantiene mismo alto
                  minHeight: 350,          // Alto mínimo uniforme
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Transición suave
                  '&:hover': {
                    transform: 'translateY(-8px)',    // Mueve la card hacia arriba
                    boxShadow: '0 12px 28px rgba(0,0,0,0.2)', // Sombra más marcada
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={domain.img}
                  alt={domain.title}
                  sx={{ height: 140, objectFit: 'contain', mt: 2 }}
                />
                <CardContent sx={{ textAlign: 'center', px: 3, flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#212121', mb: 1 }}>
                    {domain.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {domain.description}
                  </Typography>
                  <Button
                    variant="contained"
                    size="medium"
                    sx={{
                      bgcolor: '#FF6400',
                      borderRadius: '30px',
                      textTransform: 'none',
                      px: 4,
                      '&:hover': {
                        bgcolor: '#e25a00',
                      },
                    }}
                  >
                    {t('DomainsInfo.carousel.learnMore')}
                  </Button>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Box>
  );
}
