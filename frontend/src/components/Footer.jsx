import React from "react";
import { Box, Container, Grid, Typography, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  // Traemos el array de links traducidos
  const links = t("footer.links", { returnObjects: true });

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#FFFFFF",
        color: "#212121",
        py: 4,
        borderTop: "1px solid #E0E0E0",
        fontFamily: '"Roboto", sans-serif',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="space-between" alignItems="center">
          {/* Logo */}
          <Box
            component="img"
            src="/logoPestana.png"
            alt="ChibchaWeb"
            sx={{ height: 60, mb: { xs: 2, md: 0 } }}
          />

          {/* Links traducidos */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2,
                mb: 1,
              }}
            >
              {links.map((text, idx) => (
                <Link
                  key={idx}
                  href="#"
                  underline="none"
                  sx={{ color: "#212121", fontSize: "0.85rem", "&:hover": { color: "#FF6300" } }}
                >
                  {text}
                </Link>
              ))}
            </Box>
            <Typography variant="body2" sx={{ textAlign: "center", color: "#616161", mt: 1 }}>
              {t("footer.copyright", { year })}
            </Typography>
          </Grid>

          {/* Redes sociales */}
          <Grid item xs={12} md={3} textAlign={{ xs: "center", md: "right" }}>
            <IconButton sx={{ color: "#212121", "&:hover": { color: "#FF6300" } }} href="#">
              <FacebookIcon />
            </IconButton>
            <IconButton sx={{ color: "#212121", "&:hover": { color: "#FF6300" } }} href="#">
              <InstagramIcon />
            </IconButton>
            <IconButton sx={{ color: "#212121", "&:hover": { color: "#FF6300" } }} href="#">
              <LinkedInIcon />
            </IconButton>
            <IconButton sx={{ color: "#212121", "&:hover": { color: "#FF6300" } }} href="#">
              <XIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
