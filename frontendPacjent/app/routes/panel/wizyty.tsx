import React from "react";
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
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

// Loader do pobierania wizyt (mock)
export async function clientLoader() {
  return [
    {
      id: 1,
      date: "2025-06-10",
      doctor: "dr Anna Kowalska",
      description: "Konsultacja ogólna",
    },
    {
      id: 2,
      date: "2025-06-15",
      doctor: "dr Jan Nowak",
      description: "Kontrola wyników badań",
    },
  ];
}

export default function Wizyty() {
  const visits = useLoaderData() as Array<{
    id: number;
    date: string;
    doctor: string;
    description: string;
  }>;
  const [ratings, setRatings] = React.useState<{ [id: number]: number }>({});
  const [submitted, setSubmitted] = React.useState<{ [id: number]: boolean }>({});
  const [alert, setAlert] = React.useState<string | null>(null);

  const handleRatingChange = (id: number, value: number | null) => {
    setRatings((prev) => ({ ...prev, [id]: value || 0 }));
  };

  const handleSubmit = (id: number) => {
    setSubmitted((prev) => ({ ...prev, [id]: true }));
    setAlert("Dziękujemy za ocenę wizyty!");
    setTimeout(() => setAlert(null), 2000);
    // Tu możesz dodać fetch do backendu
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Twoje wizyty
        </Typography>
        {alert && <Alert severity="success" sx={{ mb: 2 }}>{alert}</Alert>}
        <List>
          {visits.map((visit) => (
            <React.Fragment key={visit.id}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Rating
                      name={`rating-${visit.id}`}
                      value={ratings[visit.id] || 0}
                      onChange={(_, value) => handleRatingChange(visit.id, value)}
                      icon={<StarIcon fontSize="inherit" />}
                      emptyIcon={<StarIcon fontSize="inherit" />}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      disabled={submitted[visit.id] || !ratings[visit.id]}
                      onClick={() => handleSubmit(visit.id)}
                    >
                      Zatwierdź
                    </Button>
                  </Stack>
                }
              >
                <ListItemText
                  primary={`${visit.date} — ${visit.doctor}`}
                  secondary={visit.description}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
}