const db = require('../model/DatabaseService');

// Pobieranie dokumentów pacjenta - tylko skierowania
exports.getPatientDocuments = async (req, res) => {
  const { patientId } = req.params;

  try {
    const result = await db.getPatientDocuments(patientId);

    // Mapujemy wizyty na dokumenty typu "Skierowanie" tylko jeśli istnieje i nie jest puste
    const documents = result.rows
      .filter(row => row.dokumenty_wizyty.skierowanie && row.dokumenty_wizyty.skierowanie.trim() !== '')
      .map(row => ({
        id: `${row.wizyta_id}_skierowanie`,
        type: 'Skierowanie',
        date: row.data,
        time: row.godzina,
        description: row.dokumenty_wizyty.skierowanie,
        wizyta_id: row.wizyta_id,
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