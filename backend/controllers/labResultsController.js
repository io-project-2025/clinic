// Lekarz: Wyniki badań
// Obsługuje: GET /api/patients/:patientId/lab-results, GET /api/lab-results/:resultId

const pool = require('../model/model');

// Pobiera wszystkie wyniki badań dla pacjenta
exports.getPatientLabResults = async (req, res) => {
    const { patientId } = req.params;
    
    // Validate patientId is a number
    if (isNaN(patientId)) {
        return res.status(400).json({ error: 'ID pacjenta musi być liczbą.' });
    }
  
    try {
      const result = await pool.query(
        'SELECT badanie_id, wyniki FROM badania WHERE pacjent_id = $1',
        [patientId]
      );
  
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
      const result = await pool.query(
        'SELECT badanie_id, wyniki, pacjent_id FROM badania WHERE badanie_id = $1',
        [resultId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Wynik badania nie znaleziony.' });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Błąd przy pobieraniu szczegółów:', error);
      res.status(500).json({ error: 'Błąd serwera przy pobieraniu szczegółów badania.' });
    }
};