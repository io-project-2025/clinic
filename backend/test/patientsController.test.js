// const request = require('supertest');
// const app = require('../app'); // Import your Express app
// const pool = require('../model/model');

// // Use a test database or specific test data that won't affect production
// describe('Patients API Integration Tests', () => {
//   let testPatientId;

//   // Test data
//   const testPatient = {
//     imie: 'Test',
//     nazwisko: 'Patient',
//     email: 'testpatient@example.com',
//     haslo: 'pass'
//   };
//   // Helper to reset database state or set up test data
//   beforeAll(async () => {
//     // Optional: Create test data that your tests will use
//     try {
//       // You can create test records here if needed
//       console.log('Test setup complete');
//     } catch (error) {
//       console.error('Test setup failed:', error);
//     }
//   });

//   afterAll(async () => {
//     // Clean up test data
//     try {
//       // Delete any test data created during tests
//       if (testPatientId) {
//         await pool.query('DELETE FROM pacjenci WHERE pacjent_id = $1', [testPatientId]);
//       }
//       // You could close the pool if needed 
//       // await pool.end();
//     } catch (error) {
//       console.error('Test cleanup failed:', error);
//     }
//   });

//   describe('GET /api/patients/:patientId', () => {
//     it('should return patient details or 404', async () => {
//       const res = await request(app).get('/api/patients/1');
//       expect([200, 404]).toContain(res.statusCode);
//       if (res.statusCode === 200) {
//         expect(res.body).toHaveProperty('pacjent_id');
//       }
//     });
//   });

//   describe('GET /api/patients/doctor/:doctorId/patients', () => {
//     it('should return patients for a doctor or 404', async () => {
//       const res = await request(app).get('/api/patients/doctor/1/patients');
//       expect([200, 404]).toContain(res.statusCode);
//       if (res.statusCode === 200) {
//         expect(Array.isArray(res.body)).toBe(true);
//         if (res.body.length > 0) {
//           expect(res.body[0]).toHaveProperty('pacjent_id');
//           expect(res.body[0]).toHaveProperty('imie');
//           expect(res.body[0]).toHaveProperty('nazwisko');
//         }
//       }
//     });
//   });
// });