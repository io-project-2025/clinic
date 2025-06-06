// DatabaseService.js
// Centralna klasa do obsługi zapytań do bazy danych

const pool = require('./db');

class DatabaseService {
  constructor() {
    this.pool = pool;
  }

  /**
   * Wykonuje zapytanie do bazy danych
   * @param {string} query - Zapytanie SQL
   * @param {Array} params - Parametry zapytania
   * @returns {Promise} - Wynik zapytania
   */
  async query(query, params = []) {
    try {
      return await this.pool.query(query, params);
    } catch (error) {
      console.error('Błąd zapytania do bazy danych:', error);
      throw error;
    }
  }

  // ==================== PACJENCI ====================

  /**
   * Pobiera pacjentów danego lekarza
   * @param {number} doctorId - ID lekarza
   * @returns {Promise} - Lista pacjentów
   */
  async getDoctorPatients(doctorId) {
    const query = `
      SELECT DISTINCT p.pacjent_id, p.imie, p.nazwisko
      FROM pacjenci p
      JOIN wizyty w ON p.pacjent_id = w.pacjent_id
      WHERE w.lekarz_id = $1
    `;
    return this.query(query, [doctorId]);
  }

  /**
   * Pobiera szczegóły pacjenta
   * @param {number} patientId - ID pacjenta
   * @returns {Promise} - Szczegóły pacjenta
   */
  async getPatientDetails(patientId) {
    const query = `
      SELECT pacjent_id, imie, nazwisko, email
      FROM pacjenci
      WHERE pacjent_id = $1
    `;
    return this.query(query, [patientId]);
  }

  // ==================== WYNIKI BADAŃ ====================

  /**
   * Pobiera wyniki badań pacjenta
   * @param {number} patientId - ID pacjenta
   * @returns {Promise} - Lista wyników badań
   */
  async getPatientLabResults(patientId) {
    const query = 'SELECT badanie_id, wyniki FROM badania WHERE pacjent_id = $1';
    return this.query(query, [patientId]);
  }

  /**
   * Pobiera szczegóły wyniku badania
   * @param {number} resultId - ID wyniku badania
   * @returns {Promise} - Szczegóły wyniku badania
   */
  async getLabResultDetails(resultId) {
    const query = 'SELECT badanie_id, wyniki, pacjent_id FROM badania WHERE badanie_id = $1';
    return this.query(query, [resultId]);
  }

  // ==================== DOKUMENTY ====================

  /**
   * Pobiera dokumenty pacjenta
   * @param {number} patientId - ID pacjenta
   * @returns {Promise} - Lista dokumentów
   */
  async getPatientDocuments(patientId) {
    const query = `
      SELECT wizyta_id, data, godzina, dokumenty_wizyty
      FROM wizyty
      WHERE pacjent_id = $1 AND dokumenty_wizyty IS NOT NULL
    `;
    return this.query(query, [patientId]);
  }

  /**
   * Pobiera notatki pacjenta
   * @param {number} patientId - ID pacjenta
   * @returns {Promise} - Lista notatek
   */
  async getPatientNotes(patientId) {
    const query = `
      SELECT wizyta_id, data, godzina, notatki_wizyty
      FROM wizyty
      WHERE pacjent_id = $1 AND notatki_wizyty IS NOT NULL
    `;
    return this.query(query, [patientId]);
  }

  // ==================== LEKARZE ====================

  /**
   * Pobiera listę lekarzy
   * @returns {Promise} - Lista lekarzy
   */
  async getDoctors() {
    const query = `
      SELECT lekarz_id, imie, nazwisko, email, oddzial_id
      FROM lekarze
      ORDER BY nazwisko, imie
    `;
    return this.query(query);
  }

  /**
   * Dodaje nowego lekarza
   * @param {Object} doctorData - Dane lekarza
   * @returns {Promise} - Dodany lekarz
   */
  async createDoctor(doctorData) {
    const { imie, nazwisko, email, haslo, oddzial_id } = doctorData;
    const query = `
      INSERT INTO lekarze (imie, nazwisko, email, haslo, oddzial_id) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    return this.query(query, [imie, nazwisko, email, haslo, oddzial_id || null]);
  }

  /**
   * Aktualizuje dane lekarza
   * @param {number} doctorId - ID lekarza
   * @param {Object} doctorData - Dane lekarza
   * @returns {Promise} - Zaktualizowany lekarz
   */
  async updateDoctor(doctorId, doctorData) {
    const { imie, nazwisko, email, haslo, oddzial_id } = doctorData;
    const query = `
      UPDATE lekarze SET imie=$1, nazwisko=$2, email=$3, haslo=$4, oddzial_id=$5
      WHERE lekarz_id=$6 RETURNING *
    `;
    return this.query(query, [imie, nazwisko, email, haslo, oddzial_id || null, doctorId]);
  }

  /**
   * Usuwa lekarza
   * @param {number} doctorId - ID lekarza
   * @returns {Promise} - Wynik operacji
   */
  async deleteDoctor(doctorId) {
    const query = 'DELETE FROM lekarze WHERE lekarz_id = $1';
    return this.query(query, [doctorId]);
  }

  // ==================== ODDZIAŁY ====================

  /**
   * Pobiera listę oddziałów
   * @returns {Promise} - Lista oddziałów
   */
  async getDepartments() {
    const query = 'SELECT * FROM oddzialy ORDER BY oddzial_id';
    return this.query(query);
  }

  /**
   * Dodaje nowy oddział
   * @param {Object} departmentData - Dane oddziału
   * @returns {Promise} - Dodany oddział
   */
  async createDepartment(departmentData) {
    const { nazwa, adres } = departmentData;
    const query = 'INSERT INTO oddzialy (nazwa, adres) VALUES ($1, $2) RETURNING *';
    return this.query(query, [nazwa, adres]);
  }

  /**
   * Aktualizuje dane oddziału
   * @param {number} departmentId - ID oddziału
   * @param {Object} departmentData - Dane oddziału
   * @returns {Promise} - Zaktualizowany oddział
   */
  async updateDepartment(departmentId, departmentData) {
    const { nazwa, adres } = departmentData;
    const query = 'UPDATE oddzialy SET nazwa = $1, adres = $2 WHERE oddzial_id = $3 RETURNING *';
    return this.query(query, [nazwa, adres, departmentId]);
  }

  /**
   * Usuwa oddział
   * @param {number} departmentId - ID oddziału
   * @returns {Promise} - Wynik operacji
   */
  async deleteDepartment(departmentId) {
    const query = 'DELETE FROM oddzialy WHERE oddzial_id = $1';
    return this.query(query, [departmentId]);
  }

  // ==================== AUTORYZACJA ====================

  /**
   * Sprawdza czy email jest już zarejestrowany
   * @param {string} email - Email do sprawdzenia
   * @returns {Promise} - Wynik sprawdzenia
   */
  async checkEmailExists(email) {
    const query = 'SELECT * FROM pacjenci WHERE email = $1';
    return this.query(query, [email]);
  }

  /**
   * Rejestruje nowego pacjenta
   * @param {Object} patientData - Dane pacjenta
   * @returns {Promise} - Zarejestrowany pacjent
   */
  async registerPatient(patientData) {
    const { imie, nazwisko, email, haslo } = patientData;
    const query = `
      INSERT INTO pacjenci (imie, nazwisko, email, haslo) 
      VALUES ($1, $2, $3, $4) RETURNING pacjent_id, imie, nazwisko, email
    `;
    return this.query(query, [imie, nazwisko, email, haslo]);
  }

  /**
   * Pobiera pacjenta na podstawie emaila
   * @param {string} email - Email pacjenta
   * @returns {Promise} - Dane pacjenta
   */
  async getPatientByEmail(email) {
    const query = 'SELECT * FROM pacjenci WHERE email = $1';
    return this.query(query, [email]);
  }

  /**
   * Pobiera lekarza na podstawie emaila
   * @param {string} email - Email lekarza
   * @returns {Promise} - Dane lekarza
   */
  async getDoctorByEmail(email) {
    const query = 'SELECT * FROM lekarze WHERE email = $1';
    return this.query(query, [email]);
  }

  // ==================== WIZYTY ====================

  /**
   * Usuwa wizytę
   * @param {number} appointmentId - ID wizyty
   * @returns {Promise} - Wynik operacji
   */
  async deleteAppointment(appointmentId) {
    const query = 'DELETE FROM wizyty WHERE wizyta_id = $1';
    return this.query(query, [appointmentId]);
  }

  /**
   * Aktualizuje wizytę
   * @param {number} appointmentId - ID wizyty
   * @param {Object} appointmentData - Dane wizyty
   * @returns {Promise} - Zaktualizowana wizyta
   */
  async updateAppointment(appointmentId, appointmentData) {
    const { data, godzina, lekarz_id, rodzaj_wizyty_id } = appointmentData;
    const query = `
      UPDATE wizyty
      SET data = $1, godzina = $2, lekarz_id = $3, rodzaj_wizyty_id = $4
      WHERE wizyta_id = $5 RETURNING *
    `;
    return this.query(query, [data, godzina, lekarz_id, rodzaj_wizyty_id, appointmentId]);
  }

  /**
   * Tworzy nową wizytę
   * @param {Object} appointmentData - Dane wizyty
   * @returns {Promise} - Utworzona wizyta
   */
  async createAppointment(appointmentData) {
    const { pacjent_id, data, godzina, lekarz_id, rodzaj_wizyty_id } = appointmentData;
    const query = `
      INSERT INTO wizyty (pacjent_id, data, godzina, lekarz_id, rodzaj_wizyty_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    return this.query(query, [pacjent_id, data, godzina, lekarz_id, rodzaj_wizyty_id]);
  }
}

module.exports = new DatabaseService();
