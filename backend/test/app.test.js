const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
    it('should return JSON response { "Works": true }', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ Works: true });
    });
});