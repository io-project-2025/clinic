const request = require('supertest');
const app = require('../app');

describe('API Endpoints', () => {
    it('GET /api/doctors should return array of doctors', async () => {
        const res = await request(app).get('/api/doctors');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/departments should return array of departments', async () => {
        const res = await request(app).get('/api/departments');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/patients/1 should return patient details or 404', async () => {
        const res = await request(app).get('/api/patients/1');
        expect([200, 404]).toContain(res.statusCode);
        if (res.statusCode === 200) {
            expect(res.body).toHaveProperty('pacjent_id');
        }
    });

    it('GET /api/statistics/appointments should return statistics array', async () => {
        const res = await request(app).get('/api/statistics/appointments');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/statistics/diagnoses should return statistics array', async () => {
        const res = await request(app).get('/api/statistics/diagnoses');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});