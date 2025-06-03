// const request = require('supertest');
// const app = require('../app'); // Import your Express app
// const pool = require('../model/model');

// // Use a test database or specific test data that won't affect production
// describe('Doctors API Integration Tests', () => {
//   let testDoctorId;

//   // Test data
//   const testDoctor = {
//     imie: 'Test',
//     nazwisko: 'Doctor',
//     email: 'testdoc@example.com',
//     haslo: 'pass',
//     oddzial_id: null
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
//       if (testDoctorId) {
//         await pool.query('DELETE FROM lekarze WHERE lekarz_id = $1', [testDoctorId]);
//       }
//       // You could close the pool if needed 
//       // await pool.end();
//     } catch (error) {
//       console.error('Test cleanup failed:', error);
//     }
//   }
//   );

//   describe('GET /api/doctors', () => {
//     it('should return an array of doctors', async () => {
//       const res = await request(app).get('/api/doctors');
//       expect(res.statusCode).toBe(200);
//       expect(Array.isArray(res.body)).toBe(true);
//     });
//   }
//   );

//   describe('POST /api/doctors', () => {
//     it('should create a new doctor', async () => {
//       const res = await request(app)
//         .post('/api/doctors')
//         .send(testDoctor);
//       expect(res.statusCode).toBe(201);
//       expect(res.body).toHaveProperty('lekarz_id');
//       testDoctorId = res.body.lekarz_id; // Save the ID for later tests
//     });
//   }
//   );

//   describe('PUT /api/doctors/:doctorId', () => {
//     it('should update a doctor', async () => {
//       const updatedDoctor = {
//         ...testDoctor,
//         imie: 'Updated',
//         nazwisko: 'Doctor'
//       };
//       const res = await request(app)
//         .put(`/api/doctors/${testDoctorId}`)
//         .send(updatedDoctor);
//       expect(res.statusCode).toBe(200);
//       expect(res.body.imie).toBe('Updated');
//     });
//   }
//   );

//   describe('DELETE /api/doctors/:doctorId', () => {
//     it('should delete a doctor', async () => {
//       const res = await request(app).delete(`/api/doctors/${testDoctorId}`);
//       expect(res.statusCode).toBe(200);
//       expect(res.body).toHaveProperty('message');
//     });
//   }
//   );

// });