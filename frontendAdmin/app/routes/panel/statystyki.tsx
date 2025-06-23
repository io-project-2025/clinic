import * as React from "react";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Avatar,
  Stack,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

// Mockowane dane statystyczne
// export async function clientLoader({ request }: LoaderFunctionArgs) {
//   return {
//     totalVisits: 1240,
//     mostCommonVisits: [
//       { type: "Konsultacja internistyczna", count: 420 },
//       { type: "Badanie kontrolne", count: 310 },
//       { type: "Szczepienie", count: 180 },
//       { type: "Porada telefoniczna", count: 120 },
//       { type: "Wizyta domowa", count: 80 },
//     ],
//     topDoctors: [
//       { name: "dr Anna Nowak", visits: 210 },
//       { name: "dr Jan Kowalski", visits: 185 },
//       { name: "dr Maria Wiśniewska", visits: 160 },
//     ],
//     busiestDays: [
//       { day: "Poniedziałek", visits: 260 },
//       { day: "Wtorek", visits: 230 },
//       { day: "Środa", visits: 210 },
//       { day: "Czwartek", visits: 180 },
//       { day: "Piątek", visits: 170 },
//     ],
//   };
// }

export async function clientLoader({ request }: LoaderFunctionArgs) {
  try {
    const res = await fetch("/api/admins/visits/analytics", {
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "1",
        "x-user-role": "admin",
      },
    });

    if (!res.ok) {
      throw new Error(`Błąd pobierania danych (${res.status})`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Błąd clientLoader:", err);
    return {
      totalVisits: 0,
      mostCommonVisits: [],
      topDoctors: [],
      busiestDays: [],
      error: "Nie udało się pobrać danych z serwera",
    };
  }
}

// Komponent statystyki ogólnej
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        minWidth: 220,
        bgcolor: "#fff3e0",
      }}
    >
      <Avatar sx={{ bgcolor: "#b71c1c" }}>{icon}</Avatar>
      <Box>
        <Typography variant="h6">{value}</Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Paper>
  );
}

// Komponent rankingowy
function RankingList({
  title,
  items,
  icon,
  primaryKey,
  secondaryKey,
}: {
  title: string;
  items: any[];
  icon: React.ReactNode;
  primaryKey: string;
  secondaryKey: string;
}) {
  return (
    <Paper elevation={2} sx={{ p: 2, minWidth: 260 }}>
      <Typography
        variant="subtitle1"
        sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
      >
        {icon}
        {title}
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <List dense>
        {items.map((item, idx) => (
          <ListItem key={idx}>
            <ListItemText
              primary={item[primaryKey]}
              secondary={`${item[secondaryKey]} wizyt`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

// Komponent główny
export default function StatsPage() {
  const { totalVisits, mostCommonVisits, topDoctors, busiestDays } =
    useLoaderData() as Awaited<ReturnType<typeof clientLoader>>;

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Statystyki szpitalne
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Jako administrator masz dostęp do kluczowych statystyk działalności
        placówki. Analizuj trendy, najczęstsze wizyty oraz ranking lekarzy, aby
        lepiej zarządzać kliniką.
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item>
          <StatCard
            icon={<BarChartIcon />}
            label="Liczba wizyt ogółem"
            value={totalVisits}
          />
        </Grid>
        <Grid item>
          <StatCard
            icon={<LocalHospitalIcon />}
            label="Najczęstszy typ wizyty"
            value={mostCommonVisits[0].type}
          />
        </Grid>
        <Grid item>
          <StatCard
            icon={<EventAvailableIcon />}
            label="Najbardziej oblegany dzień"
            value={busiestDays[0].day}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <RankingList
            title="Najczęstsze rodzaje wizyt"
            items={mostCommonVisits}
            icon={<BarChartIcon color="primary" />}
            primaryKey="type"
            secondaryKey="count"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <RankingList
            title="Lekarze z największą liczbą wizyt"
            items={topDoctors}
            icon={<LocalHospitalIcon color="primary" />}
            primaryKey="name"
            secondaryKey="visits"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <RankingList
            title="Najbardziej oblegane dni"
            items={busiestDays}
            icon={<EventAvailableIcon color="primary" />}
            primaryKey="day"
            secondaryKey="visits"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
