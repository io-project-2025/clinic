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

