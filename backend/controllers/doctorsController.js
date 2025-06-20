const db = require('../model/DatabaseService');

// Pobieranie listy lekarzy
exports.getDoctors = async (req, res) => {
    try {
      const result = await db.getDoctors();
      res.json(result.rows);
    } catch (err) {
      console.error('Błąd pobierania lekarzy:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
};

// Edytowanie lekarza
exports.updateDoctor = async (req, res) => {
    const { doctorId } = req.params;
    const { imie, nazwisko, email, haslo, oddzial_id } = req.body;
    if (!imie || !nazwisko) {
      return res.status(400).json({ error: 'Imię i nazwisko są wymagane' });
    }
    try {
      const result = await db.updateDoctor(doctorId, { imie, nazwisko, email, haslo, oddzial_id });
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Lekarz nie znaleziony' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Błąd aktualizacji lekarza:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
};

// Dodawanie nowego lekarzaAdd commentMore actions
exports.createDoctor = async (req, res) => {
  const { imie, nazwisko, email, haslo, oddzial_id } = req.body;
  if (!imie || !nazwisko) {
    return res.status(400).json({ error: 'Imię i nazwisko są wymagane' });
  }
  try {
    const result = await db.createDoctor({ imie, nazwisko, email, haslo, oddzial_id });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Błąd dodawania lekarza:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};


// Usuwanie lekarzaAdd commentMore actions
exports.deleteDoctor = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const result = await db.deleteDoctor(doctorId);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Lekarz nie znaleziony' });
    }
    res.json({ message: `Lekarz ${doctorId} usunięty` });
  } catch (err) {
    console.error('Błąd usuwania lekarza:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

// Pobiera szczegóły konkretnego lekarza
exports.getDoctorDetails = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const result = await db.getDoctorById(doctorId);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lekarz nie znaleziony.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Błąd pobierania szczegółów lekarza:', error);
    res.status(500).json({ error: 'Błąd serwera podczas pobierania lekarza.' });
  }
};