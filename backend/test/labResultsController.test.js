const request = require('supertest');
const app = require('../app');
const { pool } = require('./helpers/db');

describe('Lab Results API Integration Tests', () => {
    // Use patient ID 1 for simplicity
    const patientId = 1;

    // Variable to store a lab result ID for detailed test
    let testResultId;

    

    // Test getPatientLabResults endpoint
    describe('GET /api/lab-results/patients/:patientId/lab-results', () => {
        it('should return lab results for patient with ID ${patientId}', async () => {
            const res = await request(app)
                .get(`/api/lab-results/patients/${patientId}/lab-results`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);

            // Store a result ID for the next test if available
            if (res.body.length > 0) {
                testResultId = res.body[0].badanie_id;
                console.log(`Found ${res.body.length} lab results for patient ID ${patientId}`);
                console.log(`Using result ID ${testResultId} for detailed test`);
            } else {
                console.log(`No lab results found for patient ID ${patientId}`);
            }
        });

        it('should return empty array for non-existent patient', async () => {
            const nonExistentId = 999999;

            const res = await request(app)
                .get(`/api/lab-results/patients/${nonExistentId}/lab-results`);
                
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body).toHaveLength(0);
        });
    });

    // Test getLabResultDetails endpoint
    describe('GET /api/lab-results/:resultId', () => {
        it('should return details for a specific lab result if available', async () => {
            // Skip if no test result ID is available
            if (!testResultId) {
                console.log('Skipping detailed result test - no result ID available');
                return;
            }

            const res = await request(app)
                .get(`/api/lab-results/${testResultId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('badanie_id', testResultId);
            expect(res.body).toHaveProperty('pacjent_id', patientId);
            expect(res.body).toHaveProperty('wyniki');
        });

        it('should return 404 for non-existent result ID', async () => {
            const nonExistentId = 999999;

            const res = await request(app)
                .get(`/api/lab-results/${nonExistentId}`);

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error');
        });
    });
});