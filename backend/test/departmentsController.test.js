const request = require('supertest');
const app = require('../app'); // Import your Express app
const db = require('../model/DatabaseService');

// Use a test database or specific test data that won't affect production
describe('Departments API Integration Tests', () => {

  let testDepartmentId;

  // Test data
  const testDepartment = {
    nazwa: 'Test Department',
    adres: 'Test Address'
  };

  // Helper to reset database state or set up test data
  beforeAll(async () => {
    // Optional: Create test records if needed
    console.log('Test setup complete');
  });

  afterAll(async () => {
    // Clean up test data
    try {
      if (testDepartmentId) {
        await db.pool.query('DELETE FROM oddzialy WHERE oddzial_id = $1', [testDepartmentId]);
      }
      // Close the pool connection
      await db.pool.end();
      console.log('Test cleanup complete');
    } catch (error) {
      console.error('Test cleanup failed:', error);
    }
  });

  describe('GET /api/departments', () => {
    it('should return an array of departments', async () => {
      const res = await request(app)
        .get('/api/departments')
        .set('x-user-id', '1') // Mock admin user
        .set('x-user-role', 'admin');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/departments', () => {
    it('should create a new department', async () => {
      const res = await request(app)
        .post('/api/departments')
        .set('x-user-id', '1') // Mock admin user
        .set('x-user-role', 'admin')
        .send(testDepartment);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('oddzial_id');
      testDepartmentId = res.body.oddzial_id; // Save the ID for later tests
    });
  });

  describe('PUT /api/departments/:departmentId', () => {
    it('should update an existing department', async () => {
      const updatedData = { nazwa: 'Updated Department', adres: 'Updated Address' };
      const res = await request(app)
        .put(`/api/departments/${testDepartmentId}`)
        .set('x-user-id', '1') // Mock admin user
        .set('x-user-role', 'admin')
        .send(updatedData);
      expect(res.statusCode).toBe(200);
      expect(res.body.nazwa).toBe(updatedData.nazwa);
    });
  });

  describe('DELETE /api/departments/:departmentId', () => {
    it('should delete an existing department', async () => {
      const res = await request(app)
      .delete(`/api/departments/${testDepartmentId}`)
      .set('x-user-id', '1') // Mock admin user
      .set('x-user-role', 'admin');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', `Oddział ${testDepartmentId} usunięty`);
    });
  });

});


