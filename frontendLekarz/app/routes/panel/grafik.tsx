import React, { useState } from "react";
import { useLoaderData } from "react-router";
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Button,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { pl } from "date-fns/locale";
import { LocalizationProvider } from "@mui/x-date-pickers";
import {
  format,
  isSameDay,
  startOfMonth,
  endOfMonth,
  addMonths,
} from "date-fns";

// Mockowane pobieranie dyżurów
// export async function clientLoader() {
//   // Przykładowe dyżury na dwa miesiące
//   return [
//     { date: "2025-06-21", type: "1. zmiana" },
//     { date: "2025-06-25", type: "2. zmiana" },
//     { date: "2025-07-03", type: "1. zmiana" },
//     { date: "2025-07-15", type: "2. zmiana" },
//   ];
// }

export async function clientLoader() {
  const doctorId = localStorage.getItem("id");

  try {
    const res = await fetch(`/api/doctors/${doctorId}/schedule`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": doctorId || "",
        "x-user-role": "lekarz",
      },
    });

    if (!res.ok) throw new Error("Nie udało się pobrać grafiku");
    return await res.json();
  } catch (error) {
    console.error("Błąd ładowania grafiku:", error);
    return []; // fallback
  }
}

// Komórka kalendarza z dyżurem (bez godziny pod datą)
function CalendarDay({
  day,
  selected,
  duty,
  onClick,
}: {
  day: Date;
  selected: boolean;
  duty?: string;
  onClick: (date: Date) => void;
}) {
  return (
    <Box
      onClick={() => onClick(day)}
      sx={{
        width: 40,
        height: 40,
        m: "2px",
        borderRadius: "50%",
        bgcolor: selected ? "primary.main" : "transparent",
        color: selected ? "#fff" : "inherit",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: duty ? "2px solid #43cea2" : "1px solid #e0e0e0",
        fontWeight: duty ? 700 : 400,
      }}
    >
      {format(day, "d")}
    </Box>
  );
}

// Kalendarz z możliwością zmiany miesiąca i zaznaczania dyżurów
function DutyCalendar({
  duties,
  onDayClick,
  selectedDate,
  month,
  setMonth,
}: {
  duties: { date: string; type: string }[];
  onDayClick: (date: Date) => void;
  selectedDate: Date | null;
  month: Date;
  setMonth: (d: Date) => void;
}) {
  // Generuj dni miesiąca
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days: Date[] = [];
  for (
    let d = start;
    d <= end;
    d = addMonths(d, 0), d.setDate(d.getDate() + 1)
  ) {
    days.push(new Date(d));
  }

  // Ustal pierwszy dzień tygodnia (poniedziałek)
  const firstDayOfWeek = (start.getDay() + 6) % 7; // 0 = poniedziałek
  const emptyCells = Array.from({ length: firstDayOfWeek });

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button onClick={() => setMonth(addMonths(month, -1))}>
          Poprzedni
        </Button>
        <Typography variant="h6">
          {format(month, "MMMM yyyy", { locale: pl })}
        </Typography>
        <Button onClick={() => setMonth(addMonths(month, 1))}>Następny</Button>
      </Box>
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}
      >
        {["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"].map((d) => (
          <Typography key={d} align="center" fontWeight={600}>
            {d}
          </Typography>
        ))}
        {emptyCells.map((_, i) => (
          <Box key={i} />
        ))}
        {days.map((day) => {
          const duty = duties.find((d) => d.date === format(day, "yyyy-MM-dd"));
          return (
            <CalendarDay
              key={day.toISOString()}
              day={day}
              selected={selectedDate ? isSameDay(day, selectedDate) : false}
              duty={duty?.type}
              onClick={onDayClick}
            />
          );
        })}
      </Box>
    </Box>
  );
}

// Dialog tylko do podglądu informacji o dyżurze i danych dnia (mock fetch)
function DutyInfoDialog({
  open,
  date,
  duty,
  onClose,
}: {
  open: boolean;
  date: Date | null;
  duty?: string;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<any>(null);

  // React.useEffect(() => {
  //   if (open && date) {
  //     setLoading(true);
  //     setInfo(null);
  //     // Zasymulowany fetch do backendu
  //     setTimeout(() => {
  //       // Mockowane dane na podstawie daty
  //       const dateStr = format(date, "yyyy-MM-dd");
  //       if (duty) {
  //         setInfo({
  //           dzisiejszeWizyty: Math.floor(Math.random() * 6) + 1,
  //           grafik: duty === "1. zmiana" ? "08:00-16:00" : "15:00-23:00",
  //           type: duty,
  //         });
  //       } else {
  //         setInfo(null);
  //       }
  //       setLoading(false);
  //     }, 800);
  //   }
  // }, [open, date, duty]);

  React.useEffect(() => {
    if (open && date) {
      setLoading(true);
      setInfo(null);

      const doctorId = localStorage.getItem("id");
      if (!doctorId) return;
      const dateStr = format(date, "yyyy-MM-dd");

      const fetchData = async () => {
        try {
          // 1. Pobierz grafik (godziny)
          const dutyRes = await fetch(
            `/api/doctors/${doctorId}/schedule/${dateStr}`,
            {
              method: "GET",
              headers: {
                "x-user-id": doctorId,
                "x-user-role": "lekarz",
              },
            }
          );

          let grafik = "Brak";
          let type = "Brak dyżuru";

          if (dutyRes.ok) {
            const { type: range } = await dutyRes.json(); // np. "06:00-14:00"
            grafik = range;

            // Rozpoznaj typ zmiany po godzinie
            if (range === "06:00-14:00") {
              type = "Ranna";
            } else if (range === "14:00-22:00") {
              type = "Dzienna";
            } else if (range === "22:00-06:00") {
              type = "Nocna";
            } else {
              type = "Brak zmiany";
            }
          }

          // 2. Pobierz wizyty danego dnia
          const visitRes = await fetch(
            `/api/appointments/doctor/${doctorId}/day/${dateStr}`,
            {
              method: "GET",
              headers: {
                "x-user-id": doctorId,
                "x-user-role": "lekarz",
              },
            }
          );

          const visits = visitRes.ok ? await visitRes.json() : [];

          // 3. Ustaw dane do info boxa
          setInfo({
            dzisiejszeWizyty: visits.count,
            grafik: grafik ? grafik : "-", // np. "06:00-14:00"
            type, // np. "Ranna"
          });
        } catch (err) {
          console.error("Błąd ładowania danych dziennych:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [open, date]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Informacje o dyżurze i dniu</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Data: {date ? format(date, "yyyy-MM-dd") : ""}
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        ) : duty && info ? (
          <>
            <Typography>
              Zmiana: <b>{info.type}</b>
            </Typography>
            <Typography>
              Grafik: <b>{info.grafik}</b>
            </Typography>
            <Typography>
              Dzisiejsze wizyty: <b>{info.dzisiejszeWizyty}</b>
            </Typography>
          </>
        ) : (
          <Typography>Brak dyżuru i danych dla tego dnia.</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Grafik() {
  const duties = useLoaderData() as { date: string; type: string }[];
  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const getDutyForDate = (date: Date | null) => {
    if (!date) return undefined;
    const found = duties.find((d) => d.date === format(date, "yyyy-MM-dd"));
    return found?.type;
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Grafik dyżurów
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={pl}>
          <DutyCalendar
            duties={duties}
            onDayClick={handleDayClick}
            selectedDate={selectedDate}
            month={month}
            setMonth={setMonth}
          />
        </LocalizationProvider>
        <DutyInfoDialog
          open={dialogOpen}
          date={selectedDate}
          duty={getDutyForDate(selectedDate)}
          onClose={() => setDialogOpen(false)}
        />
      </Paper>
    </Box>
  );
}
