import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function FAQSection() {
  const faqs = [
    {
      question: "What services do you offer?",
      answer:
        "We offer domain registration, web hosting, SSL certificates, email marketing, and website builders to help you get online quickly.",
    },
    {
      question: "How can I register a domain?",
      answer:
        "Simply search for your desired domain on our platform and follow the guided steps to register it. It only takes a few minutes.",
    },
    {
      question: "Do you provide customer support?",
      answer:
        "Yes! Our support team is available 24/7 to assist you via chat, email, or phone.",
    },
    {
      question: "Can I upgrade my hosting plan later?",
      answer:
        "Absolutely. You can upgrade or modify your plan at any time from your account dashboard.",
    },
  ];

  return (
    <Box id="FAQ" sx={{ bgcolor: "#FAFAFA", py: 8 }}>
      <Container maxWidth="md">
        <Card
          sx={{
            borderRadius: "30px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            overflow: "hidden",
            bgcolor: "#fff",
          }}
        >
          <CardContent sx={{ py: 6, px: 4 }}>
            {/* Título */}
            <Typography
              variant="h3"
              gutterBottom
              sx={{ color: "#212121", fontWeight: "bold", textAlign: "center" }}
            >
              Frequently Asked Questions
            </Typography>

            {/* Descripción */}
            <Typography
              variant="h6"
              sx={{
                color: "#9E9E9E",
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.8,
                mb: 4,
                textAlign: "center",
              }}
            >
              Find answers to the most common questions about our services and
              features.
            </Typography>

            {/* Lista de Preguntas */}
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  borderRadius: "15px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  mb: 2,
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`faq-content-${index}`}
                  id={`faq-header-${index}`}
                  sx={{ fontWeight: "bold", color: "#212121" }}
                >
                  {faq.question}
                </AccordionSummary>
                <AccordionDetails sx={{ color: "#616161", lineHeight: 1.7 }}>
                  {faq.answer}
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
