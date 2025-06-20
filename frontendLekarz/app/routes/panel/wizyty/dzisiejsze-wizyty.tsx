import * as React from "react";
import { useLoaderData } from "react-router";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Stack, Chip, Box, IconButton, Input
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";

// Typ wizyty
type Visit = {
  id: string;
  patientName: string;
  time: string;
  reason: string;
  notes?: string;
};

// Mockowany clientLoader
export async function  clientLoader() {
  const visits: Visit[] = [
    { id: "1", patientName: "Jan Kowalski", time: "09:00", reason: "Kontrola", notes: "" },
    { id: "2", patientName: "Anna Nowak", time: "10:00", reason: "Ból głowy", notes: "" },
    { id: "3", patientName: "Piotr Wiśniewski", time: "11:30", reason: "Badania okresowe", notes: "Pacjent w dobrym stanie." },
    { id: "4", patientName: "Maria Wójcik", time: "13:00", reason: "Szczepienie", notes: "" },
    { id: "5", patientName: "Tomasz Kaczmarek", time: "14:30", reason: "Konsultacja", notes: "" },
  ];
  return { visits };
}

// Komponent Chip statusu wizyty
function VisitStatusChip({ notes }: { notes?: string }) {
  return notes && notes.trim().length > 0 ? (
    <Chip label="Zrealizowana" color="success" size="small" />
  ) : (
    <Chip label="Oczekuje" color="warning" size="small" />
  );
}

// Komponent wiersza tabeli wizyty
function VisitRow({
  visit,
  onEdit,
}: {
  visit: Visit;
  onEdit: (visit: Visit) => void;
}) {
  const isDone = visit.notes && visit.notes.trim().length > 0;
  return (
    <TableRow sx={isDone ? { backgroundColor: "#e8f5e9" } : {}}>
      <TableCell>{visit.time}</TableCell>
      <TableCell>{visit.patientName}</TableCell>
      <TableCell>{visit.reason}</TableCell>
      <TableCell>
        <VisitStatusChip notes={visit.notes} />
      </TableCell>
      <TableCell>
        <Button
          variant="outlined"
          size="small"
          onClick={() => onEdit(visit)}
        >
          Edytuj
        </Button>
      </TableCell>
    </TableRow>
  );
}

// Komponent modalny do edycji wizyty
function EditVisitDialog({
  open,
  visit,
  notes,
  file,
  onNotesChange,
  onFileChange,
  onClose,
  onSave,
  onDeleteNotes,
}: {
  open: boolean;
  visit: Visit | null;
  notes: string;
  file: File | null;
  onNotesChange: (val: string) => void;
  onFileChange: (file: File | null) => void;
  onClose: () => void;
  onSave: () => void;
  onDeleteNotes: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Edycja wizyty {visit && `- ${visit.patientName} (${visit.time})`}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Notatki z wizyty"
            multiline
            minRows={3}
            value={notes}
            onChange={e => onNotesChange(e.target.value)}
            fullWidth
          />
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Dodaj wyniki badań (plik)
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <label htmlFor="upload-file">
                <Input
                  id="upload-file"
                  type="file"
                  sx={{ display: "none" }}
                  onChange={e => onFileChange(e.target.files?.[0] || null)}
                />
                <IconButton component="span">
                  <AttachFileIcon />
                </IconButton>
              </label>
              {file && <Typography variant="body2">{file.name}</Typography>}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button
          color="error"
          onClick={onDeleteNotes}
          disabled={!notes || notes.trim().length === 0}
        >
          Usuń notatki
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={notes.trim().length === 0}
        >
          Zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Główny komponent
export default function DzisiejszeWizyty() {
  const { visits: initialVisits } = useLoaderData() as { visits: Visit[] };
  const [visits, setVisits] = React.useState<Visit[]>(initialVisits);
  const [selectedVisit, setSelectedVisit] = React.useState<Visit | null>(null);
  const [notes, setNotes] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);

  // Otwórz modal i ustaw dane
  const handleOpenModal = (visit: Visit) => {
    setSelectedVisit(visit);
    setNotes(visit.notes || "");
    setFile(null);
    console.log("Edycja wizyty ID:", visit.id);
  };

  // Zapisz zmiany (mock)
  const handleSave = () => {
    if (!selectedVisit) return;
    const updatedVisits = visits.map(v =>
      v.id === selectedVisit.id
        ? { ...v, notes }
        : v
    );
    setVisits(updatedVisits);
    setSelectedVisit(null);
    setNotes("");
    setFile(null);
  };

  // Usuń notatki (mock)
  const handleDeleteNotes = () => {
    if (!selectedVisit) return;
    // Mock "usuwania" na backendzie
    console.log("Usuwanie notatek dla wizyty ID:", selectedVisit.id);
    const updatedVisits = visits.map(v =>
      v.id === selectedVisit.id
        ? { ...v, notes: "" }
        : v
    );
    setVisits(updatedVisits);
    setNotes("");
    // Nie zamykamy modala, żeby użytkownik widział, że input jest pusty
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dzisiejsze wizyty
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="dzisiejsze wizyty">
          <TableHead>
            <TableRow>
              <TableCell>Godzina</TableCell>
              <TableCell>Pacjent</TableCell>
              <TableCell>Powód wizyty</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visits.map((v) => (
              <VisitRow key={v.id} visit={v} onEdit={handleOpenModal} />
            ))}
            {visits.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Brak wizyt na dziś
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <EditVisitDialog
        open={!!selectedVisit}
        visit={selectedVisit}
        notes={notes}
        file={file}
        onNotesChange={setNotes}
        onFileChange={setFile}
        onClose={() => setSelectedVisit(null)}
        onSave={handleSave}
        onDeleteNotes={handleDeleteNotes}
      />
    </Stack>
  );
}