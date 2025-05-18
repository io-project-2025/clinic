// Lekarz: Pacjenci
// Obsługuje: GET /api/doctor/patients, GET /api/patients/:patientId

const pool = require('../model/model');

// Pobiera wszystkich pacjentów danego lekarza (na podstawie wizyt)
exports.getDoctorPatients = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const result = await pool.query(
      `SELECT DISTINCT p.pacjent_id, p.imie, p.nazwisko
       FROM pacjenci p
       JOIN wizyty w ON p.pacjent_id = w.pacjent_id
       WHERE w.lekarz_id = $1`,
      [doctorId]
    );

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
    const result = await pool.query(
      `SELECT pacjent_id, imie, nazwisko, email
       FROM pacjenci
       WHERE pacjent_id = $1`,
      [patientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pacjent nie znaleziony.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Błąd pobierania szczegółów pacjenta:', error);
    res.status(500).json({ error: 'Błąd serwera podczas pobierania pacjenta.' });
  }
};