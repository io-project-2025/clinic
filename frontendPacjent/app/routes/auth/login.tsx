import React, { useState, useEffect } from "react";
import { Box, Button, Container, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router";

export default function Login() {

  useEffect( () => {
    if(localStorage.getItem("user") && localStorage.getItem("id")) {
      // Jeśli użytkownik jest już zalogowany, przekieruj go do panelu
      navigate("/panel");
    }
  }, [])


  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
  let isSuccess = true; 

    if(isSuccess){
        navigate("/panel");
        const id = 1; // id uzytkownika ktory sie zalogował
        localStorage.setItem("user", form.email.split("@")[0]); 
        localStorage.setItem("id", id.toString()); // Simulacja ID użytkownika
    }
    else
        alert("Błędny email lub hasło. Spróbuj ponownie.");
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
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Zaloguj się
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}