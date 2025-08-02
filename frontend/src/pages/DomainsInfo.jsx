// pages/DomainsSelect.jsx
import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  CardMedia,
} from "@mui/material";

const domains = [
  {
    id: 1,
    title: "Commercial",
    description:
      "The most globally recognized and trusted domain, ideal for businesses, online stores, and professional websites seeking a worldwide audience.",
    image: "/com.png",
  },
  {
    id: 2,
    title: "Network",
    description:
      "A professional domain often linked to technology and internet services, suitable for startups, software platforms, and hosting providers.",
    image:
      "https://imagedelivery.net/LqiWLm-3MGbYHtFuUbcBtA/06b15861-1a43-4706-3825-cb2cd043c400/public",
  },
  {
    id: 3,
    title: "Organization",
    description:
      "A credible and trustworthy domain commonly used by non-profits, foundations, and community or educational projects.",
    image: "/org.png",
  },
];

export default function DomainsSelect() {
  const [selectedCard, setSelectedCard] = React.useState(null);

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 3,
        justifyItems: "center", // centra las cards en la grilla
        p: 4,
      }}
    >
      {domains.map((domain) => (
        <Card
          key={domain.id}
          sx={{
            width: 250,
            borderRadius: 3,
            boxShadow: 3,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            "&:hover": {
              transform: "translateY(-4px)",
              transition: "0.3s",
            },
          }}
        >
          <CardActionArea
            onClick={() => setSelectedCard(domain.id)}
            data-active={selectedCard === domain.id ? "" : undefined}
            sx={{
              display: "flex",
              flexDirection: "column",
              "&[data-active]": {
                backgroundColor: "action.selected",
                "&:hover": {
                  backgroundColor: "action.selectedHover",
                },
              },
            }}
          >
            <CardMedia
              component="img"
              image={domain.image}
              alt={domain.title}
              sx={{
                height: 120,
                objectFit: "contain",
                bgcolor: "#fff",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {domain.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                }}
              >
                {domain.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}
