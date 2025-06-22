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
  Grid,
  Divider,
  TextField,
  IconButton,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";

// Typy
type Employee = { id: number; name: string };
type ShiftType = "I zmiana" | "II zmiana";
type Assignment = {
  [date: string]: {
    "I zmiana": { employees: Employee[] };
    "II zmiana": { employees: Employee[] };
  };
};

const days = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d.toISOString().slice(0, 10);
});

// Loader pobierający pracowników i przypisania
export async function clientLoader({ request }: LoaderFunctionArgs) {
  // Mock pracowników
  const employees: Employee[] = [
    { id: 1, name: "Anna Nowak" },
    { id: 2, name: "Jan Kowalski" },
    { id: 3, name: "Maria Wiśniewska" },
  ];

  // Mock przypisań (np. Anna Nowak na I zmianę pierwszego dnia)
  const assignments: Assignment = {};
  days.forEach((date, idx) => {
    assignments[date] = {
      "I zmiana": { employees: idx === 0 ? [employees[0]] : [] },
      "II zmiana": { employees: idx === 1 ? [employees[1]] : [] },
    };
  });

  return { employees, assignments, days };
}

// Stylowane komponenty
const EmployeeListPaper = styled(Paper)({
  height: "100%",
  minWidth: 220,
  padding: 16,
  overflowY: "auto",
});

const CalendarPaper = styled(Paper)({
  width: "100%",
  padding: 16,
  overflowX: "auto",
});

function EmployeeList({
  employees,
  onDragStart,
}: {
  employees: Employee[];
  onDragStart: (e: React.DragEvent, employee: Employee) => void;
}) {
  return (
    <EmployeeListPaper elevation={3}>
      <Typography variant="h6" gutterBottom>
        Pracownicy
      </Typography>
      <List>
        {employees.map((emp) => (
          <ListItem
            key={emp.id}
            draggable
            onDragStart={(e) => onDragStart(e, emp)}
            sx={{
              cursor: "grab",
              background: "#fff3e0",
              mb: 1,
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <ListItemText primary={emp.name} />
          </ListItem>
        ))}
      </List>
    </EmployeeListPaper>
  );
}

function Calendar({
  days,
  assignments,
  onDropEmployee,
  onRemoveAssignment,
}: {
  days: string[];
  assignments: Assignment;
  onDropEmployee: (date: string, shift: ShiftType, employee: Employee) => void;
  onRemoveAssignment: (date: string, shift: ShiftType, employeeId: number) => void;
}) {
  return (
    <CalendarPaper elevation={3}>
      <Typography variant="h6" gutterBottom>
        Grafik dyżurów
      </Typography>
      <Grid container spacing={2} wrap="nowrap">
        {days.map((date) => (
          <Grid
            item
            key={date}
            xs={12 / days.length}
            sx={{
              minWidth: 160,
              maxWidth: 180,
              flex: `1 1 ${100 / days.length}%`,
            }}
          >
            <Paper sx={{ p: 2, mb: 2, minHeight: 180 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {date}
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {(["I zmiana", "II zmiana"] as ShiftType[]).map((shift) => (
                <ShiftSlot
                  key={shift}
                  date={date}
                  shift={shift}
                  assignments={assignments[date]?.[shift]?.employees || []}
                  onDropEmployee={onDropEmployee}
                  onRemoveAssignment={onRemoveAssignment}
                />
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </CalendarPaper>
  );
}

function ShiftSlot({
  date,
  shift,
  assignments,
  onDropEmployee,
  onRemoveAssignment,
}: {
  date: string;
  shift: ShiftType;
  assignments: Employee[];
  onDropEmployee: (date: string, shift: ShiftType, employee: Employee) => void;
  onRemoveAssignment: (date: string, shift: ShiftType, employeeId: number) => void;
}) {
  const DRAG_EMPLOYEE = "DRAG_EMPLOYEE";

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData(DRAG_EMPLOYEE);
    if (data) {
      const employee = JSON.parse(data);
      // Wywołanie backendu - dodanie dyżuru
      await fetch("/api/shifts/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, shift, employeeId: employee.id }),
      });
      onDropEmployee(date, shift, employee);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemove = async (employeeId: number) => {
    // Wywołanie backendu - usunięcie dyżuru
    await fetch("/api/shifts/unassign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, shift, employeeId }),
    });
    onRemoveAssignment(date, shift, employeeId);
  };

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      sx={{
        mb: 1,
        p: 1,
        minHeight: 48,
        border: "2px dashed #bdbdbd",
        borderRadius: 1,
        background: assignments.length > 0 ? "#ffe0b2" : "#fafafa",
        transition: "background 0.2s",
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
        {shift}
      </Typography>
      <Stack spacing={1} sx={{ mt: 1 }}>
        {assignments.length === 0 && (
          <Typography variant="body2" sx={{ color: "#bdbdbd" }}>
            Przeciągnij pracownika
          </Typography>
        )}
        {assignments.map((emp) => (
          <Box
            key={emp.id}
            sx={{
              display: "flex",
              alignItems: "center",
              background: "#fff",
              borderRadius: 1,
              px: 1,
              py: 0.5,
              mb: 0.5,
              boxShadow: 1,
            }}
          >
            <TextField
              size="small"
              value={emp.name}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemove(emp.id)}
                    title="Usuń z dyżuru"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                ),
              }}
              sx={{ width: 140, background: "#fff" }}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default function SchedulePage() {
  const { employees, assignments: initialAssignments, days } = useLoaderData() as {
    employees: Employee[];
    assignments: Assignment;
    days: string[];
  };

  const DRAG_EMPLOYEE = "DRAG_EMPLOYEE";

  const [assignments, setAssignments] = React.useState<Assignment>(initialAssignments);

  const handleDragStart = (e: React.DragEvent, employee: Employee) => {
    e.dataTransfer.setData(DRAG_EMPLOYEE, JSON.stringify(employee));
  };

  const handleDropEmployee = (date: string, shift: ShiftType, employee: Employee) => {
    setAssignments((prev) => {
      // Dodaj tylko jeśli nie ma już tego pracownika na tej zmianie
      const alreadyAssigned = prev[date][shift].employees.some((e) => e.id === employee.id);
      if (alreadyAssigned) return prev;
      return {
        ...prev,
        [date]: {
          ...prev[date],
          [shift]: { employees: [...prev[date][shift].employees, employee] },
        },
      };
    });
  };

  const handleRemoveAssignment = (date: string, shift: ShiftType, employeeId: number) => {
    setAssignments((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        [shift]: {
          employees: prev[date][shift].employees.filter((e) => e.id !== employeeId),
        },
      },
    }));
  };

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100%", gap: 3, p: 2 }}>
      <Box sx={{ width: 260, minWidth: 220, flexShrink: 0 }}>
        <EmployeeList employees={employees} onDragStart={handleDragStart} />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Calendar
          days={days}
          assignments={assignments}
          onDropEmployee={handleDropEmployee}
          onRemoveAssignment={handleRemoveAssignment}
        />
      </Box>
    </Box>
  );
}