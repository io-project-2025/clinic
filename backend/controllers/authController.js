const db = require('../model/DatabaseService');

// Rejestracja pacjenta (plain text password)
exports.registerPatient = async (req, res) => {
    const { imie, nazwisko, email, haslo } = req.body;
    if (!imie || !nazwisko || !email || !haslo) {
      return res.status(400).json({ error: 'Wszystkie pola są wymagane' });
    }
  
    try {
      // Sprawdź czy email już istnieje w pacjentach, lekarzach lub administratorach
      const [patientExists, doctorExists, adminExists] = await Promise.all([
        db.checkPatientEmailExists(email),
        db.checkDoctorEmailExists(email),
        db.checkAdminEmailExists(email),
      ]);
      
      if (
        patientExists.rows.length > 0 ||
        doctorExists.rows.length > 0 ||
        adminExists.rows.length > 0
      ) {
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
  const { email, haslo, rola } = req.body;

  if (!email || !haslo || !rola) {
    return res.status(400).json({ error: 'Email i hasło są wymagane' });
  }

  try {
    if (rola === "pacjent") {
      const result = await db.getPatientByEmail(email);
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
      }

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

    if (rola === "lekarz") {
      const result = await db.getDoctorByEmail(email);
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
      }

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
  } catch (err) {
    console.error("Błąd logowania:", err);
    return res.status(500).json({ error: 'Błąd serwera' });
  }
};

// Pobranie profilu użytkownika (pacjent lub lekarz)
exports.getUserProfile = async (req, res) => {
  const { id, role } = req.user;

  try {
    let result;
    if (role === 'pacjent') {
      result = await db.getPatientById(id);
    } else if (role === 'lekarz') {
      result = await db.getDoctorById(id);
    } else if (role === 'admin') {
      result = await db.getAdminById(id);
    } else {
      return res.status(400).json({ error: 'Nieznana rola użytkownika' });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
    }

    const user = result.rows[0];
    res.json({
      id,
      role,
      imie: user.imie,
      nazwisko: user.nazwisko,
      email: user.email,
      ...(role === 'lekarz' && { oddzial_id: user.oddzial_id }),
    });
  } catch (error) {
    console.error('Błąd pobierania profilu użytkownika:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

// Wylogowanie użytkownika
exports.logout = (req, res) => {
  // Jeśli sesja, tu ją zniszczysz
  // Jeśli tokeny — frontend powinien po prostu usunąć token
  // Ta aplikacja nie zawiera tokenów ani sesji, więc po prostu zwraca komunikat
  res.json({ message: 'Wylogowano pomyślnie' });
};