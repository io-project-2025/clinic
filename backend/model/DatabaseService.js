// DatabaseService.js
// Centralna klasa do obsługi zapytań do bazy danych

const pool = require("./db");

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
      console.error("Błąd zapytania do bazy danych:", error);
      throw error;
    }
  }

  // ==================== PACJENCI ====================

  /**
   * Pobiera pacjentów przypisanych do danego lekarza, z pełnymi danymi
   * @param {number} doctorId
   * @returns {Promise}
   */
  async getDoctorPatients(doctorId) {
    const query = `
    SELECT DISTINCT 
      p.pacjent_id AS id,
      p.imie AS "firstName",
      p.nazwisko AS "lastName",
      p.pesel,
      p.data_urodzenia AS "birthDate",
      p.telefon AS "phone",
      p.email
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
    const query = "SELECT * FROM pacjenci";
    return this.query(query);
  }

  // ==================== WYNIKI BADAŃ ====================

  /**
   * Pobiera wyniki badań pacjenta
   * @param {number} patientId - ID pacjenta
   * @returns {Promise} - Lista wyników badań
   */
  async getPatientLabResults(patientId) {
    const query = `
      SELECT 
        b.badanie_id AS id,
        b.data AS date,
        b.wyniki->>'badanie' AS type,
        b.wyniki->>'wynik' AS result,
        l.imie || ' ' || l.nazwisko AS doctor,
        b.opis AS description
      FROM badania b
      LEFT JOIN lekarze l ON b.lekarz_id = l.lekarz_id
      WHERE b.pacjent_id = $1
      ORDER BY b.data DESC
    `;
    return this.query(query, [patientId]);
  }

  /**
   * Pobiera szczegóły wyniku badania
   * @param {number} resultId - ID wyniku badania
   * @returns {Promise} - Szczegóły wyniku badania
   */
  async getLabResultDetails(resultId) {
    const query =
      "SELECT badanie_id, wyniki, pacjent_id FROM badania WHERE badanie_id = $1";
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
    return this.query(query, [
      imie,
      nazwisko,
      email,
      haslo,
      oddzial_id || null,
    ]);
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
    return this.query(query, [
      imie,
      nazwisko,
      email,
      haslo,
      oddzial_id || null,
      doctorId,
    ]);
  }

  /**
   * Usuwa lekarza
   * @param {number} doctorId - ID lekarza
   * @returns {Promise} - Wynik operacji
   */
  async deleteDoctor(doctorId) {
    const query = "DELETE FROM lekarze WHERE lekarz_id = $1";
    return this.query(query, [doctorId]);
  }

  // Pobiera lekarza po ID
  async getDoctorById(doctorId) {
    const query = "SELECT * FROM lekarze WHERE lekarz_id = $1";
    return this.query(query, [doctorId]);
  }

  // ==================== ODDZIAŁY ====================

  /**
   * Pobiera listę oddziałów
   * @returns {Promise} - Lista oddziałów
   */
  async getDepartments() {
    const query = "SELECT * FROM oddzialy ORDER BY oddzial_id";
    return this.query(query);
  }

  /**
   * Dodaje nowy oddział
   * @param {Object} departmentData - Dane oddziału
   * @returns {Promise} - Dodany oddział
   */
  async createDepartment(departmentData) {
    const { nazwa, adres } = departmentData;
    const query =
      "INSERT INTO oddzialy (nazwa, adres) VALUES ($1, $2) RETURNING *";
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
    const query =
      "UPDATE oddzialy SET nazwa = $1, adres = $2 WHERE oddzial_id = $3 RETURNING *";
    return this.query(query, [nazwa, adres, departmentId]);
  }

  /**
   * Usuwa oddział
   * @param {number} departmentId - ID oddziału
   * @returns {Promise} - Wynik operacji
   */
  async deleteDepartment(departmentId) {
    const query = "DELETE FROM oddzialy WHERE oddzial_id = $1";
    return this.query(query, [departmentId]);
  }

  // ==================== AUTORYZACJA ====================

  /**
   * Sprawdza czy email jest już zarejestrowany
   * @param {string} email - Email do sprawdzenia
   * @returns {Promise} - Wynik sprawdzenia
   */
  async checkPatientEmailExists(email) {
    const query = "SELECT 1 FROM pacjenci WHERE email = $1";
    return this.query(query, [email]);
  }
  async checkDoctorEmailExists(email) {
    const query = "SELECT 1 FROM lekarze WHERE email = $1";
    return this.query(query, [email]);
  }
  async checkAdminEmailExists(email) {
    const query = "SELECT 1 FROM admini WHERE email = $1";
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
    const query = "SELECT * FROM pacjenci WHERE email = $1";
    return this.query(query, [email]);
  }

  /**
   * Pobiera lekarza na podstawie emaila
   * @param {string} email - Email lekarza
   * @returns {Promise} - Dane lekarza
   */
  async getDoctorByEmail(email) {
    const query = "SELECT * FROM lekarze WHERE email = $1";
    return this.query(query, [email]);
  }

  /**
   * Pobiera administratora na podstawie emaila
   * @param {string} email - Email admina
   * @returns {Promise} - Dane administratora
   */
  async getAdminByEmail(email) {
    const query = "SELECT * FROM admini WHERE email = $1";
    return this.query(query, [email]);
  }

  /**
   * Pobiera pacjenta na postawie ID
   * @param {number} doctorId - ID pacjenta
   * @returns {Promise} - Szczegóły pacjenta
   */
  async getPatientById(id) {
    const query = "SELECT * FROM pacjenci WHERE pacjent_id = $1";
    return this.query(query, [id]);
  }

  /**
   * Pobiera lekarza na podstawie ID
   * @param {number} doctorId - ID lekarza
   * @returns {Promise} - Szczegóły lekarza
   */
  async getDoctorById(id) {
    const query = "SELECT * FROM lekarze WHERE lekarz_id = $1";
    return this.query(query, [id]);
  }

  /**
   * Pobiera administratora na podstawie ID
   * @param {number} id - ID administratora
   * @returns {Promise} - Dane administratora
   */
  async getAdminById(id) {
    const query = "SELECT * FROM admini WHERE admin_id = $1";
    return this.query(query, [id]);
  }

  // ==================== WIZYTY ====================

  /**
   * Pobiera wizytę po ID
   * @param {number} appointmentId - ID wizyty
   * @returns {Promise}
   */
  async getAppointmentById(appointmentId) {
    const query = `
    SELECT * FROM wizyty WHERE wizyta_id = $1
  `;
    return this.query(query, [appointmentId]);
  }

  /**
   * Pobiera listę wizyt danego lekarza na dziś (lub inny dzień)
   * @param {number} doctorId - ID lekarza
   * @param {string} [date] - Data w formacie YYYY-MM-DD (domyślnie dzisiaj)
   * @returns {Promise} - Lista wizyt
   */
  async getTodaysAppointmentsForDoctor(doctorId, date = null) {
    const query = `
    SELECT 
      w.wizyta_id AS id,
      CONCAT(p.imie, ' ', p.nazwisko) AS "patientName",
      w.godzina AS time,
      rw.opis AS reason,
      COALESCE(w.notatki_wizyty->>'diagnoza', '') AS notes
    FROM wizyty w
    JOIN pacjenci p ON w.pacjent_id = p.pacjent_id
    JOIN rodzaje_wizyt rw ON w.rodzaj_wizyty_id = rw.rodzaj_wizyty_id
    WHERE w.lekarz_id = $1
      AND w.data = $2
      AND w.status IN ('zaakceptowana', 'zrealizowana')
    ORDER BY w.godzina;
  `;
    const today = date || new Date().toISOString().split("T")[0];
    return this.query(query, [doctorId, today]);
  }

  /**
   * Aktualizuje status wizyty
   * @param {number} appointmentId - ID wizyty
   * @param {string} status - Nowy status wizyty ('zaplanowana', 'zaakceptowana', 'zrealizowana', 'nieobecność pacjenta', 'odwołana')
   * @returns {Promise} - Zaktualizowana wizyta
   */
  async updateAppointmentStatus(appointmentId, status) {
    const query = `
      UPDATE wizyty
      SET status = $1
      WHERE wizyta_id = $2
      RETURNING *
    `;
    return this.query(query, [status, appointmentId]);
  }

  /**
   * Tworzy nową wizytę
   * @param {Object} appointmentData - Dane wizyty
   * @returns {Promise} - Utworzona wizyta
   */
  async createAppointment(appointmentData) {
    const {
      pacjent_id,
      data,
      godzina,
      lekarz_id,
      rodzaj_wizyty_id,
      tytul,
      objawy,
      diagnoza = "",
    } = appointmentData;

    const dokumenty_wizyty = { recepta: "", skierowanie: "" };

    const notatki_wizyty = { objawy: objawy, diagnoza: diagnoza };
    const query = `
      INSERT INTO wizyty 
        (pacjent_id, data, godzina, lekarz_id, rodzaj_wizyty_id,  tytul, dokumenty_wizyty, notatki_wizyty)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *
    `;

    return this.query(query, [
      pacjent_id,
      data,
      godzina,
      lekarz_id,
      rodzaj_wizyty_id,
      tytul,
      JSON.stringify(dokumenty_wizyty),
      JSON.stringify(notatki_wizyty),
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
   * @returns {Promise} - Wynik operacji aktualizacji
   */
  async updateAppointmentDocuments(appointmentId, documents) {
    const query =
      "UPDATE wizyty SET dokumenty_wizyty = $1 WHERE wizyta_id = $2";
    return this.query(query, [documents, appointmentId]);
  }

  /**
   * Aktualizuje notatki wizyty (objawy, diagnoza).
   * @param {number} appointmentId - ID wizyty
   * @param {{ objawy?: string, diagnoza?: string }} notes - Notatki do zmiany
   * @returns {Promise} - Wynik operacji aktualizacji
   */
  async updateAppointmentNotes(appointmentId, notes) {
    const query = "UPDATE wizyty SET notatki_wizyty = $1 WHERE wizyta_id = $2";
    return this.query(query, [notes, appointmentId]);
  }

  /**
   * Ocenia wizytę pacjenta.
   * @param {number} wizytaId - ID wizyty
   * @param {number} pacjentId - ID pacjenta
   * @param {number} ocena - Ocena wizyty
   * @returns {Promise} - Wynik operacji aktualizacji oceny wizyty
   */
  async rateAppointment(appointmentId, patientId, ocena) {
    const query = `
        UPDATE wizyty 
        SET ocena = $1 
        WHERE wizyta_id = $2 AND pacjent_id = $3
        RETURNING *;
      `;
    return this.query(query, [ocena, appointmentId, patientId]);
  }

  /**
   * Pobiera zaplanowane wizyty lekarza (do przeglądu / akceptacji)
   * @param {number} doctorId
   * @returns {Promise<VisitRequest[]>}
   */
  async getUpcomingVisitRequestsForDoctor(doctorId) {
    const query = `
    SELECT 
      w.wizyta_id AS id,
      CONCAT(p.imie, ' ', p.nazwisko) AS "patientName",
      TO_CHAR(w.data, 'YYYY-MM-DD') || ' ' || w.godzina AS "requestedDate",
      rw.opis AS reason,
      COALESCE(w.notatki_wizyty->>'objawy', '') AS details
    FROM wizyty w
    JOIN pacjenci p ON p.pacjent_id = w.pacjent_id
    JOIN rodzaje_wizyt rw ON rw.rodzaj_wizyty_id = w.rodzaj_wizyty_id
    WHERE w.lekarz_id = $1
      AND w.status = 'zaplanowana'
    ORDER BY w.data, w.godzina;
  `;
    return this.query(query, [doctorId]);
  }

  // ==================== WIADOMOŚCI ====================

  /**
   * Wysyła wiadomość między pacjentem a lekarzem
   * @param {number} pacjentId - ID pacjenta
   * @param {number} lekarzId - ID lekarza
   * @param {'pacjent'|'lekarz'} nadawca - Nadawca wiadomości
   * @param {string} tresc - Treść wiadomości
   * @returns {Promise} - Wynik operacji (wstawiona wiadomość)
   */
  async sendMessage(pacjentId, lekarzId, nadawca, tresc) {
    const query = `
        INSERT INTO wiadomosci (pacjent_id, lekarz_id, nadawca, tresc)
        VALUES ($1, $2, $3::nadawca_typ, $4)
        RETURNING *;
      `;
    return this.query(query, [pacjentId, lekarzId, nadawca, tresc]);
  }

  /**
   * Pobiera wszystkie wiadomości między pacjentem a lekarzem
   * @param {number} pacjentId - ID pacjenta
   * @param {number} lekarzId - ID lekarza
   * @returns {Promise} - Wynik operacji z wiadomościami
   */
  async getMessagesBetween(pacjentId, lekarzId) {
    const query = `
        SELECT * FROM wiadomosci
        WHERE pacjent_id = $1 AND lekarz_id = $2
        ORDER BY data ASC;
      `;
    return this.query(query, [pacjentId, lekarzId]);
  }

  // ==================== DYŻURY LEKARZY ====================
  /**
   * Pobiera dzisiejszy dyżur lekarza
   * @param {number} doctorId - ID lekarza
   * @returns {Promise} - Godzina dyżuru
   */
  async getDoctorTodayShift(doctorId) {
    const query = `
    SELECT z.opis AS shift
    FROM lekarze_dyzury ld
    JOIN dyzury d ON ld.dyzur_id = d.dyzur_id
    JOIN zmiany z ON d.zmiana_id = z.zmiana_id
    WHERE ld.lekarz_id = $1 AND d.data = CURRENT_DATE
    LIMIT 1;
  `;
    return await this.query(query, [doctorId]);
  }

  /**
   * Pobiera dyżur lekarza na konkretny dzień
   * @param {number} doctorId - ID lekarza
   * @param {string} date - Data w formacie YYYY-MM-DD
   * @returns {Promise} - Godzina dyżuru
   */
  async getDoctorShiftByDate(doctorId, date) {
    const query = `
    SELECT z.opis AS shift
    FROM lekarze_dyzury ld
    JOIN dyzury d ON ld.dyzur_id = d.dyzur_id
    JOIN zmiany z ON d.zmiana_id = z.zmiana_id
    WHERE ld.lekarz_id = $1 AND d.data = $2
    LIMIT 1;
  `;
    return await this.query(query, [doctorId, date]);
  }

  /**
   * Pobiera grafik dyżurów lekarza
   * @param {number} doctorId - ID lekarza
   * @returns {Promise} - Lista dyżurów lekarza
   */
  async getDoctorSchedule(doctorId) {
    const query = `
    SELECT d.data AS date, z.opis AS shift
    FROM lekarze_dyzury ld
    JOIN dyzury d ON ld.dyzur_id = d.dyzur_id
    JOIN zmiany z ON d.zmiana_id = z.zmiana_id
    WHERE ld.lekarz_id = $1
    ORDER BY d.data;
  `;
    console.log(await this.query(query, [doctorId]));
    return await this.query(query, [doctorId]);
  }

  // ==================== ADMINISTRATORZY ====================

  /**
   * Pobiera wszystkich użytkowników (pacjentów i lekarzy)
   * @returns {Promise} - Lista użytkowników
   */
  async getAllUsers() {
    const query = `
    SELECT pacjent_id AS id, email, 'user' AS role FROM pacjenci
    UNION
    SELECT lekarz_id AS id, email, 'doctor' AS role FROM lekarze;
  `;
    return this.query(query);
  }

  /**
   * Aktualizuje hasło użytkownika (lekarz lub pacjent)
   * @param {number} id - ID użytkownika
   * @param {'lekarz'|'pacjent'} rola - Rola użytkownika
   * @param {string} noweHaslo - Nowe hasło
   * @returns {Promise} - Zaktualizowany użytkownik
   */
  async updateUserPassword(id, rola, noweHaslo) {
    let query;
    let params;

    if (rola === "doctor") {
      query = `
      UPDATE lekarze
      SET haslo = $1
      WHERE lekarz_id = $2
      RETURNING lekarz_id AS id, email, 'lekarz' AS rola;
    `;
      params = [noweHaslo, id];
    } else if (rola === "user") {
      query = `
      UPDATE pacjenci
      SET haslo = $1
      WHERE pacjent_id = $2
      RETURNING pacjent_id AS id, email, 'pacjent' AS rola;
    `;
      params = [noweHaslo, id];
    } else {
      throw new Error(`Nieobsługiwana rola: ${rola}`);
    }

    const result = await this.query(query, params);

    if (result.rowCount === 0) {
      throw new Error(`Użytkownik o ID ${id} i roli ${rola} nie istnieje`);
    }
    return result.rows;
  }

  /**
   * Wykonuje zapytanie SQL przesłane przez admina
   * @param {string} query - Zapytanie SQL
   * @returns {Promise} - Wynik zapytania
   */
  async runConsoleQuery(query) {
    return this.query(query);
  }

  /**
   * Pobiera liczbę wizyt w danym dniu
   * @returns {Promise} - Wynik zapytania z liczbą wizyt
   */
  async getVisitsCountByDay() {
    const query = `
    SELECT TRIM(TO_CHAR(data, 'Day')) as day, count(wizyta_id) AS visits from wizyty group by day ORDER BY visits DESC;
  `;
    return this.query(query);
  }

  /**
   * Pobiera liczbę wizyt według typu wizyty
   * @returns {Promise} - Wynik zapytania z liczbą wizyt
   */
  async getVisitsCountByVisitType() {
    const query = `
    SELECT 
      rw.opis AS type,
      COUNT(w.wizyta_id) AS count
    FROM wizyty w
    JOIN rodzaje_wizyt rw ON w.rodzaj_wizyty_id = rw.rodzaj_wizyty_id
    GROUP BY rw.opis
    ORDER BY count DESC
    LIMIT 5;
  `;
    return this.query(query);
  }

  /**
   * Pobiera liczbę wizyt według lekarza
   * @returns {Promise} - Wynik zapytania z liczbą wizyt
   * */
  async getVisitsCountByVisitDoctor() {
    const query = `
    SELECT 
      CONCAT(l.imie, ' ', l.nazwisko) AS name,
      COUNT(w.wizyta_id) AS visits
    FROM wizyty w
    JOIN lekarze l ON w.lekarz_id = l.lekarz_id
    GROUP BY l.lekarz_id, l.imie, l.nazwisko
    ORDER BY visits DESC
    LIMIT 5;
  `;
    return this.query(query);
  }
  /**
   * Pobiera liczbę wszystkich wizyt
   * @returns {Promise} - Wynik zapytania z liczbą wizyt
   */
  async getAllVisitsCount() {
    const query = `
    select count(*) from wizyty ;
  `;
    return this.query(query);
  }

  async getDoctorShifts() {
    const query = `
    SELECT 
      l.lekarz_id as doctor_id,
      CONCAT(l.imie, ' ', l.nazwisko) AS name,
      d.data as date,
      z.opis AS shift
    FROM lekarze_dyzury ld
    JOIN lekarze l ON ld.lekarz_id = l.lekarz_id
    JOIN dyzury d ON ld.dyzur_id = d.dyzur_id
    JOIN zmiany z ON d.zmiana_id = z.zmiana_id
    ORDER BY d.data;
  `;
    return this.query(query);
  }

  /**
   * Przypisuje lekarzowi dyżur na dany dzień i zmianę
   * Tworzy wpis w `dyzury` i `lekarze_dyzury` w jednej transakcji
   * @param {number} doctorId
   * @param {string} date - YYYY-MM-DD
   * @param {string} shift - opis zmiany ("Ranna", "Dzienna", ...)
   * @returns {Promise}
   */
  async assignDoctorShift(doctorId, date, shift) {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Pobierz ID zmiany
      const shiftRes = await client.query(
        "SELECT zmiana_id FROM zmiany WHERE opis = $1",
        [shift]
      );
      if (shiftRes.rowCount === 0) {
        throw new Error("Nie znaleziono zmiany o podanym opisie.");
      }
      const zmianaId = shiftRes.rows[0].zmiana_id;

      // 2. Wstaw nowy dyżur lub sprawdź, czy istnieje
      const dyzurRes = await client.query(
        "INSERT INTO dyzury (data, zmiana_id) VALUES ($1, $2) ON CONFLICT (data, zmiana_id) DO UPDATE SET zmiana_id = EXCLUDED.zmiana_id RETURNING dyzur_id;",
        [date, zmianaId]
      );
      const dyzurId = dyzurRes.rows[0].dyzur_id;

      // 3. Wstaw do lekarze_dyzury
      await client.query(
        "INSERT INTO lekarze_dyzury (lekarz_id, dyzur_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;",
        [doctorId, dyzurId]
      );

      await client.query("COMMIT");
      return { success: true };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Błąd przypisywania dyżuru:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Usuwa przypisanie lekarza do dyżuru na dany dzień i zmianę
   * Jeśli żaden lekarz nie jest przypisany do dyżuru, usuwa cały dyżur
   * @param {number} doctorId - ID lekarza
   * @param {string} date - Data dyżuru w formacie YYYY-MM-DD
   * @param {string} shift - Opis zmiany (np. "Ranna", "Dzienna")
   * @returns {Promise}
   */
  async unassignDoctorShift(doctorId, date, shift) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");

      // Pobierz ID zmiany
      const zmianaResult = await client.query(
        "SELECT zmiana_id FROM zmiany WHERE opis = $1",
        [shift]
      );
      if (zmianaResult.rowCount === 0) {
        throw new Error("Nie znaleziono zmiany o podanym opisie");
      }
      const zmianaId = zmianaResult.rows[0].zmiana_id;

      // Pobierz dyżur o danej dacie i zmianie
      const dyzurResult = await client.query(
        "SELECT dyzur_id FROM dyzury WHERE data = $1 AND zmiana_id = $2",
        [date, zmianaId]
      );
      if (dyzurResult.rowCount === 0) {
        // Dyżur nie istnieje — nic do usunięcia
        await client.query("ROLLBACK");
        return;
      }

      const dyzurId = dyzurResult.rows[0].dyzur_id;

      // Usuń przypisanie lekarza
      await client.query(
        "DELETE FROM lekarze_dyzury WHERE dyzur_id = $1 AND lekarz_id = $2",
        [dyzurId, doctorId]
      );

      // Jeśli żaden lekarz nie został przypisany — usuń cały dyżur
      const check = await client.query(
        "SELECT COUNT(*) FROM lekarze_dyzury WHERE dyzur_id = $1",
        [dyzurId]
      );
      if (parseInt(check.rows[0].count) === 0) {
        await client.query("DELETE FROM dyzury WHERE dyzur_id = $1", [dyzurId]);
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Błąd unassignDoctorShift:", error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new DatabaseService();
