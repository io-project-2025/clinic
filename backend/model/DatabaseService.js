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

  // Pobiera wszystkich pacjentów
  async getAllPatients() {
    const query = 'SELECT * FROM pacjenci';
    return this.query(query);
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

  // Pobiera lekarza po ID
  async getDoctorById(doctorId) {
    const query = 'SELECT * FROM lekarze WHERE lekarz_id = $1';
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
  async checkPatientEmailExists(email) {
    const query = 'SELECT 1 FROM pacjenci WHERE email = $1';
    return this.query(query, [email]);
  }
  async checkDoctorEmailExists(email) {
    const query = 'SELECT 1 FROM lekarze WHERE email = $1';
    return this.query(query, [email]);
  }
  async checkAdminEmailExists(email) {
    const query = 'SELECT 1 FROM admini WHERE email = $1';
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

  /**
   * Pobiera administratora na podstawie emaila
   * @param {string} email - Email admina
   * @returns {Promise} - Dane administratora
   */getAdminByEmail
   async getAdminByEmail(email) {
    const query = 'SELECT * FROM admini WHERE email = $1';
    return this.query(query, [email]);
  }

  /**
   * Pobiera pacjenta na postawie ID
   * @param {number} doctorId - ID pacjenta
   * @returns {Promise} - Szczegóły pacjenta
   */
  async getPatientById(id) {
    const query = 'SELECT * FROM pacjenci WHERE pacjent_id = $1';
    return this.query(query, [id]);
  }

  /**
   * Pobiera lekarza na podstawie ID
   * @param {number} doctorId - ID lekarza
   * @returns {Promise} - Szczegóły lekarza
   */
  async getDoctorById(id) {
    const query = 'SELECT * FROM lekarze WHERE lekarz_id = $1';
    return this.query(query, [id]);
  }

  /**
   * Pobiera administratora na podstawie ID
   * @param {number} id - ID administratora
   * @returns {Promise} - Dane administratora
   */
  async getAdminById(id) {
    const query = 'SELECT * FROM admini WHERE admin_id = $1';
    return this.query(query, [id]);
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
    
    const dokumenty_wizyty = { recepta: "", skierowanie: "" };
    const notatki_wizyty = { objawy: "", diagnoza: "" };
    
    const query = `
      INSERT INTO wizyty 
        (pacjent_id, data, godzina, lekarz_id, rodzaj_wizyty_id, dokumenty_wizyty, notatki_wizyty)
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `;
    
    return this.query(query, [
      pacjent_id,
      data,
      godzina,
      lekarz_id,
      rodzaj_wizyty_id,
      JSON.stringify(dokumenty_wizyty),
      JSON.stringify(notatki_wizyty)
    ]);
  }

  /**
   * Pobiera wizyty pacjenta
   * @param {number} patientId - ID pacjenta
   * @returns {Promise} - Lista wizyt pacjenta
   */
    async getAppointmentsByPatient(patientId) {
      const query = `
      SELECT w.wizyta_id, w.pacjent_id, w.lekarz_id, w.data, w.godzina, w.ocena,
      r.opis AS rodzaj_wizyty_opis
      FROM wizyty w
      LEFT JOIN rodzaje_wizyt r ON w.rodzaj_wizyty_id = r.rodzaj_wizyty_id
      WHERE w.pacjent_id = $1
      ORDER BY w.data DESC, w.godzina DESC;
      `;
      return this.query(query, [patientId]);
    }

    /**
     * Aktualizuje dokumenty wizyty (recepta, skierowanie).
     * @param {number} appointmentId - ID wizyty
     * @param {{ recepta?: string, skierowanie?: string }} documents - Dokumenty do zmiany
     * @returns {Promise}
     */
    async updateAppointmentDocuments(appointmentId, documents) {
      const query = 'UPDATE wizyty SET dokumenty_wizyty = $1 WHERE wizyta_id = $2';
      return this.query(query, [documents, appointmentId]);
    }

    /**
     * Aktualizuje notatki wizyty (objawy, diagnoza).
     * @param {number} appointmentId - ID wizyty
     * @param {{ objawy?: string, diagnoza?: string }} notes - Notatki do zmiany
     * @returns {Promise}
     */ 
    async updateAppointmentNotes(appointmentId, notes) {
      const query = 'UPDATE wizyty SET notatki_wizyty = $1 WHERE wizyta_id = $2';
      return this.query(query, [notes, appointmentId]);
    }

}

module.exports = new DatabaseService();
