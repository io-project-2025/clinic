import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography, Paper, Alert } from "@mui/material";
import { useNavigate } from "react-router";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Sprawdzenie czy wszystkie pola są wypełnione
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      setError("Wszystkie pola muszą być wypełnione!");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Hasła nie są takie same!");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          haslo: form.password,
          imie: form.firstName,
          nazwisko: form.lastName,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data?.error || "Rejestracja nie powiodła się. Spróbuj ponownie.");
        return;
      }

      navigate("/login");
    } catch (err) {
      setError("Błąd połączenia z serwerem.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Rejestracja użytkownika
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Imię"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nazwisko"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
          />
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
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Powtórz hasło"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Zarejestruj się
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}