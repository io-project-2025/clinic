import React, { useState } from "react";
import { useLoaderData } from "react-router";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Stack,
  Rating,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

// Loader do pobierania wizyt z backendu
export async function clientLoader() {
  try {
    const patientId = localStorage.getItem("id");
    const res = await fetch(`/api/appointments/patient/${patientId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": localStorage.getItem("id") || "",
        "x-user-role": "pacjent",
      },
    });
    if (!res.ok) throw new Error("Błąd pobierania wizyt");
    const data = await res.json();
    console.log("Pobrane wizyty:", JSON.stringify(data, null, 2));
    return { visits: data, error: null };
  } catch (err) {
    return { visits: [], error: "Nie udało się pobrać wizyt." };
  }
}

type Appointment = {
  wizyta_id: number;
  pacjent_id: number;
  lekarz_id: number;
  data: string; // ISO string
  godzina: string; // "HH:mm:ss"
  ocena: number | null;
  rodzaj_wizyty_opis: string;
};

function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);
  // Jeśli dateStr jest w formacie ISO, to zadziała:
  return date.toLocaleString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateStr: string) {
  // Wyciągnij tylko datę (YYYY-MM-DD)
  return dateStr.split("T")[0];
}

function formatHour(hourStr: string) {
  // Obsługa formatu "22:00:00" lub "22.00.00"
  if (!hourStr) return "";
  if (hourStr.includes(":")) return hourStr.slice(0, 5);
  if (hourStr.includes(".")) return hourStr.replace(/\./g, ":").slice(0, 5);
  return hourStr;
}

const randomNotes = [
  "Pacjent zgłosił się z bólem głowy.",
  "Zalecana kontrola za 2 tygodnie.",
  "Brak niepokojących objawów.",
  "Zalecenia: więcej ruchu, mniej stresu.",
  "Pacjent przyjmuje leki zgodnie z zaleceniami.",
];

function getRandomNote() {
  const idx = Math.floor(Math.random() * randomNotes.length);
  return randomNotes[idx];
}

export default function Wizyty() {
  const { visits, error } = useLoaderData() as {
    visits: Appointment[];
    error: string | null;
  };
  const [ratings, setRatings] = useState(() =>
    Object.fromEntries(
      visits.map(a => [a.wizyta_id, a.ocena])
    )
  );
  const [submitted, setSubmitted] = React.useState<{ [id: number]: boolean }>({});
  const [alert, setAlert] = React.useState<string | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");

  const handleRatingChange = (id: number, value: number | null) => {
    setRatings((prev) => ({ ...prev, [id]: value || 0 }));
  };

  const handleSubmit = async (id: number) => {
    try {
      const response = await fetch(`/api/appointments/${id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": localStorage.getItem("id") || "",
          "x-user-role": "pacjent",
        },
        body: JSON.stringify({
          ocena: ratings[id],
        }),
      });

      if (response.ok) {
        setSubmitted((prev) => ({ ...prev, [id]: true }));
        setAlert("Dziękujemy za ocenę wizyty!");
        setTimeout(() => setAlert(null), 2000);
      } else {
        const err = await response.json();
        setAlert(err.error || "Błąd podczas zapisywania oceny.");
        setTimeout(() => setAlert(null), 2000);
      }
    } catch (e) {
      setAlert("Błąd połączenia z serwerem.");
      setTimeout(() => setAlert(null), 2000);
    }
  };

  const handleListItemClick = (e: React.MouseEvent, visitId: number) => {
    // Nie otwieraj modala jeśli kliknięto w Rating lub Button
    if (
      e.currentTarget.querySelector(".MuiRating-root")?.contains(e.target as Node) ||
      e.currentTarget.querySelector(".confirm-btn")?.contains(e.target as Node)
    ) {
      return;
    }
    setNote(getRandomNote());
    setNoteOpen(true);
  };

  const handleClose = () => setNoteOpen(false);

  return (
    <Box sx={{ width: "100%", maxWidth: 700, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Twoje wizyty
        </Typography>
        {alert && <Alert severity="success" sx={{ mb: 2 }}>{alert}</Alert>}
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        ) : visits.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {visits.map((visit) => (
              <React.Fragment key={visit.wizyta_id}>
                <ListItem
                  alignItems="flex-start"
                  button
                  onClick={(e) => handleListItemClick(e, visit.wizyta_id)}
                  secondaryAction={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Rating
                        name={`rating-${visit.wizyta_id}`}
                        value={ratings[visit.wizyta_id] || 0}
                        onChange={(_, value) => handleRatingChange(visit.wizyta_id, value)}
                        icon={<StarIcon fontSize="inherit" />}
                        emptyIcon={<StarIcon fontSize="inherit" />}
                      />
                      <Button
                        className="confirm-btn"
                        variant="contained"
                        size="small"
                        disabled={submitted[visit.wizyta_id] || !ratings[visit.wizyta_id]}
                        onClick={() => handleSubmit(visit.wizyta_id)}
                      >
                        Zatwierdź
                      </Button>
                    </Stack>
                  }
                >
                  <ListItemText
                    primary={`Data: ${formatDate(visit.data)} — Godzina: ${formatHour(visit.godzina)}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {visit.rodzaj_wizyty_opis}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
      <Dialog open={noteOpen} onClose={handleClose}>
        <DialogTitle>Notatka od lekarza</DialogTitle>
        <DialogContent>
          <Typography>{note}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Zamknij</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}