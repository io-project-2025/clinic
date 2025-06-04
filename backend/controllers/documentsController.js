const db = require('../model/DatabaseService');

// Pobieranie dokumentów pacjenta
exports.getPatientDocuments = async (req, res) => {
    const { patientId } = req.params;
  
    try {
      const result = await db.getPatientDocuments(patientId);
  
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
    const result = await db.getPatientNotes(patientId);

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
