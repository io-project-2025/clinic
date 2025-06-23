import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";

// Komponent konsoli
function ConsoleBox({
  prompt,
  setPrompt,
  onSubmit,
  loading,
}: {
  prompt: string;
  setPrompt: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      onSubmit();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        bgcolor: "#222",
        color: "#fff",
        fontFamily: "monospace",
        minHeight: 220,
        maxWidth: 1200,
        mx: "auto",
        mt: 6,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: "#ff7043" }}>
        SQL Console
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography sx={{ color: "#81c784" }}>&gt;</Typography>
        <TextField
          inputRef={inputRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Wpisz komendę SQL i naciśnij Enter"
          variant="standard"
          fullWidth
          InputProps={{
            disableUnderline: true,
            style: {
              color: "#fff",
              fontFamily: "monospace",
              fontSize: 18,
              background: "transparent",
            },
          }}
          sx={{
            bgcolor: "transparent",
            flex: 1,
          }}
          disabled={loading}
        />
        {loading && <CircularProgress size={24} color="inherit" />}
      </Box>
    </Paper>
  );
}

// Komponent dialogu z wynikiem
function OutputDialog({
  open,
  output,
  onClose,
}: {
  open: boolean;
  output: string;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Wynik zapytania</DialogTitle>
      <DialogContent>
        <Paper
          sx={{
            bgcolor: "#111",
            color: "#fff",
            fontFamily: "monospace",
            p: 2,
            whiteSpace: "pre-wrap",
            minHeight: 80,
          }}
        >
          {output}
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Zamknij
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Komponent główny
export default function SqlConsolePage() {
  const [prompt, setPrompt] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const adminID = "1";
    try {
      // Wysyłka do backendu (mock: /api/console)
      const res = await fetch("/api/admins/console", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": adminID || "",
          "x-user-role": "admin",
        },
        body: JSON.stringify({ query: prompt }),
      });
      const data = await res.json();
      setOutput(data.output ?? JSON.stringify(data, null, 2));
    } catch (e: any) {
      setOutput("Błąd: " + (e?.message || "Nieznany błąd"));
    }
    setLoading(false);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#f5f5f5", p: 2 }}>
      <ConsoleBox
        prompt={prompt}
        setPrompt={setPrompt}
        onSubmit={handleSubmit}
        loading={loading}
      />
      <OutputDialog
        open={dialogOpen}
        output={output}
        onClose={handleCloseDialog}
      />
    </Box>
  );
}
