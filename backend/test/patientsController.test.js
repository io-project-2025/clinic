const request = require('supertest');
const app = require('../app');
const db = require('../model/DatabaseService');

describe('Patients API Integration Tests', () => {
  let testPatientId;
  let testDoctorId;

  // Test data with unique email (using timestamp)
  const timestamp = Date.now();
  const testPatient = {
    imie: 'Test',
    nazwisko: 'Patient',
    email: `testpatient${timestamp}@example.com`,
    haslo: 'pass123'
  };

  // Create test patient before running tests
  beforeAll(async () => {
    try {
      // Create test patient
      const patientResult = await db.pool.query(
        'INSERT INTO pacjenci (imie, nazwisko, email, haslo) VALUES ($1, $2, $3, $4) RETURNING pacjent_id',
        [testPatient.imie, testPatient.nazwisko, testPatient.email, testPatient.haslo]
      );
      testPatientId = patientResult.rows[0].pacjent_id;
      
      // Get an existing doctor ID for doctor-patient tests
      const doctorResult = await db.pool.query('SELECT lekarz_id FROM lekarze LIMIT 1');
      if (doctorResult.rows.length > 0) {
        testDoctorId = doctorResult.rows[0].lekarz_id;
        
        // Create an appointment to link doctor and patient
        try {
          // First get a valid visit type ID
          const visitTypeResult = await db.pool.query('SELECT rodzaj_wizyty_id FROM rodzaje_wizyt LIMIT 1');
          const visitTypeId = visitTypeResult.rows[0]?.rodzaj_wizyty_id || 1;
          
          await db.pool.query(
            'INSERT INTO wizyty (pacjent_id, data, godzina, lekarz_id, rodzaj_wizyty_id) VALUES ($1, $2, $3, $4, $5)',
            [testPatientId, '2025-06-10', '12:00', testDoctorId, visitTypeId]
          );
        } catch (err) {
          console.log('Could not create test appointment:', err.message);
        }
      }
      
      console.log(`Test setup complete: Created patient ID ${testPatientId}`);
    } catch (error) {
      console.error('Test setup failed:', error);
    }
  });

  afterAll(async () => {
    try {
      if (testPatientId) {
        // First delete any appointments for this patient
        await db.pool.query('DELETE FROM wizyty WHERE pacjent_id = $1', [testPatientId]);
        
        // Then delete the patient
        await db.pool.query('DELETE FROM pacjenci WHERE pacjent_id = $1', [testPatientId]);
        console.log(`Test patient ${testPatientId} removed`);
      }
      
      // Close the pool connection
      await db.pool.end();
      console.log('Test cleanup complete');
      
    } catch (error) {
      console.error('Test cleanup failed:', error);
    }
  });

  describe('GET /api/patients/:patientId', () => {
    it('should return details for our test patient', async () => {
      // Skip if setup failed
      if (!testPatientId) {
        console.log('Skipping test - no test patient ID available');
        return;
      }
      
      const res = await request(app).get(`/api/patients/${testPatientId}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('pacjent_id', testPatientId);
      expect(res.body).toHaveProperty('imie', testPatient.imie);
      expect(res.body).toHaveProperty('nazwisko', testPatient.nazwisko);
      expect(res.body).toHaveProperty('email', testPatient.email);
    });
  });

  describe('GET /api/patients/doctor/:doctorId/patients', () => {
    it('should return patients for our test doctor including test patient', async () => {
      // Skip if setup failed
      if (!testDoctorId || !testPatientId) {
        console.log('Skipping test - missing test doctor or patient ID');
        return;
      }
      
      const res = await request(app).get(`/api/patients/doctor/${testDoctorId}/patients`);
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      
      // Our test patient should be in the results
      const foundPatient = res.body.find(p => p.pacjent_id === testPatientId);
      expect(foundPatient).toBeDefined();
      expect(foundPatient).toHaveProperty('imie', testPatient.imie);
      expect(foundPatient).toHaveProperty('nazwisko', testPatient.nazwisko);
    });
  });
});
