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
} from "@mui/material";

// Mock funkcja do pobierania dokumentów (np. skierowań)
export async function clientLoader() {
  // Tu można pobrać dane z API, na razie mock:
  return [
    {
      id: 1,
      type: "Skierowanie",
      date: "2025-06-10",
      doctor: "dr Anna Kowalska",
      description: "Skierowanie na badanie krwi.",
    },
    {
      id: 2,
      type: "Skierowanie",
      date: "2025-06-15",
      doctor: "dr Jan Nowak",
      description: "Skierowanie na USG jamy brzusznej.",
    },
  ];
}

function handleDownload(doc: { id: number; type: string; date: string; doctor: string; description: string }) {
  // symulacja pobierania dokumentu
  const content = `Typ: ${doc.type}\nData: ${doc.date}\nLekarz: ${doc.doctor}\nOpis: ${doc.description}`;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${doc.type}_${doc.id}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Dokumenty() {
  const documents = useLoaderData() as Array<{
    id: number;
    type: string;
    date: string;
    doctor: string;
    description: string;
  }>;

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Twoje dokumenty 
        </Typography>
        <List>
          {documents.map((doc) => (
            <React.Fragment key={doc.id}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDownload(doc)}
                  >
                    Pobierz
                  </Button>
                }
              >
                <ListItemText
                  primary={`${doc.type} (${doc.date})`}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {doc.doctor}
                      </Typography>
                      {" — "}
                      {doc.description}
                    </>
                  }
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