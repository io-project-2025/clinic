// appointmentController.js

const db = require('../model/DatabaseService');

// Usunięcie wizyty  
exports.deleteAppointment = async (req, res) => {
    const id = req.params.id;
  
    try {
      await db.deleteAppointment(id);
      res.json({ message: `Wizyta ${id} usunięta` });
    } catch (err) {
      console.error('Błąd przy usuwaniu wizyty:', err);
      res.status(500).json({ error: 'Błąd serwera przy usuwaniu' });
    }
};

// Aktualizacja wizyty
exports.updateAppointment = async (req, res) => {
    const id = req.params.id;
    const { data, godzina, lekarz_id, rodzaj_wizyty_id } = req.body;
  
    try {
      const result = await db.updateAppointment(id, { data, godzina, lekarz_id, rodzaj_wizyty_id });
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Błąd przy aktualizacji wizyty:', err);
      res.status(500).json({ error: 'Błąd serwera przy aktualizacji' });
    }
};

// Utworzenie wizyty
exports.createAppointment = async (req, res) => {
    const { pacjent_id, data, godzina, lekarz_id, rodzaj_wizyty_id } = req.body;

    try {
        const result = await db.createAppointment({ pacjent_id, data, godzina, lekarz_id, rodzaj_wizyty_id });
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Błąd przy tworzeniu wizyty:', err);
        res.status(500).json({ error: 'Błąd serwera przy tworzeniu wizyty' });
    }
};
