const request = require('supertest');
const app = require('../app');
const db = require('../model/DatabaseService');

describe('Documents API Integration Tests', () => {
  // Use patient ID 1 for simplicity
  const patientId = 1;

  afterAll(async () => {
    try {
      // Close the pool connection
      await db.pool.end();
      console.log('Test cleanup complete');
    } catch (error) {
      console.error('Test cleanup failed:', error);
    }
  });

  // Test getPatientDocuments endpoint
  describe('GET /api/patients/:patientId/documents', () => {
    it('should return documents for patient with ID ${patientId}', async () => {

      const res = await request(app)
        .get(`/api/patients/${patientId}/documents`)
        .set('x-user-id', '1')
        .set('x-user-role', 'lekarz');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      
      // Log for debugging
      console.log(`Found ${res.body.length} documents for patient ID ${patientId}`);
    });
  });

  // Test getPatientNotes endpoint
  describe('GET /api/patients/:patientId/notes', () => {
    it('should return notes for patient with ID ${patientId}', async () => {
      const res = await request(app)
        .get(`/api/patients/${patientId}/notes`)
        .set('x-user-id', '1')
        .set('x-user-role', 'lekarz');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      
      // Log for debugging
      console.log(`Found ${res.body.length} notes for patient ID ${patientId}`);
    });
  });

  // Test with non-existent patient ID
  describe('Edge cases', () => {
    it('should return empty array for non-existent patient (documents)', async () => {
      const nonExistentId = 999999;
      
      const res = await request(app)
        .get(`/api/patients/${nonExistentId}/documents`)
        .set('x-user-id', '1')
        .set('x-user-role', 'lekarz');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(0);
    });

    it('should return empty array for non-existent patient (notes)', async () => {
      const nonExistentId = 999999;
      
      const res = await request(app)
        .get(`/api/patients/${nonExistentId}/notes`)
        .set('x-user-id', '1')
        .set('x-user-role', 'lekarz');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(0);
    });
  });
});
