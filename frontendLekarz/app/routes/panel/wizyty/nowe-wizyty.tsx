import * as React from "react";
import { useLoaderData } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";

// Typ prośby o wizytę
type VisitRequest = {
  id: string;
  patientName: string;
  requestedDate: string;
  reason: string;
  details: string;
};

export async function clientLoader() {
  const doctorId = localStorage.getItem("id");

  try {
    const res = await fetch(`/api/appointments/doctor/${doctorId}/requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": doctorId || "",
        "x-user-role": "lekarz",
      },
    });

    if (!res.ok) throw new Error("Nie udało się pobrać zgłoszeń wizyt");

    const requests = await res.json(); // type: VisitRequest[]
    return { requests };
  } catch (error) {
    console.error("Błąd ładowania zgłoszeń:", error);
    return { requests: [] };
  }
}

// Komponent wiersza tabeli prośby o wizytę
function VisitRequestRow({
  request,
  onReview,
}: {
  request: VisitRequest;
  onReview: (request: VisitRequest) => void;
}) {
  return (
    <TableRow>
      <TableCell>{request.patientName}</TableCell>
      <TableCell>{request.requestedDate}</TableCell>
      <TableCell>{request.reason}</TableCell>
      <TableCell>
        <Button
          variant="outlined"
          size="small"
          onClick={() => onReview(request)}
        >
          Przejrzyj
        </Button>
      </TableCell>
    </TableRow>
  );
}

// Komponent modalny do przeglądania i akceptacji/odrzucenia wizyty
function ReviewVisitDialog({
  open,
  request,
  onAccept,
  onReject,
  onClose,
}: {
  open: boolean;
  request: VisitRequest | null;
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Prośba o wizytę {request && `- ${request.patientName}`}
      </DialogTitle>
      <DialogContent>
        {request && (
          <Stack spacing={2} mt={1}>
            <Typography>
              <b>Data proponowana:</b> {request.requestedDate}
            </Typography>
            <Typography>
              <b>Powód:</b> {request.reason}
            </Typography>
            <Typography>
              <b>Szczegóły:</b> {request.details}
            </Typography>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button color="error" onClick={onReject} variant="outlined">
          Odrzuć
        </Button>
        <Button color="success" onClick={onAccept} variant="contained">
          Przyjmij
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Główny komponent
export default function NoweWizyty() {
  const { requests: initialRequests } = useLoaderData() as {
    requests: VisitRequest[];
  };
  const [requests, setRequests] =
    React.useState<VisitRequest[]>(initialRequests);
  const [selectedRequest, setSelectedRequest] =
    React.useState<VisitRequest | null>(null);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "error";
  }>({ open: false, message: "", severity: "success" });

  // Otwórz modal do przeglądania prośby
  const handleReview = (request: VisitRequest) => {
    setSelectedRequest(request);
  };

  // Akceptuj wizytę (mock)
  // const handleAccept = () => {
  //   if (!selectedRequest) return;
  //   setRequests(requests.filter((r) => r.id !== selectedRequest.id));
  //   setSnackbar({
  //     open: true,
  //     message: "Wizyta została przyjęta.",
  //     severity: "success",
  //   });
  //   setSelectedRequest(null);
  // };

  const handleAccept = async () => {
    if (!selectedRequest) return;

    try {
      const response = await fetch(
        `/api/appointments/${selectedRequest.id}/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": localStorage.getItem("id") || "",
            "x-user-role": "lekarz",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Nie udało się zaakceptować wizyty");
      }

      // Usuń wizytę z listy UI
      setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
      setSnackbar({
        open: true,
        message: "Wizyta została przyjęta.",
        severity: "success",
      });
      setSelectedRequest(null);
    } catch (error) {
      console.error("Błąd przy akceptacji wizyty:", error);
      setSnackbar({
        open: true,
        message: "Wystąpił błąd przy przyjmowaniu wizyty.",
        severity: "error",
      });
    }
  };

  // Odrzuć wizytę (mock)
  // const handleReject = () => {
  //   if (!selectedRequest) return;
  //   setRequests(requests.filter((r) => r.id !== selectedRequest.id));
  //   setSnackbar({
  //     open: true,
  //     message: "Wizyta została odrzucona.",
  //     severity: "info",
  //   });
  //   setSelectedRequest(null);
  // };


  const handleReject = async () => {
  if (!selectedRequest) return;

  try {
    const response = await fetch(`/api/appointments/${selectedRequest.id}/cancel`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": localStorage.getItem("id") || "",
        "x-user-role": "lekarz",
      },
    });

    if (!response.ok) {
      throw new Error("Nie udało się odrzucić wizyty");
    }

    setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
    setSnackbar({
      open: true,
      message: "Wizyta została odrzucona.",
      severity: "info",
    });
    setSelectedRequest(null);
  } catch (error) {
    console.error("Błąd przy odrzucaniu wizyty:", error);
    setSnackbar({
      open: true,
      message: "Wystąpił błąd przy odrzucaniu wizyty.",
      severity: "error",
    });
  }
};


  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Nowe prośby o wizyty
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="nowe prośby o wizyty">
          <TableHead>
            <TableRow>
              <TableCell>Pacjent</TableCell>
              <TableCell>Data proponowana</TableCell>
              <TableCell>Powód</TableCell>
              <TableCell>Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((r) => (
              <VisitRequestRow key={r.id} request={r} onReview={handleReview} />
            ))}
            {requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Brak nowych próśb o wizyty
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ReviewVisitDialog
        open={!!selectedRequest}
        request={selectedRequest}
        onAccept={handleAccept}
        onReject={handleReject}
        onClose={() => setSelectedRequest(null)}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
