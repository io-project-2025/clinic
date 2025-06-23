const request = require('supertest');
const app = require('../app');
const db = require('../model/DatabaseService');

describe('Doctors API Integration Tests', () => {
  let testDoctorId;
  let testPatientId;

  const testDoctor = {
    imie: 'Test',
    nazwisko: 'Doctor',
    email: `testdoc${Date.now()}@example.com`,
    haslo: 'pass123'
  };

  const testPatient = {
    imie: 'Test',
    nazwisko: 'Patient',
    email: `testpatient${Date.now()}@example.com`,
    haslo: 'pass123'
  };

  beforeAll(async () => {
    try {
      // Create test doctor
      const doctorResult = await db.pool.query(
        'INSERT INTO lekarze (imie, nazwisko, email, haslo) VALUES ($1, $2, $3, $4) RETURNING lekarz_id',
        [testDoctor.imie, testDoctor.nazwisko, testDoctor.email, testDoctor.haslo]
      );
      testDoctorId = doctorResult.rows[0].lekarz_id;

      // Create test patient
      const patientResult = await db.pool.query(
        'INSERT INTO pacjenci (imie, nazwisko, email, haslo) VALUES ($1, $2, $3, $4) RETURNING pacjent_id',
        [testPatient.imie, testPatient.nazwisko, testPatient.email, testPatient.haslo]
      );
      testPatientId = patientResult.rows[0].pacjent_id;

      // Create an appointment to link the doctor and patient
      const visitTypeResult = await db.pool.query('SELECT rodzaj_wizyty_id FROM rodzaje_wizyt LIMIT 1');
      const visitTypeId = visitTypeResult.rows[0]?.rodzaj_wizyty_id || 1;
      await db.pool.query(
        'INSERT INTO wizyty (pacjent_id, data, godzina, lekarz_id, rodzaj_wizyty_id) VALUES ($1, $2, $3, $4, $5)',
        [testPatientId, '2025-06-21', '10:00', testDoctorId, visitTypeId]
      );

      console.log('Test setup complete');
    } catch (error) {
      console.error('Test setup failed:', error);
    }
  });

  afterAll(async () => {
    try {
      // Clean up appointments, patients, and doctors
      await db.pool.query('DELETE FROM wizyty WHERE pacjent_id = $1', [testPatientId]);
      await db.pool.query('DELETE FROM pacjenci WHERE pacjent_id = $1', [testPatientId]);
      await db.pool.query('DELETE FROM lekarze WHERE lekarz_id = $1', [testDoctorId]);
      await db.pool.end();
      console.log('Test cleanup complete');
    } catch (error) {
      console.error('Test cleanup failed:', error);
    }
  });

  describe('GET /api/doctors', () => {
    it('should return an array of doctors', async () => {
      const res = await request(app)
        .get('/api/doctors')
        .set('x-user-id', '1')
        .set('x-user-role', 'admin');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/doctors', () => {
    it('should create a new doctor', async () => {
      const newDoctor = {
        imie: 'New',
        nazwisko: 'Doctor',
        email: `newdoc${Date.now()}@example.com`,
        haslo: 'newpass'
      };
      const res = await request(app)
        .post('/api/doctors')
        .set('x-user-id', '1')
        .set('x-user-role', 'admin')
        .send(newDoctor);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('lekarz_id');

      // Clean up the new doctor
      await db.pool.query('DELETE FROM lekarze WHERE lekarz_id = $1', [res.body.lekarz_id]);
    });

    it('should return 400 when name is missing', async () => {
      const invalidDoctor = {
        ...testDoctor,
        imie: ''
      };
      const res = await request(app)
        .post('/api/doctors')
        .set('x-user-id', '1')
        .set('x-user-role', 'admin')
        .send(invalidDoctor);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Imię i nazwisko są wymagane');
    });

    it('should return 400 when surname is missing', async () => {
      const invalidDoctor = {
        ...testDoctor,
        nazwisko: ''
      };
      const res = await request(app)
        .post('/api/doctors')
        .set('x-user-id', '1')
        .set('x-user-role', 'admin')
        .send(invalidDoctor);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Imię i nazwisko są wymagane');
    });

    it('should return 400 when both name and surname are missing', async () => {
      const invalidDoctor = {
        ...testDoctor,
        imie: '',
        nazwisko: ''
      };
      const res = await request(app)
        .post('/api/doctors')
        .set('x-user-id', '1')
        .set('x-user-role', 'admin')
        .send(invalidDoctor);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Imię i nazwisko są wymagane');
    });
  });

  describe('PUT /api/doctors/:doctorId', () => {
    it('should update a doctor', async () => {
      const updatedDoctor = {
        ...testDoctor,
        imie: 'Updated'
      };
      const res = await request(app)
        .put(`/api/doctors/${testDoctorId}`)
        .set('x-user-id', '1')
        .set('x-user-role', 'admin')
        .send(updatedDoctor);
      expect(res.statusCode).toBe(200);
      expect(res.body.imie).toBe('Updated');
    });
  });

  describe('DELETE /api/doctors/:doctorId', () => {
    it('should delete a doctor', async () => {
      // Create a doctor to be deleted in this test
      const doctorToDelete = {
        imie: 'ToDelete',
        nazwisko: 'Doctor',
        email: `todelete.${Date.now()}@example.com`,
        haslo: 'pass123'
      };
      const result = await db.pool.query(
        'INSERT INTO lekarze (imie, nazwisko, email, haslo) VALUES ($1, $2, $3, $4) RETURNING lekarz_id',
        [doctorToDelete.imie, doctorToDelete.nazwisko, doctorToDelete.email, doctorToDelete.haslo]
      );
      const doctorIdToDelete = result.rows[0].lekarz_id;

      const res = await request(app)
        .delete(`/api/doctors/${doctorIdToDelete}`)
        .set('x-user-id', '1')
        .set('x-user-role', 'admin');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /api/doctors/:doctorId/patients', () => {
    it('should return patients for a specific doctor', async () => {
      const res = await request(app)
        .get(`/api/doctors/${testDoctorId}/patients`)
        .set('x-user-id', testDoctorId)
        .set('x-user-role', 'lekarz');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const patientExists = res.body.some(p => p.pacjent_id === testPatientId);
      expect(patientExists).toBe(true);
    });
  });
});
