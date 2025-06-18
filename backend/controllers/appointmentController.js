const db = require('../model/DatabaseService');

// Usunięcie wizyty
exports.deleteAppointment = async (req, res) => {
  const id = req.params.id;
  const userRole = req.headers['x-user-role'];
  const userId = parseInt(req.headers['x-user-id']);

  try {
    // Pobierz wizytę z bazy, żeby zweryfikować właściciela
    const appointmentResult = await db.getAppointmentById(id);
    if (appointmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Wizyta nie znaleziona' });
    }
    const appointment = appointmentResult.rows[0];

    // Pacjent może usuwać tylko swoje wizyty
    if (userRole === 'pacjent' && appointment.pacjent_id !== userId) {
      return res.status(403).json({ error: 'Brak dostępu do usunięcia tej wizyty' });
    }

    // Lekarz lub admin może mieć inne zasady (tu dopisz jeśli chcesz)

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
  const userRole = req.headers['x-user-role'];
  const userId = parseInt(req.headers['x-user-id']);

  try {
    const appointmentResult = await db.getAppointmentById(id);
    if (appointmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Wizyta nie znaleziona' });
    }
    const appointment = appointmentResult.rows[0];

    if (userRole === 'pacjent' && appointment.pacjent_id !== userId) {
      return res.status(403).json({ error: 'Brak dostępu do aktualizacji tej wizyty' });
    }

    // Lekarz/admin - tu możesz dodać reguły

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
  const userRole = req.headers['x-user-role'];
  const userId = parseInt(req.headers['x-user-id']);

  // Pacjent może tworzyć tylko wizyty dla siebie
  if (userRole === 'pacjent' && pacjent_id !== userId) {
    return res.status(403).json({ error: 'Nie możesz tworzyć wizyt dla innego pacjenta' });
  }

  try {
    const result = await db.createAppointment({ pacjent_id, data, godzina, lekarz_id, rodzaj_wizyty_id });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Błąd przy tworzeniu wizyty:', err);
    res.status(500).json({ error: 'Błąd serwera przy tworzeniu wizyty' });
  }
};

exports.getPatientAppointments = async (req, res) => {
  const { patientId } = req.params;
  try {
    const result = await db.getAppointmentsByPatient(patientId);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Błąd pobierania wizyt pacjenta:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};
// Pobranie wizyt pacjenta (pacjent może tylko swoje)
exports.getPatientAppointments = async (req, res) => {
  const patientId = parseInt(req.params.patientId);
  const userRole = req.headers['x-user-role'];
  const userId = parseInt(req.headers['x-user-id']);

  // Pacjent może pobierać tylko swoje wizyty
  if (userRole === 'pacjent' && patientId !== userId) {
    return res.status(403).json({ error: 'Brak dostępu do wizyt innego pacjenta' });
  }

  try {
    const result = await db.getAppointmentsByPatient(patientId);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Błąd przy pobieraniu wizyt:', err);
    res.status(500).json({ error: 'Błąd serwera przy pobieraniu wizyt' });
  }
};
