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
} from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import pl from "date-fns/locale/pl";

const availableHours = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

function CalendarSection({ date, setDate }: { date: Date | null; setDate: (date: Date | null) => void }) {
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

// Komponent inputów
function InputsSection({
  hour,
  setHour,
  title,
  setTitle,
  desc,
  setDesc,
  error,
  sent,
}: {
  hour: string;
  setHour: (h: string) => void;
  title: string;
  setTitle: (t: string) => void;
  desc: string;
  setDesc: (d: string) => void;
  error: string;
  sent: boolean;
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
          onChange={e => setHour(e.target.value)}
   
        >
          {availableHours.map(h => (
            <MenuItem key={h} value={h}>{h}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Tytuł wizyty"
          value={title}
          onChange={e => setTitle(e.target.value)}

        />
        <TextField
          label="Opis dolegliwości"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          multiline
          minRows={2}

        />
        <Button type="submit" variant="contained">
          Umów wizytę
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
        {sent && <Alert severity="success">Przychodnia została poinformowana!</Alert>}
      </Stack>
    </Grid>
  );
}

export default function UmowWizyte() {
  const [date, setDate] = useState<Date | null>(null);
  const [hour, setHour] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSent(false);

    if (!date || !hour || !title || !desc) {
      setError("Wszystkie pola są wymagane!");
      return;
    }

    setTimeout(() => {
      setSent(true);
    }, 1000);
  };

  return (
    <Box sx={{ width: "100%", height: "100%", p: 4 }}>
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
            error={error}
            sent={sent}
          />
        </Grid>
      </form>
    </Box>
  );
}