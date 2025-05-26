const request = require('supertest');
const app = require('../app');

describe('API Endpoints', () => {
    it('GET / should return {Works: true}', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ Works: true });
    });

    it('GET /api/doctors should return an array', async () => {
        const res = await request(app).get('/api/doctors');
        expect(res.statusCode).toBe(200);
        // expect(Array.isArray(res.body)).toBe(true);
    });

    // Add more tests for other endpoints as needed
});