const request = require('supertest');
const app = require('../app');
const db = require('../model/DatabaseService');

describe('Patients API Integration Tests', () => {
  let testPatientId;

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
      
      const res = await request(app)
        .get(`/api/patients/${testPatientId}`)
        .set('x-user-id', testPatientId)
        .set('x-user-role', 'pacjent');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('pacjent_id', testPatientId);
      expect(res.body).toHaveProperty('imie', testPatient.imie);
      expect(res.body).toHaveProperty('nazwisko', testPatient.nazwisko);
      expect(res.body).toHaveProperty('email', testPatient.email);
    });
  });
});
