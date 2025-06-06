const db = require('../model/DatabaseService');

// Rejestracja pacjenta (plain text password)
exports.registerPatient = async (req, res) => {
    const { imie, nazwisko, email, haslo } = req.body;
    if (!imie || !nazwisko || !email || !haslo) {
      return res.status(400).json({ error: 'Wszystkie pola są wymagane' });
    }
  
    try {
      // Sprawdź czy email już istnieje w pacjentach
      const exists = await db.checkEmailExists(email);
      if (exists.rows.length > 0) {
        return res.status(400).json({ error: 'Email już jest zarejestrowany' });
      }
  
      // Dodaj pacjenta z hasłem w plain text
      const result = await db.registerPatient({ imie, nazwisko, email, haslo });
  
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
  
    try {
      // Szukaj w pacjentach
      let result = await db.getPatientByEmail(email);
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
      result = await db.getDoctorByEmail(email);
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
