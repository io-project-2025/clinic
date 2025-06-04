const db = require('../model/DatabaseService');

// Pobieranie listy oddziałów
exports.getDepartments = async (req, res) => {
    try {
      const result = await db.getDepartments();
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
      const result = await db.createDepartment({ nazwa, adres });
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
      const result = await db.updateDepartment(departmentId, { nazwa, adres });
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
      const result = await db.deleteDepartment(departmentId);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Oddział nie znaleziony' });
      }
      res.json({ message: `Oddział ${departmentId} usunięty` });
    } catch (err) {
      console.error('Błąd usuwania oddziału:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
};
