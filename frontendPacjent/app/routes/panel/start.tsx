import { Paper, Avatar, Box, Typography } from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { keyframes } from "@mui/system";

// Animacja "bounce"
const bounce = keyframes`
  0%   { transform: translateY(0); }
  30%  { transform: translateY(-10px); }
  50%  { transform: translateY(0); }
  70%  { transform: translateY(-5px);}
  100% { transform: translateY(0);}
`;

// Komponent z notką o użytkowniku i śmiesznym placeholderem
export default function() {
  const firstName = localStorage.getItem("firstName") || "Imię";
  const lastName = localStorage.getItem("lastName") || "Nazwisko";
  const email = localStorage.getItem("email") || "brak@email.com";

  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center", // Wyśrodkowanie w pionie
        gap: 2,
        p: 2,
        mb: 2,
        bgcolor: "background.paper",
        height: "calc(100vh - 100px)", // jeśli AppBar ma 64px wysokości
      }}
    >
      <Avatar sx={{ width: 56, height: 56, mb: 1 }}>
        {firstName[0] || "?"}
        {lastName[0] || "?"}
      </Avatar>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {firstName} {lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {email}
        </Typography>
      </Box>
      {/* Śmieszny placeholder z animacją */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 2,
        }}
      >
        <EmojiEmotionsIcon
          color="warning"
          sx={{
            fontSize: 40,
            animation: `${bounce} 1.5s infinite`,
          }}
        />
        <Typography
          variant="caption"
          sx={{ mt: 1, fontStyle: "italic", color: "text.secondary" }}
        >
          Miłego dnia! 😄
        </Typography>
      </Box>
    </Paper>
  );
}
