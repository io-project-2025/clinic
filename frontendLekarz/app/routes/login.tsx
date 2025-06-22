import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    haslo: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("id")) {
      navigate("/panel");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data?.error || "Błędny email lub hasło. Spróbuj ponownie.");
        return;
      }

      //   const data = await res.json();
      // const data = {
      //   user: {
      //     id: 1,
      //     imie: "Jan",
      //     nazwisko: "Kowalski",
      //     email: "jan.kowalski@gmail.com",
      //   },
      // };
      const data = await res.json();
      localStorage.setItem("id", String(data.user.id));
      localStorage.setItem("firstName", String(data.user.imie));
      localStorage.setItem("lastName", String(data.user.nazwisko));
      localStorage.setItem("email", String(data.user.email));

      navigate("/panel");
    } catch (err) {
      setError("Błąd połączenia z serwerem.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Logowanie
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Hasło"
            name="haslo"
            type="password"
            value={form.haslo}
            onChange={handleChange}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Zaloguj się
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
