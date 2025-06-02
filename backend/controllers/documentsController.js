// Lekarz: Recepty & Skierowania
// Obsługuje: GET /api/documents/patient/:patientId/documents GET /api/documents/patient/:patientId/notes

const pool = require('../model/model');

// Pobieranie dokumentów pacjenta
exports.getPatientDocuments = async (req, res) => {
    const { patientId } = req.params;
  
    try {
      const result = await pool.query(
        `SELECT wizyta_id, data, godzina, dokumenty_wizyty
         FROM wizyty
         WHERE pacjent_id = $1 AND dokumenty_wizyty IS NOT NULL`,
        [patientId]
      );
  
      const documents = result.rows.map(row => ({
        wizyta_id: row.wizyta_id,
        data: row.data,
        godzina: row.godzina,
        dokumenty: row.dokumenty_wizyty
      }));
  
      res.json(documents);
    } catch (err) {
      console.error('Błąd podczas pobierania dokumentów pacjenta:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
};

// Pobieranie notatek pacjenta
exports.getPatientNotes = async (req, res) => {
  const { patientId } = req.params;

  try {
    const result = await pool.query(
      `SELECT wizyta_id, data, godzina, notatki_wizyty
       FROM wizyty
       WHERE pacjent_id = $1 AND notatki_wizyty IS NOT NULL`,
      [patientId]
    );

    const notes = result.rows.map(row => ({
      wizyta_id: row.wizyta_id,
      data: row.data,
      godzina: row.godzina,
      notatki: row.notatki_wizyty
    }));

    res.json(notes);
  } catch (err) {
    console.error('Błąd podczas pobierania notatek pacjenta:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};
