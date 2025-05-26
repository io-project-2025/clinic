// Administrator: Zarządzanie oddziałami
// Obsługuje: GET /api/departments, POST /api/departments, PUT /api/departments/:departmentId, DELETE /api/departments/:departmentId

const pool = require('../model/model');

// Pobieranie listy oddziałów
exports.getDepartments = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM oddzialy ORDER BY oddzial_id');
      res.json(result.rows);
    } catch (err) {
      console.error('Błąd pobierania oddziałów:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
};

// Dodawanie nowego oddziału
exports.createDepartment = async (req, res) => {
    const { nazwa, adres } = req.body;
    if (!nazwa || !adres) {
      return res.status(400).json({ error: 'Brak nazwy lub adresu oddziału' });
    }
    try {
      const result = await pool.query(
        'INSERT INTO oddzialy (nazwa, adres) VALUES ($1, $2) RETURNING *',
        [nazwa, adres]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Błąd dodawania oddziału:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
};

// Edytowanie oddziału
exports.updateDepartment = async (req, res) => {
    const { departmentId } = req.params;
    const { nazwa, adres } = req.body;
    if (!nazwa || !adres) {
      return res.status(400).json({ error: 'Brak nazwy lub adresu oddziału' });
    }
    try {
      const result = await pool.query(
        'UPDATE oddzialy SET nazwa = $1, adres = $2 WHERE oddzial_id = $3 RETURNING *',
        [nazwa, adres, departmentId]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Oddział nie znaleziony' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Błąd aktualizacji oddziału:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
};

// Usuwanie oddziału
exports.deleteDepartment = async (req, res) => {
    const { departmentId } = req.params;
    try {
      const result = await pool.query(
        'DELETE FROM oddzialy WHERE oddzial_id = $1',
        [departmentId]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Oddział nie znaleziony' });
      }
      res.json({ message: `Oddział ${departmentId} usunięty` });
    } catch (err) {
      console.error('Błąd usuwania oddziału:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
};