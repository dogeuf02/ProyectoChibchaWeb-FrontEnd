import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  Link
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../utils/TestimonialsCarousel.css'; // Importa los estilos personalizados

const testimonials = [
  {
    name: "Charlie Low",
    role: "Co-founder of Nohma",
    comment:
      "Since we've been with ChibchaWeb, it's been an incredible experience. We haven't had any issues, and if a question ever arises, their customer service is excellent.",
    rating: 5,
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Jack Bies",
    role: "Creative Director",
    comment:
      "El equipo de éxito de ChibchaWeb hace todo lo posible para conocer más mi problema y resolverlo rápido.",
    rating: 5,
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Jhon Ortega",
    role: "Entrepreneur",
    comment:
      "Estaba buscando una empresa de hosting que fuera intuitiva para principiantes y bien configurada para un buen rendimiento, y ChibchaWeb cumplió con todo.",
    rating: 5,
    img: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    name: "Laura Méndez",
    role: "UX Designer",
    comment:
      "Desde que migrei meus projetos para o ChibchaWeb, a velocidade e o suporte superaram minhas expectativas.",
    rating: 5,
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export default function TestimonialsCarousel() {
  return (
    <Box sx={{ bgcolor: '#212121', py: 8 }}>
      <Container maxWidth="lg">
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
          Trusted by thousand webside owners, Colombia Top 1 webside platform.
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
                        {testimonial.role}
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
