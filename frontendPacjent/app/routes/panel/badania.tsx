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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

// Loader do pobierania badań - nie działa, dane są pobierane z API

// (mock)

// export async function clientLoader() {
//   return [
//     {
//       id: 1,
//       date: "2025-06-05",
//       type: "Morfologia",
//       doctor: "dr Anna Kowalska",
//       result: "WBC: 6.2, RBC: 4.8, HGB: 13.5, PLT: 250",
//       description: "Badanie krwi - morfologia.",
//     },
//     {
//       id: 2,
//       date: "2025-06-12",
//       type: "USG jamy brzusznej",
//       doctor: "dr Jan Nowak",
//       result: "Wynik prawidłowy. Brak zmian ogniskowych.",
//       description: "USG jamy brzusznej.",
//     },
//   ];
// }

/**
 * Komponent wyświetlający listę badań.
 */
function StudiesList({
  studies,
  onSelect,
}: {
  studies: Array<{
    id: number;
    date: string;
    type: string;
    doctor: string;
    result: string;
    description: string;
  }>;
  onSelect: (study: any) => void;
}) {
  return (
    <List>
      {studies.map((study) => (
        <React.Fragment key={study.id}>
          <ListItem
            component='button'
            onClick={() => onSelect(study)}
            alignItems="flex-start"
            sx={{ cursor: "pointer", "&:hover": {backgroundColor: "rgba(0,0,0,0.1)"} } }
          >
            <ListItemText
              primary={`${study.type} (${study.date})`}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {study.doctor}
                  </Typography>
                  {" — "}
                  {study.description}
                </>
              }
            />
          </ListItem>
          <Divider component="li" />
        </React.Fragment>
      ))}
    </List>
  );
}

/**
 * Komponent modalny wyświetlający szczegóły wybranego badania.
 */
function StudyModal({
  open,
  study,
  onClose,
}: {
  open: boolean;
  study: any;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Wyniki badania</DialogTitle>
      <DialogContent>
        {study && (
          <>
            <DialogContentText>
              <strong>Typ badania:</strong> {study.type}
            </DialogContentText>
            <DialogContentText>
              <strong>Data:</strong> {study.date}
            </DialogContentText>
            <DialogContentText>
              <strong>Lekarz:</strong> {study.doctor}
            </DialogContentText>
            <DialogContentText sx={{ mt: 2 }}>
              <strong>Opis:</strong> {study.description}
            </DialogContentText>
            <DialogContentText sx={{ mt: 2 }}>
              <strong>Wynik:</strong> {study.result}
            </DialogContentText>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Zamknij</Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * Główny komponent strony badań pacjenta.
 * Wyświetla listę badań oraz modal ze szczegółami po kliknięciu.
 */
export default function Badania() {
  const studies = useLoaderData() as Array<{
    id: number;
    date: string;
    type: string;
    doctor: string;
    result: string;
    description: string;
  }>;

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<typeof studies[0] | null>(null);

  const handleOpen = (study: typeof studies[0]) => {
    setSelected(study);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Twoje badania
        </Typography>
        {/* Lista badań */}
        <StudiesList studies={studies} onSelect={handleOpen} />
      </Paper>
      {/* Modal ze szczegółami badania */}
      <StudyModal open={open} study={selected} onClose={handleClose} />
    </Box>
  );
}