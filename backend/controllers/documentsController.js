const db = require('../model/DatabaseService');

// Pobieranie dokumentów pacjenta
exports.getPatientDocuments = async (req, res) => {
  const { patientId } = req.params;
  const userRole = req.headers['x-user-role'];
  const userId = parseInt(req.headers['x-user-id']);

  // Pacjent może pobierać tylko swoje dokumenty
  if (userRole === 'pacjent' && userId !== parseInt(patientId)) {
    return res.status(403).json({ error: 'Brak dostępu do dokumentów innego pacjenta.' });
  }

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
  const userRole = req.headers['x-user-role'];
  const userId = parseInt(req.headers['x-user-id']);

  // Pacjent może pobierać tylko swoje notatki
  if (userRole === 'pacjent' && userId !== parseInt(patientId)) {
    return res.status(403).json({ error: 'Brak dostępu do notatek innego pacjenta.' });
  }

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