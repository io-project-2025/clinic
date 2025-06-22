import React from "react";
import { Container, Box, Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";


  // Komponent nagłówka
const WelcomeHeader = () => (
    <>
      <Typography variant="h3" gutterBottom>
        Witamy w systemie kliniki
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Zarządzaj wizytami, lekarzami i pacjentami w jednym miejscu.
      </Typography>
    </>
  );

    // Komponent przycisku
  const AdminPanelButton = ({navigate}: any) => (
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={() => navigate("/panel")}
    >
      Przejdź do panelu administratora
    </Button>
  );

  const AdminAnimation = () => (
    <Box
      sx={{
        width: { xs: 180, md: 260 },
        height: { xs: 180, md: 260 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        style={{ display: "block" }}
      >
       
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="gray"
          stroke="#111"
          strokeWidth="0"
        />
    
        <rect
          x="75"
          y="75"
          width="50"
          height="50"
          fill="none"
          stroke="#111"
          strokeWidth="3"
        >
          <animate
            attributeName="width"
            values="50;80;50"
            keyTimes="0;0.5;1"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="height"
            values="50;80;50"
            keyTimes="0;0.5;1"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="x"
            values="75;60;75"
            keyTimes="0;0.5;1"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            values="75;60;75"
            keyTimes="0;0.5;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </rect>
        <polygon
          points="100,70 130,130 70,130"
          fill="none"
          stroke="#111"
          strokeWidth="3"
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1,1;0.6,0.6;1,1"
            keyTimes="0;0.5;1"
            dur="2s"
            repeatCount="indefinite"
            additive="sum"
            origin="100 100"
          />
        </polygon>
      
        <circle
          cx="100"
          cy="100"
          r="18"
          fill="none"
          stroke="#111"
          strokeWidth="3"
        >
          <animate
            attributeName="r"
            values="18;10;18"
            keyTimes="0;0.5;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </Box>
  );


export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          p: 6,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: { xs: "80vh", md: "60vh" },
        }}
      >
        <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
          <WelcomeHeader />
          <Box mt={4}>
            <AdminPanelButton navigate={navigate}/>
          </Box>
        </Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <AdminAnimation />
        </Box>
      </Paper>
    </Container>
  );
}
