// Administrator: Zarządzanie lekarzami
// Obsługuje: GET /api/doctors, POST /api/doctors, PUT /api/doctors/:doctorId, DELETE /api/doctors/:doctorId

const pool = require('../model/model');

// Pobieranie listy lekarzy
exports.getDoctors = async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT lekarz_id, imie, nazwisko, email, oddzial_id
        FROM lekarze
        ORDER BY nazwisko, imie
      `);
      res.json(result.rows);
    } catch (err) {
      console.error('Błąd pobierania lekarzy:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
};

// Dodawanie nowego lekarza
exports.createDoctor = async (req, res) => {
    const { imie, nazwisko, email, haslo, oddzial_id } = req.body;
    if (!imie || !nazwisko) {
      return res.status(400).json({ error: 'Imię i nazwisko są wymagane' });
    }
    try {
      const result = await pool.query(
        `INSERT INTO lekarze (imie, nazwisko, email, haslo, oddzial_id) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [imie, nazwisko, email, haslo, oddzial_id || null]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Błąd dodawania lekarza:', err);
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
      const result = await pool.query(
        `UPDATE lekarze SET imie=$1, nazwisko=$2, email=$3, haslo=$4, oddzial_id=$5
         WHERE lekarz_id=$6 RETURNING *`,
        [imie, nazwisko, email, haslo, oddzial_id || null, doctorId]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Lekarz nie znaleziony' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Błąd aktualizacji lekarza:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
};

// Usuwanie lekarza
exports.deleteDoctor = async (req, res) => {
    const { doctorId } = req.params;
    try {
      const result = await pool.query(
        'DELETE FROM lekarze WHERE lekarz_id = $1',
        [doctorId]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Lekarz nie znaleziony' });
      }
      res.json({ message: `Lekarz ${doctorId} usunięty` });
    } catch (err) {
      console.error('Błąd usuwania lekarza:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
};