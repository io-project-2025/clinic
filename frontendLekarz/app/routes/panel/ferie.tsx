import * as React from "react";
import {
  Stack,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { pl } from "date-fns/locale/pl";

export default function FerieForm() {
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [reason, setReason] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock wysyłki prośby o urlop
    setDialogOpen(true);
    setStartDate(null);
    setEndDate(null);
    setReason("");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={pl}>
      <Stack spacing={3} maxWidth={400} mx="auto" mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Prośba o urlop
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <DatePicker
              label="Data początku urlopu"
              value={startDate}
              onChange={setStartDate}
              format="yyyy-MM-dd"
              slotProps={{ textField: { required: true } }}
            />
            <DatePicker
              label="Data końca urlopu"
              value={endDate}
              onChange={setEndDate}
              format="yyyy-MM-dd"
              slotProps={{ textField: { required: true } }}
              minDate={startDate || undefined}
            />
            <TextField
              label="Powód urlopu"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              multiline
              minRows={2}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!startDate || !endDate || !reason.trim()}
            >
              Wyślij prośbę
            </Button>
          </Stack>
        </form>
      </Stack>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Wysłano prośbę o urlop</DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mt: 1 }}>
            Twoja prośba o urlop została wysłana do administracji.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} autoFocus>
            Zamknij
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
