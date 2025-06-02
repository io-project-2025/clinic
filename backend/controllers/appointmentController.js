// Lekarz: Wizyty
// Obsługuje: PATCH /api/appointments/:id/status, DELETE /api/appointments/:id, PUT /api/appointments/:id, POST /api/appointments, POST /api/appointments/:id/approve

const pool = require('../model/model');

// Walidacja formatu czasu (HH:MM)
const validateTimeFormat = (time) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
};

// Walidacja daty (nie może być w przeszłości)
const validateDate = (date) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
};



// Usunięcie wizyty  
exports.deleteAppointment = async (req, res) => {
    const id = req.params.id;
  
    try {
      await pool.query('DELETE FROM wizyty WHERE id = $1', [id]);
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

    // Walidacja formatu czasu
    if (!validateTimeFormat(godzina)) {
        return res.status(400).json({ error: 'Nieprawidłowy format godziny. Użyj formatu HH:MM' });
    }

    // Walidacja daty
    if (!validateDate(data)) {
        return res.status(400).json({ error: 'Data wizyty nie może być w przeszłości' });
    }
    try {
        const result = await pool.query(
            `UPDATE wizyty
             SET data = $1, godzina = $2, lekarz_id = $3, rodzaj_wizyty_id = $4
             WHERE id = $5 RETURNING *`,
            [data, godzina, lekarz_id, rodzaj_wizyty_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Wizyta nie znaleziona' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Błąd przy aktualizacji wizyty:', err);
        res.status(500).json({ error: 'Błąd serwera przy aktualizacji' });
    }
};

// Utworzenie wizyty
exports.createAppointment = async (req, res) => {
    const { pacjent_id, data, godzina, lekarz_id, rodzaj_wizyty_id } = req.body;

    // Walidacja wymaganych pól
    if (!pacjent_id || !data || !godzina || !lekarz_id || !rodzaj_wizyty_id) {
        return res.status(400).json({ error: 'Wszystkie pola są wymagane' });
    }

    // Walidacja formatu czasu
    if (!validateTimeFormat(godzina)) {
        return res.status(400).json({ error: 'Nieprawidłowy format godziny. Użyj formatu HH:MM' });
    }

    // Walidacja daty
    if (!validateDate(data)) {
        return res.status(400).json({ error: 'Data wizyty nie może być w przeszłości' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO wizyty (pacjent_id, data, godzina, lekarz_id, rodzaj_wizyty_id)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [pacjent_id, data, godzina, lekarz_id, rodzaj_wizyty_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Błąd przy tworzeniu wizyty:', err);
        res.status(500).json({ error: 'Błąd serwera przy tworzeniu wizyty' });
    }
};
