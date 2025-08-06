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
import { useTranslation } from "react-i18next";

export default function FAQSection() {
  const { t } = useTranslation();

  const faqs = t("faq.questions", { returnObjects: true });

  return (
    <Box id="FAQ" sx={{ bgcolor: "#212121", py: 8 }}>
      <Container maxWidth="md">
        <Card
          sx={{
            borderRadius: "30px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            overflow: "hidden",
            bgcolor: "#333333",
          }}
        >
          <CardContent sx={{ py: 6, px: 4 }}>
            {/* Título */}
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                color: "#FAFAFA",
                fontWeight: "bold",
                textAlign: "center",
                fontFamily: '"Roboto", sans-serif',
              }}
            >
              {t("faq.title")}
            </Typography>

            {/* Descripción */}
            <Typography
              variant="h6"
              sx={{
                color: "#BDBDBD",
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.8,
                mb: 4,
                textAlign: "center",
                fontFamily: '"Roboto", sans-serif',
              }}
            >
              {t("faq.description")}
            </Typography>

            {/* Lista de Preguntas */}
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  borderRadius: "15px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
                  mb: 2,
                  bgcolor: "#424242",
                  color: "#FAFAFA",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#FF6300" }} />}
                  aria-controls={`faq-content-${index}`}
                  id={`faq-header-${index}`}
                  sx={{
                    fontWeight: "bold",
                    fontFamily: '"Roboto", sans-serif',
                  }}
                >
                  {faq.question}
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    color: "#E0E0E0",
                    lineHeight: 1.7,
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "0.95rem",
                  }}
                >
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
