import * as React from "react";
import { useLoaderData } from "react-router";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Typography, Stack, TableSortLabel
} from "@mui/material";

// Typ pacjenta
type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  pesel: string;
  birthDate: string;
  phone: string;
  email: string;
};

// Mockowany clientLoader
export async function loader() {
  const patients: Patient[] = [
    { id: "1", firstName: "Jan", lastName: "Kowalski", pesel: "90010112345", birthDate: "1990-01-01", phone: "500111222", email: "jan.kowalski@example.com" },
    { id: "2", firstName: "Anna", lastName: "Nowak", pesel: "85050567890", birthDate: "1985-05-05", phone: "500222333", email: "anna.nowak@example.com" },
    { id: "3", firstName: "Piotr", lastName: "Wiśniewski", pesel: "92030345678", birthDate: "1992-03-03", phone: "500333444", email: "piotr.wisniewski@example.com" },
    { id: "4", firstName: "Maria", lastName: "Wójcik", pesel: "95070798765", birthDate: "1995-07-07", phone: "500444555", email: "maria.wojcik@example.com" },
    { id: "5", firstName: "Tomasz", lastName: "Kaczmarek", pesel: "88080823456", birthDate: "1988-08-08", phone: "500555666", email: "tomasz.kaczmarek@example.com" },
    { id: "6", firstName: "Katarzyna", lastName: "Mazur", pesel: "93090934567", birthDate: "1993-09-09", phone: "500666777", email: "katarzyna.mazur@example.com" },
    { id: "7", firstName: "Michał", lastName: "Krawczyk", pesel: "87020245678", birthDate: "1987-02-02", phone: "500777888", email: "michal.krawczyk@example.com" },
    { id: "8", firstName: "Agnieszka", lastName: "Piotrowska", pesel: "91040456789", birthDate: "1991-04-04", phone: "500888999", email: "agnieszka.piotrowska@example.com" },
    { id: "9", firstName: "Paweł", lastName: "Grabowski", pesel: "94060667890", birthDate: "1994-06-06", phone: "500999000", email: "pawel.grabowski@example.com" },
    { id: "10", firstName: "Ewa", lastName: "Zielińska", pesel: "89090978901", birthDate: "1989-09-09", phone: "500000111", email: "ewa.zielinska@example.com" },
  ];
  return { patients };
}

type Order = "asc" | "desc";
type OrderBy = keyof Patient;

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilized = array.map((el, index) => [el, index] as [T, number]);
  stabilized.sort((a, b) => {
    const cmp = comparator(a[0], b[0]);
    if (cmp !== 0) return cmp;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

const headCells: { id: OrderBy; label: string }[] = [
  { id: "firstName", label: "Imię" },
  { id: "lastName", label: "Nazwisko" },
  { id: "pesel", label: "PESEL" },
  { id: "birthDate", label: "Data urodzenia" },
  { id: "phone", label: "Telefon" },
  { id: "email", label: "Email" },
];

export default function PatientsList() {
  const { patients } = useLoaderData() as { patients: Patient[] };
  const [peselFilter, setPeselFilter] = React.useState("");
  const [lastNameFilter, setLastNameFilter] = React.useState("");
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<OrderBy>("lastName");

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredPatients = React.useMemo(() => {
    return patients.filter((p) =>
      p.pesel.includes(peselFilter) &&
      p.lastName.toLowerCase().includes(lastNameFilter.toLowerCase())
    );
  }, [patients, peselFilter, lastNameFilter]);

  const sortedPatients = React.useMemo(
    () => stableSort(filteredPatients, getComparator(order, orderBy)),
    [filteredPatients, order, orderBy]
  );

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Lista pacjentów
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Filtruj po PESEL"
          value={peselFilter}
          onChange={(e) => setPeselFilter(e.target.value)}
          size="small"
        />
        <TextField
          label="Filtruj po nazwisku"
          value={lastNameFilter}
          onChange={(e) => setLastNameFilter(e.target.value)}
          size="small"
        />
      </Stack>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="tabela pacjentów">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={() => handleRequestSort(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPatients.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.firstName}</TableCell>
                <TableCell>{p.lastName}</TableCell>
                <TableCell>{p.pesel}</TableCell>
                <TableCell>{p.birthDate}</TableCell>
                <TableCell>{p.phone}</TableCell>
                <TableCell>{p.email}</TableCell>
              </TableRow>
            ))}
            {sortedPatients.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Brak wyników
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}