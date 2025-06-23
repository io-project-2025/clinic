import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

// Mockowane pobieranie danych do skrótów
// export async function clientLoader() {
//   return {
//     dzisiejszeWizyty: 4,
//     grafik: "08:00-16:00",
//     pacjenci: 12,
//     badania: 5,
//   };
// }

export async function clientLoader() {
  const doctorId = localStorage.getItem("id");

  if (!doctorId) {
    throw new Error("Brak ID lekarza w localStorage");
  }

  try {
    const headers = {
      "Content-Type": "application/json",
      "x-user-id": doctorId,
      "x-user-role": "lekarz",
    };

    const [appointmentsRes, requestsRes, patientsRes, scheduleRes] =
      await Promise.all([
        fetch(`/api/appointments/doctor/${doctorId}/today`, { headers }),
        fetch(`/api/appointments/doctor/${doctorId}/requests`, { headers }),
        fetch(`/api/doctors/${doctorId}/patients`, { headers }),
        fetch(`/api/doctors/${doctorId}/schedule/today`, { headers }),
      ]);

    if (
      !appointmentsRes.ok ||
      !requestsRes.ok ||
      !patientsRes.ok ||
      !scheduleRes.ok
    ) {
      throw new Error("Błąd pobierania danych dashboardu");
    }

    const appointments = await appointmentsRes.json();
    const requests = await requestsRes.json();
    const patients = await patientsRes.json();
    const schedule = await scheduleRes.json();

    return {
      dzisiejszeWizyty: appointments.length,
      grafik: schedule.grafik,
      pacjenci: patients.length,
      badania: requests.length,
    };
  } catch (err) {
    console.error("Błąd clientLoader:", err);
    return {
      dzisiejszeWizyty: 0,
      grafik: "Brak danych",
      pacjenci: 0,
      badania: 0,
    };
  }
}

// Komponent pojedynczego skrótu
function ShortcutCard({
  title,
  value,
  description,
  path,
  onNavigate,
}: {
  title: string;
  value: React.ReactNode;
  description: string;
  path: string;
  onNavigate: (path: string) => void;
}) {
  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": {
          boxShadow: 8,
          transform: "scale(1.03)",
        },
        minHeight: 180,
        minWidth: 500,
        justifyContent: "center",
      }}
      onClick={() => onNavigate(path)}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h3" color="primary" gutterBottom>
        {value !== undefined ? value : <CircularProgress size={32} />}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        {description}
      </Typography>
      <Button
        variant="outlined"
        sx={{ mt: 2 }}
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(path);
        }}
      >
        Przejdź
      </Button>
    </Paper>
  );
}

export default function Start() {
  const navigate = useNavigate();
  const data = useLoaderData() as Awaited<ReturnType<typeof clientLoader>>;

  const shortcuts = [
    {
      title: "Dzisiejsze wizyty",
      value: data.dzisiejszeWizyty,
      description: "Zobacz listę dzisiejszych wizyt",
      path: "visits",
    },
    {
      title: "Pełen grafik",
      value: data.grafik,
      description: "Przejdź do swojego grafiku",
      path: "timetable",
    },
    {
      title: "Lista pacjentów",
      value: data.pacjenci,
      description: "Zobacz wszystkich swoich pacjentów",
      path: "patients",
    },
    {
      title: "Prośby wizyt",
      value: data.badania,
      description: "Przyjmij lub dostosuj wizyty pacjentów",
      path: "visits/new",
    },
  ];

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Panel główny lekarza
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {shortcuts.map((item, idx) => (
          <Grid
            key={item.title}
            // Wymuś dwa rzędy po 3 elementy (jeśli 5 elementów, ostatni będzie sam)
            sx={{
              display: "flex-wrap",
              justifyContent: "center",
            }}
          >
            <ShortcutCard
              title={item.title}
              value={item.value}
              description={item.description}
              path={item.path}
              onNavigate={navigate}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
