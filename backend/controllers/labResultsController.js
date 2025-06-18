const db = require('../model/DatabaseService');

// Pobiera wszystkie wyniki badań dla pacjenta
exports.getPatientLabResults = async (req, res) => {
  const { patientId } = req.params;
  const userRole = req.headers['x-user-role'];
  const userId = parseInt(req.headers['x-user-id']);

  // Pacjent może widzieć tylko swoje wyniki
  if (userRole === 'pacjent' && userId !== parseInt(patientId)) {
    return res.status(403).json({ error: 'Brak dostępu do wyników innego pacjenta.' });
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
  const userRole = req.headers['x-user-role'];
  const userId = parseInt(req.headers['x-user-id']);

  try {
    const result = await db.getLabResultDetails(resultId);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wynik badania nie znaleziony.' });
    }

    const labResult = result.rows[0];

    // Załóżmy, że w labResult jest pole patient_id, które mówi komu wynik należy
    if (userRole === 'pacjent' && userId !== labResult.patient_id) {
      return res.status(403).json({ error: 'Brak dostępu do szczegółów wyniku innego pacjenta.' });
    }

    res.status(200).json(labResult);
  } catch (error) {
    console.error('Błąd przy pobieraniu szczegółów:', error);
    res.status(500).json({ error: 'Błąd serwera przy pobieraniu szczegółów badania.' });
  }
};