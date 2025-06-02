// Administrator: Rejestracja i logowanie pacjentów i lekarzy
// Obsługuje: POST /api/auth/register, POST /api/auth/login 

const pool = require('../model/model');

// Funkcja walidacji emaila
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

// Rejestracja pacjenta (plain text password)
exports.registerPatient = async (req, res) => {
    const { imie, nazwisko, email, haslo } = req.body;
    if (!imie || !nazwisko || !email || !haslo) {
      return res.status(400).json({ error: 'Wszystkie pola są wymagane' });
    }

    // Sprawdź format emaila
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Nieprawidłowy format email' });
    }
  
    try {
      // Sprawdź czy email już istnieje w pacjentach
      const exists = await pool.query('SELECT * FROM pacjenci WHERE email = $1', [email]);
      if (exists.rows.length > 0) {
        return res.status(400).json({ error: 'Email już jest zarejestrowany' });
      }
  
      // Dodaj pacjenta z hasłem w plain text
      const result = await pool.query(
        'INSERT INTO pacjenci (imie, nazwisko, email, haslo) VALUES ($1, $2, $3, $4) RETURNING pacjent_id, imie, nazwisko, email',
        [imie, nazwisko, email, haslo]
      );
  
      res.status(201).json({ message: 'Pacjent zarejestrowany', patient: result.rows[0] });
    } catch (error) {
      console.error('Błąd rejestracji pacjenta:', error);
      res.status(500).json({ error: 'Błąd serwera' });
    }
};
  
// Logowanie (pacjent lub lekarz, plain text password)
exports.login = async (req, res) => {
    const { email, haslo } = req.body;
    if (!email || !haslo) {
      return res.status(400).json({ error: 'Email i hasło są wymagane' });
    }

    // Sprawdź format emaila
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Nieprawidłowy format email' });
    }
  
    try {
      // Szukaj w pacjentach
      let result = await pool.query('SELECT * FROM pacjenci WHERE email = $1', [email]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        if (user.haslo !== haslo) {
          return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
        }
        return res.json({
          message: 'Zalogowano jako pacjent',
          role: 'pacjent',
          user: {
            id: user.pacjent_id,
            imie: user.imie,
            nazwisko: user.nazwisko,
            email: user.email,
          },
        });
      }
  
      // Szukaj w lekarzach
      result = await pool.query('SELECT * FROM lekarze WHERE email = $1', [email]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        if (user.haslo !== haslo) {
          return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
        }
        return res.json({
          message: 'Zalogowano jako lekarz',
          role: 'lekarz',
          user: {
            id: user.lekarz_id,
            imie: user.imie,
            nazwisko: user.nazwisko,
            email: user.email,
            oddzial_id: user.oddzial_id,
          },
        });
      }
  
      res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    } catch (error) {
      console.error('Błąd logowania:', error);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  };