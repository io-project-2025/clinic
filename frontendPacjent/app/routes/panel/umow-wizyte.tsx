import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Alert,
  Grid,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import pl from "date-fns/locale/pl";
import { useLoaderData } from "react-router";

// Pobieranie lekarzy jak w kontakt.tsx
export async function clientLoader() {
  try {
    const res = await fetch("/api/doctors", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": localStorage.getItem("id") || "",
        "x-user-role": localStorage.getItem("role") || "pacjent",
      },
    });

    if (!res.ok) throw new Error("Nie udało się pobrać listy lekarzy");

    const data = await res.json();

    // Mapowanie do prostszego formatu
    const doctors = data.map((doc: any) => ({
      id: doc.lekarz_id,
      name: `dr ${doc.imie} ${doc.nazwisko}`,
    }));

    return { doctors, error: null };
  } catch (err) {
    return { doctors: [], error: "Wystąpił błąd podczas pobierania lekarzy" };
  }
}

const availableHours = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

function CalendarSection({
  date,
  setDate,
}: {
  date: Date | null;
  setDate: (date: Date | null) => void;
}) {
  return (
    <Grid
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
    >
      <Typography variant="h6" gutterBottom>
        Wybierz datę wizyty
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={pl}>
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          value={date}
          onChange={setDate}
          disablePast
          sx={{ mx: "auto" }}
        />
      </LocalizationProvider>
    </Grid>
  );
}

function InputsSection({
  hour,
  setHour,
  title,
  setTitle,
  desc,
  setDesc,
  doctor,
  setDoctor,
  doctors,
  error,
  sent,
  loading,
}: {
  hour: string;
  setHour: (h: string) => void;
  title: string;
  setTitle: (t: string) => void;
  desc: string;
  setDesc: (d: string) => void;
  doctor: string;
  setDoctor: (d: string) => void;
  doctors: { id: number; name: string }[];
  error: string;
  sent: boolean;
  loading: boolean;
}) {
  return (
    <Grid
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
    >
      <Stack spacing={3} sx={{ width: 260, mt: 2 }}>
        <TextField
          select
          label="Godzina wizyty"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          disabled={loading}
        >
          {availableHours.map((h) => (
            <MenuItem key={h} value={h}>
              {h}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Lekarz"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          disabled={loading}
        >
          {doctors.map((doc) => (
            <MenuItem key={doc.id} value={doc.id}>
              {doc.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Tytuł wizyty"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <TextField
          label="Opis dolegliwości"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          multiline
          minRows={2}
          disabled={loading}
        />
        <Button type="submit" variant="contained" disabled={loading}>
          Umów wizytę
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
        {sent && (
          <Alert severity="success">Przychodnia została poinformowana!</Alert>
        )}
      </Stack>
    </Grid>
  );
}

export default function UmowWizyte() {
  const { doctors, error: loaderError } = useLoaderData() as {
    doctors: { id: number; name: string }[];
    error: string | null;
  };
  const [date, setDate] = useState<Date | null>(null);
  const [hour, setHour] = useState("");
  const [doctor, setDoctor] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSent(false);

    if (!date || !hour || !doctor || !title || !desc) {
      setError("Wszystkie pola są wymagane!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        // brak endpointu lub konflikt z instniejącym (wtedy tu zmienić)
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": localStorage.getItem("id") || "",
          "x-user-role": localStorage.getItem("role") || "pacjent",
        },
        body: JSON.stringify({
          data: date.toISOString().split("T")[0],
          godzina: hour,
          lekarz_id: doctor,
          tytul: title,
          objawy: desc,
          pacjent_id: localStorage.getItem("id") || "",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Nie udało się umówić wizyty.");
      } else {
        setSent(true);
        setDate(null);
        setHour("");
        setDoctor("");
        setTitle("");
        setDesc("");
      }
    } catch (err) {
      setError("Błąd połączenia z serwerem.");
    }
    setLoading(false);
  };

  return (
    <Box sx={{ width: "100%", height: "100%", p: 4 }}>
      <Paper sx={{ maxWidth: 900, mx: "auto", p: 4 }}>
        <form onSubmit={handleSubmit} style={{ height: "100%" }}>
          <Grid
            container
            spacing={30}
            sx={{ height: "100%" }}
            alignItems="flex-start"
          >
            <CalendarSection date={date} setDate={setDate} />
            <InputsSection
              hour={hour}
              setHour={setHour}
              title={title}
              setTitle={setTitle}
              desc={desc}
              setDesc={setDesc}
              doctor={doctor}
              setDoctor={setDoctor}
              doctors={doctors}
              error={error || loaderError || ""}
              sent={sent}
              loading={loading}
            />
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
