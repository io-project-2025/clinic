const db = require('../model/DatabaseService');

// Pobiera wszystkie wyniki badań dla pacjenta
exports.getPatientLabResults = async (req, res) => {
  const { patientId } = req.params;
  
  // Validate patientId is a number
  if (isNaN(patientId)) {
    return res.status(400).json({ error: 'ID pacjenta musi być liczbą.' });
  }

  try {
    const result = await db.getPatientLabResults(patientId);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Błąd przy pobieraniu wyników:', error);
    res.status(500).json({ error: 'Błąd serwera przy pobieraniu wyników badań.' });
  }
};

// Pobiera szczegóły jednego wyniku
exports.getLabResultDetails = async (req, res) => {
  const { resultId } = req.params;

  // Validate resultId is a number
  if (isNaN(resultId)) {
      return res.status(400).json({ error: 'ID wyniku badania musi być liczbą.' });
  }
  

  try {
    const result = await db.getLabResultDetails(resultId);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wynik badania nie znaleziony.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Błąd przy pobieraniu szczegółów:', error);
    res.status(500).json({ error: 'Błąd serwera przy pobieraniu szczegółów badania.' });
  }
};