const request = require('supertest');
const app = require('../app');
const db = require('../model/DatabaseService');

describe('Auth API Integration Tests', () => {
  // Use unique email addresses for test users
  const timestamp = Date.now();
  const testPatient = {
    imie: 'TestPatient',
    nazwisko: 'User',
    email: `testpatient${timestamp}@example.com`,
    haslo: 'testpass123'
  };
  
  const testDoctor = {
    imie: 'TestDoctor',
    nazwisko: 'User',
    email: `testdoctor${timestamp}@example.com`,
    haslo: 'testpass123',
    oddzial_id: null // Optional for testing
  };
  
  // Track IDs for cleanup
  let testPatientId;
  let testDoctorId;
  
  // Clean up test data after tests
  afterAll(async () => {
    try {
      // Delete test patient if created
      if (testPatientId) {
        await pool.query('DELETE FROM pacjenci WHERE pacjent_id = $1', [testPatientId]);
        console.log(`Test patient ${testPatientId} removed`);
      }
      
      // Delete test doctor if created
      if (testDoctorId) {
        await pool.query('DELETE FROM lekarze WHERE lekarz_id = $1', [testDoctorId]);
        console.log(`Test doctor ${testDoctorId} removed`);
      }
      // Close the pool connection
      await pool.end();

      console.log('Test cleanup complete');
      
    } catch (error) {
      console.error('Test cleanup failed:', error);
    }
  });

  // Test patient registration
  describe('POST /api/auth/register', () => {
    it('should register a new patient with valid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testPatient);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Pacjent zarejestrowany');
      expect(res.body).toHaveProperty('patient');
      expect(res.body.patient).toHaveProperty('pacjent_id');
      expect(res.body.patient).toHaveProperty('email', testPatient.email);
      
      // Save ID for cleanup and later tests
      testPatientId = res.body.patient.pacjent_id;
    });
    
    it('should reject registration with missing fields', async () => {
      const incompleteData = {
        imie: 'Incomplete',
        // missing other required fields
      };
      
      const res = await request(app)
        .post('/api/auth/register')
        .send(incompleteData);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Wszystkie pola są wymagane');
    });
    
    it('should reject registration with duplicate email', async () => {
      // Try to register with the same email again
      const res = await request(app)
        .post('/api/auth/register')
        .send(testPatient);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Email już jest zarejestrowany');
    });
    
    describe('validation tests', () => {
      it('should reject registration with weak password', async () => {
        const weakPasswordUser = {
          ...testPatient,
          haslo: '123' // Too short
        };
        
        const res = await request(app)
          .post('/api/auth/register')
          .send(weakPasswordUser);
        
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
      });

      describe('email validation tests', () => {
        const invalidEmails = [
          { email: 'notanemail', desc: 'missing @ symbol' },
          { email: 'missing.domain@', desc: 'missing domain' },
          { email: '@missing.prefix', desc: 'missing prefix' },
          { email: 'spaces in@email.com', desc: 'containing spaces' },
          { email: 'double@@email.com', desc: 'double @ symbol' },
          { email: 'invalid@domain', desc: 'incomplete domain' }
        ];

        invalidEmails.forEach(({ email, desc }) => {
          it(`should reject registration with invalid email (${desc})`, async () => {
            const invalidEmailUser = {
              ...testPatient,
              email: email
            };
            
            const res = await request(app)
              .post('/api/auth/register')
              .send(invalidEmailUser);
            
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error', 'Nieprawidłowy format email');
          });
        });

        const validEmails = [
          'simple@example.com',
          'with.dots@domain.com',
          'with-hyphen@domain.com',
          'with_underscore@domain.com',
          'numbered123@domain.com',
          'with.subdomain@sub.domain.com'
        ];

        validEmails.forEach(email => {
          it(`should accept registration with valid email format: ${email}`, async () => {
            const validEmailUser = {
              ...testPatient,
              email: `test.${Date.now()}.${email}` // Make unique
            };
            
            const res = await request(app)
              .post('/api/auth/register')
              .send(validEmailUser);
            
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'Pacjent zarejestrowany');
          });
        });
      });
    });
  });

  // Test login functionality
  describe('POST /api/auth/login', () => {
    // Create a test doctor for login tests
    beforeAll(async () => {
      try {
        // Create test doctor
        const result = await pool.query(
          'INSERT INTO lekarze (imie, nazwisko, email, haslo) VALUES ($1, $2, $3, $4) RETURNING lekarz_id',
          [testDoctor.imie, testDoctor.nazwisko, testDoctor.email, testDoctor.haslo]
        );
        testDoctorId = result.rows[0].lekarz_id;
        console.log(`Test doctor created with ID ${testDoctorId}`);
      } catch (error) {
        console.error('Failed to create test doctor:', error);
      }
    });
    
    it('should login successfully as patient', async () => {
      // Skip if patient registration failed
      if (!testPatientId) {
        console.log('Skipping test - no test patient created');
        return;
      }
      
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testPatient.email,
          haslo: testPatient.haslo
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('role', 'pacjent');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id', testPatientId);
      expect(res.body.user).toHaveProperty('email', testPatient.email);
    });
    
    it('should login successfully as doctor', async () => {
      // Skip if doctor creation failed
      if (!testDoctorId) {
        console.log('Skipping test - no test doctor created');
        return;
      }
      
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testDoctor.email,
          haslo: testDoctor.haslo
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('role', 'lekarz');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id', testDoctorId);
      expect(res.body.user).toHaveProperty('email', testDoctor.email);
    });
    
    it('should reject login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testPatient.email,
          haslo: 'wrongpassword'
        });
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Nieprawidłowy email lub hasło');
    });
    
    it('should reject login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: `nonexistent${timestamp}@example.com`,
          haslo: 'anypassword'
        });
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Nieprawidłowy email lub hasło');
    });
    
    it('should reject login with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testPatient.email
          // Missing password
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Email i hasło są wymagane');
    });
    
    describe('email validation tests', () => {
      it('should reject login with invalid email format', async () => {
        const invalidLoginAttempt = {
          email: 'notanemail',
          haslo: 'anypassword'
        };
        
        const res = await request(app)
          .post('/api/auth/login')
          .send(invalidLoginAttempt);
        
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Nieprawidłowy format email');
      });
    });
  });
});