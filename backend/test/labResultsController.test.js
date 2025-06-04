const request = require('supertest');
const app = require('../app');
const db = require('../model/DatabaseService');

describe('Lab Results API Integration Tests', () => {
    // Use patient ID 1 for simplicity
    const patientId = 1;
    let testResultId;

    afterAll(async () => {
        try {
            await db.pool.end();
            console.log('Test cleanup complete');
        } catch (error) {
            console.error('Test cleanup failed:', error);
        }
    });

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

        it('should return 400 for invalid patient ID format', async () => {
            const invalidId = 'abc';
            
            const res = await request(app)
                .get(`/api/lab-results/patients/${invalidId}/lab-results`);
                
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        describe('database error handling', () => {
            let originalQuery;

            beforeEach(() => {
                originalQuery = db.pool.query;
                // Mock the query function to simulate a database error
                db.pool.query = jest.fn().mockRejectedValue(new Error('Database error'));
            });

            afterEach(() => {
                // Restore original query function
                db.pool.query = originalQuery;
            });

            it('should handle database errors gracefully', async () => {
                const res = await request(app)
                    .get(`/api/lab-results/patients/${patientId}/lab-results`);
                    
                expect(res.statusCode).toBe(500);
                expect(res.body).toHaveProperty('error', 'Błąd serwera przy pobieraniu wyników badań.');
            });
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

        it('should return 400 for invalid result ID format', async () => {
            const invalidId = 'abc';
            
            const res = await request(app)
                .get(`/api/lab-results/${invalidId}`);
                
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        describe('database error handling', () => {
            let originalQuery;

            beforeEach(() => {
                originalQuery = db.pool.query;
                // Mock the query function to simulate a database error
                db.pool.query = jest.fn().mockRejectedValue(new Error('Database error'));
            });

            afterEach(() => {
                // Restore original query function
                db.pool.query = originalQuery;
            });

            it('should handle database errors gracefully', async () => {
                const res = await request(app)
                    .get(`/api/lab-results/${testResultId || 1}`);
                    
                expect(res.statusCode).toBe(500);
                expect(res.body).toHaveProperty('error', 'Błąd serwera przy pobieraniu szczegółów badania.');
            });
        });
    });
});