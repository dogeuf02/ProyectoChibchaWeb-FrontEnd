import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../utils/TestimonialsCarousel.css';
import { useTranslation } from 'react-i18next';

const testimonials = [
  {
    key: "charlie",
    name: "Charlie Low",
    comment:
      "Since we've been with ChibchaWeb, it's been an incredible experience. We haven't had any issues, and if a question ever arises, their customer service is excellent.",
    rating: 5,
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    key: "jack",
    name: "Jack Bies",
    comment:
      "El equipo de éxito de ChibchaWeb hace todo lo posible para conocer más mi problema y resolverlo rápido.",
    rating: 5,
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    key: "jhon",
    name: "Jhon Ortega",
    comment:
      "Estaba buscando una empresa de hosting que fuera intuitiva para principiantes y bien configurada para un buen rendimiento, y ChibchaWeb cumplió con todo.",
    rating: 5,
    img: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    key: "laura",
    name: "Laura Méndez",
    comment:
      "Desde que migrei meus projetos para o ChibchaWeb, a velocidade e o suporte superaram minhas expectativas.",
    rating: 5,
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export default function TestimonialsCarousel() {
  const { t } = useTranslation();

  return (
    <Box sx={{ bgcolor: '#212121', py: 8 }}>
      <Container maxWidth="lg">
        {/* Título traducido */}
        <Typography
          variant="h4"
          align="center"
          sx={{ 
            fontWeight: 'bold',
            mb: 6,
            color: '#FAFAFA',
            fontFamily: "'Roboto', sans-serif"
          }}
        >
          {t("testimonials.title")}
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
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <Card
                sx={{
                  borderRadius: '20px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  bgcolor: '#FAFAFA',
                  height: '100%',
                  mx: 1,
                }}
              >
                <CardContent sx={{ textAlign: 'left' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={testimonial.img}
                      alt={testimonial.name}
                      sx={{ width: 48, height: 48, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontFamily: "'Roboto', sans-serif" }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Roboto', sans-serif" }}>
                        {t(`testimonials.roles.${testimonial.key}`)}
                      </Typography>
                    </Box>
                  </Box>

                  <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />

                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 2, fontFamily: "'Roboto', sans-serif" }}
                  >
                    {testimonial.comment}
                  </Typography>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Box>
  );
}
