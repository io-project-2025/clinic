// Administrator: Statystyki szpitalne
// Obsługuje: GET /api/statistics/appointments, GET /api/statistics/diagnoses

const pool = require('../model/model');

// Statystyki wizyt (np. liczba wizyt w ostatnim miesiącu, podział wg rodzaju wizyty)
exports.getAppointmentsStatistics = async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          rodzaj_wizyty_id,
          COUNT(*) AS liczba_wizyt,
          AVG(ocena) AS srednia_ocena
        FROM clinic.wizyty
        GROUP BY rodzaj_wizyty_id
        ORDER BY liczba_wizyt DESC
      `);
  
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Błąd pobierania statystyk wizyt:', error);
      res.status(500).json({ error: 'Błąd serwera podczas pobierania statystyk wizyt.' });
    }
};

// Statystyki diagnoz (załóżmy, że diagnozy są częścią notatek lub dokumentów wizyty w JSON, więc wyciągamy np. liczby wg diagnoz)
exports.getDiagnosesStatistics = async (req, res) => {
    try {
      // Przykład: zliczamy wystąpienia diagnoz zapisanych w dokumenty_wizyty JSON (zakładamy, że jest tam pole 'diagnozy')
      const result = await pool.query(`
        SELECT diagnoza, COUNT(*) AS liczba
        FROM (
          SELECT jsonb_array_elements_text(dokumenty_wizyty->'diagnozy') AS diagnoza
          FROM clinic.wizyty
          WHERE dokumenty_wizyty ? 'diagnozy'
        ) AS diagnozy
        GROUP BY diagnoza
        ORDER BY liczba DESC
      `);
  
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Błąd pobierania statystyk diagnoz:', error);
      res.status(500).json({ error: 'Błąd serwera podczas pobierania statystyk diagnoz.' });
    }
};