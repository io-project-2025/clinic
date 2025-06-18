const db = require('../model/DatabaseService');

// Usunięcie wizyty
exports.deleteAppointment = async (req, res) => {
  const id = req.params.id;

  try {
    const appointmentResult = await db.getAppointmentById(id);
    if (appointmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Wizyta nie znaleziona' });
    }

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
    const appointmentResult = await db.getAppointmentById(id);
    if (appointmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Wizyta nie znaleziona' });
    }

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

// Pobranie wizyt pacjenta
exports.getPatientAppointments = async (req, res) => {
  const patientId = parseInt(req.params.patientId);

  try {
    const result = await db.getAppointmentsByPatient(patientId);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Błąd przy pobieraniu wizyt:', err);
    res.status(500).json({ error: 'Błąd serwera przy pobieraniu wizyt' });
  }
};
