const request = require('supertest');
const app = require('../app'); // Import your Express app
const db = require('../model/DatabaseService');

// Use a test database or specific test data that won't affect production
describe('Appointment API Integration Tests', () => {
  let testAppointmentId;
  
  // Test data
  const testAppointment = {
    pacjent_id: 1, // Make sure this ID exists in your DB
    data: '2027-06-01', // wizyta jest do kardiologa na NFZ, dlatego taki szybki termin
    godzina: '10:00',
    lekarz_id: 1, // Make sure this ID exists in your DB
    rodzaj_wizyty_id: 1 // Make sure this ID exists in your DB
  };
  
  // Helper to reset database state or set up test data
  beforeAll(async () => {
    // Optional: Create test data that your tests will use
    try {
      // You can create test records here if needed
      console.log('Test setup complete');
    } catch (error) {
      console.error('Test setup failed:', error);
    }
  });
  
  afterAll(async () => {
    // Clean up test data
    try {
      // Delete any test data created during tests
      if (testAppointmentId) {
        await db.query('DELETE FROM wizyty WHERE wizyta_id = $1', [testAppointmentId]);
      }
      // Zamknij połączenie z bazą danych
      await db.pool.end();
      console.log('Test cleanup complete');
    } catch (error) {
      console.error('Test cleanup failed:', error);
    }
  });
  
  describe('POST /api/appointments', () => {
    it('should create a new appointment', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('x-user-id', '1')
        .set('x-user-role', 'pacjent')
        .send(testAppointment);
      
      expect(res.statusCode).toBe(201);
      
      // Sprawdź, czy odpowiedź zawiera identyfikator wizyty
      expect(res.body).toHaveProperty('wizyta_id');
      
      // Save the ID for later tests and cleanup
      testAppointmentId = res.body.wizyta_id;
    });
  });
  
  describe('PUT /api/appointments/:id/done', () => {
    it('should mark an appointment as done', async () => {
      // Skip if we don't have a test appointment
      if (!testAppointmentId) {
        console.log('Skipping update test - no test appointment');
        return;
      }
      
      const res = await request(app)
        .put(`/api/appointments/${testAppointmentId}/done`)
        .set('x-user-id', '1')
        .set('x-user-role', 'lekarz') // Assuming a doctor updates the appointment
        .send();
      
      expect(res.statusCode).toBe(200);
      expect(res.body.appointment).toHaveProperty('status', 'zrealizowana');
    });
  });
  
  describe('PUT /api/appointments/:id/cancel', () => {
    it('should cancel an appointment', async () => {
      // Skip if we don't have a test appointment
      if (!testAppointmentId) {
        console.log('Skipping cancel test - no test appointment');
        return;
      }
      
      const res = await request(app)
        .put(`/api/appointments/${testAppointmentId}/cancel`)
        .set('x-user-id', '1')
        .set('x-user-role', 'pacjent') // Assuming a patient can cancel
        .send();
      
      expect(res.statusCode).toBe(200);
      expect(res.body.appointment).toHaveProperty('status', 'odwolana');
    });
  });
  
  describe('GET /api/appointments/patient/:patientId', () => {
    // This test needs an existing appointment ID
    // You might need to query the database first or skip if no data exists
    it('should return all appointments for a patient', async () => {
      // Create a temporary appointment to ensure one exists for the test
      const tempAppointment = { ...testAppointment, godzina: '15:00' };
      const createRes = await request(app)
        .post('/api/appointments')
        .set('x-user-id', '1')
        .set('x-user-role', 'pacjent')
        .send(tempAppointment);
      
      expect(createRes.statusCode).toBe(201);
      const tempId = createRes.body.wizyta_id;
      const patientId = tempAppointment.pacjent_id;
        
      const res = await request(app)
        .get(`/api/appointments/patient/${patientId}`)
        .set('x-user-id', '1')
        .set('x-user-role', 'pacjent');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const found = res.body.find(a => a.wizyta_id === tempId);
      expect(found).toBeDefined();

      // Clean up the temporary appointment
      if (tempId) {
        await db.query('DELETE FROM wizyty WHERE wizyta_id = $1', [tempId]);
      }
    });
  });
});
