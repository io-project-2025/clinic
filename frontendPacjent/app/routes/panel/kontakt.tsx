import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
  Alert,
  Stack,
} from "@mui/material";
import { useLoaderData } from "react-router";

// Przykładowa lista doktorów (możesz pobierać z API)
// const doctors = [
//   { id: 1, name: "dr Anna Kowalska" },
//   { id: 2, name: "dr Jan Nowak" },
//   { id: 3, name: "dr Ewa Zielińska" },
// ];

// zwracane jest (SELECT) lekarz_id, imie, nazwisko, email, oddzial_id
// jest endpoint do pobierania lekarzy
// /api/doctors/:patientId/lab-results

export default function Kontakt() {
  const doctors = useLoaderData() as { id: number; name: string }[];

  const [doctor, setDoctor] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSent(false);

    if (!doctor || !subject || !message) {
      setError("Wszystkie pola są wymagane!");
      return;
    }

    
    setTimeout(() => {
      setSent(true);
      setDoctor("");
      setSubject("");
      setMessage("");
    }, 1000);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Formularz kontaktowy z doktorem
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <Stack spacing={3}>
            <TextField
              select
              label="Wybierz doktora"
              value={doctor}
              onChange={e => setDoctor(e.target.value)}
            >
              {doctors.map(doc => (
                <MenuItem key={doc.id} value={doc.name}>
                  {doc.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Temat wiadomości"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
            <TextField
              label="Treść wiadomości"
              value={message}
              onChange={e => setMessage(e.target.value)}
              multiline
              minRows={4}
            />
       
            <Button type="submit" variant="contained">
              Wyślij wiadomość
            </Button>
            {error && <Alert severity="error">{error}</Alert>}
            {sent && <Alert severity="success">Wiadomość została wysłana!</Alert>}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}