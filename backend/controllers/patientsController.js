const db = require('../model/DatabaseService');

// Pobiera wszystkich pacjentów danego lekarza (na podstawie wizyt)
exports.getDoctorPatients = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const result = await db.getDoctorPatients(doctorId);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Błąd pobierania pacjentów lekarza:', error);
    res.status(500).json({ error: 'Błąd serwera podczas pobierania pacjentów.' });
  }
};

// Pobiera szczegóły konkretnego pacjenta
exports.getPatientDetails = async (req, res) => {
  const { patientId } = req.params;

  try {
    const result = await db.getPatientDetails(patientId);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pacjent nie znaleziony.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Błąd pobierania szczegółów pacjenta:', error);
    res.status(500).json({ error: 'Błąd serwera podczas pobierania pacjenta.' });
  }
};

// Pobiera wszystkich pacjentów
exports.getAllPatients = async (req, res) => {
  try {
    const result = await db.getAllPatients();

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Błąd pobierania pacjentów:', error);
    res.status(500).json({ error: 'Błąd serwera podczas pobierania pacjentów.' });
  }
};