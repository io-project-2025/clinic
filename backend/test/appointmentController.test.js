const request = require('supertest');
const app = require('../app'); // Import your Express app
const db = require('../model/DatabaseService');

// Use a test database or specific test data that won't affect production
describe('Appointment API Integration Tests', () => {
  let testAppointmentId;
  
  // Test data
  const testAppointment = {
    pacjent_id: 1, // Make sure this ID exists in your DB
    data: '2025-06-01',
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
    } catch (error) {
      console.error('Test cleanup failed:', error);
    }
  });
  
  describe('POST /api/appointments', () => {
    it('should create a new appointment', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .send(testAppointment);
      
      expect(res.statusCode).toBe(201);
      
      // Sprawdź, czy odpowiedź zawiera identyfikator wizyty
      expect(res.body).toHaveProperty('wizyta_id');
      
      // Save the ID for later tests and cleanup
      testAppointmentId = res.body.wizyta_id;
    });
  });
  
  describe('PUT /api/appointments/:id', () => {
    it('should update an appointment', async () => {
      // Skip if we don't have a test appointment
      if (!testAppointmentId) {
        console.log('Skipping update test - no test appointment');
        return;
      }
      
      const updatedData = {
        ...testAppointment,
        godzina: '11:30' // Change the time
      };
      
      const res = await request(app)
        .put(`/api/appointments/${testAppointmentId}`)
        .send(updatedData);
      
      expect(res.statusCode).toBe(200);
      // Sprawdź tylko czy godzina zaczyna się od "11:30", aby obsłużyć format "11:30:00"
      expect(res.body.godzina.startsWith('11:30')).toBe(true);
    });
  });
  
  describe('DELETE /api/appointments/:id', () => {
    it('should delete an appointment', async () => {
      // Skip if we don't have a test appointment
      if (!testAppointmentId) {
        console.log('Skipping delete test - no test appointment');
        return;
      }
      
      const res = await request(app)
        .delete(`/api/appointments/${testAppointmentId}`)
        .send();
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', `Wizyta ${testAppointmentId} usunięta`);
      
      // Clear the ID since we've deleted it
      testAppointmentId = null;
    });
  });
  
  describe('GET /api/appointments/:id', () => {
    // This test needs an existing appointment ID
    // You might need to query the database first or skip if no data exists
    it('should return a specific appointment if it exists', async () => {
      // First get a valid ID from the database
      const appointmentsRes = await request(app).get('/api/appointments');
      
      if (appointmentsRes.body.length > 0) {
        const validId = appointmentsRes.body[0].wizyta_id;
        
        const res = await request(app)
          .get(`/api/appointments/${validId}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('wizyta_id', validId);
      } else {
        console.log('Skipping specific appointment test - no appointments found');
      }
    });
  });
});
