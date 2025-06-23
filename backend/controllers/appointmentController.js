const db = require("../model/DatabaseService");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

// Pobiera dzisiejsze wizyty lekarza
exports.getDoctorTodaysAppointments = async (req, res) => {
  const doctorId = parseInt(req.params.doctorId);

  try {
    const result = await db.getTodaysAppointmentsForDoctor(doctorId);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Błąd przy pobieraniu dzisiejszych wizyt:", err);
    res.status(500).json({ error: "Błąd serwera przy pobieraniu wizyt" });
  }
};

// Odwołanie wizyty
exports.cancelAppointment = async (req, res) => {
  const id = req.params.appointmentId;

  try {
    const appointmentResult = await db.getAppointmentById(id);
    if (appointmentResult.rows.length === 0) {
      return res.status(404).json({ error: "Wizyta nie znaleziona" });
    }

    const result = await db.updateAppointmentStatus(id, "odwolana");
    res.json({
      message: `Wizyta ${id} anulowana`,
      appointment: result.rows[0],
    });
  } catch (err) {
    console.error("Błąd przy anulowaniu wizyty:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
};

// Ustaw status na 'zrealizowana'
exports.markAppointmentDone = async (req, res) => {
  const id = req.params.appointmentId;

  try {
    const appointmentResult = await db.getAppointmentById(id);
    if (appointmentResult.rows.length === 0) {
      return res.status(404).json({ error: "Wizyta nie znaleziona" });
    }

    const result = await db.updateAppointmentStatus(id, "zrealizowana");
    res.json({
      message: `Wizyta ${id} oznaczona jako zrealizowana`,
      appointment: result.rows[0],
    });
  } catch (err) {
    console.error("Błąd przy aktualizacji statusu wizyty:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
};

// Ustaw status na 'zrealizowana'
exports.markAppointmentAccepted = async (req, res) => {
  const id = req.params.appointmentId;

  try {
    const appointmentResult = await db.getAppointmentById(id);
    if (appointmentResult.rows.length === 0) {
      return res.status(404).json({ error: "Wizyta nie znaleziona" });
    }

    const result = await db.updateAppointmentStatus(id, "zaakceptowana");
    res.json({
      message: `Wizyta ${id} oznaczona jako zaakceptowana`,
      appointment: result.rows[0],
    });
  } catch (err) {
    console.error("Błąd przy aktualizacji statusu wizyty:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
};

// Ustaw status na 'nieobecność pacjenta'
exports.markNoShow = async (req, res) => {
  const id = req.params.id;

  try {
    const appointmentResult = await db.getAppointmentById(id);
    if (appointmentResult.rows.length === 0) {
      return res.status(404).json({ error: "Wizyta nie znaleziona" });
    }

    const result = await db.updateAppointmentStatus(id, "nieobecność pacjenta");
    res.json({
      message: `Wizyta ${id} oznaczona jako nieobecność pacjenta`,
      appointment: result.rows[0],
    });
  } catch (err) {
    console.error("Błąd przy aktualizacji statusu wizyty:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
};

// Utworzenie wizyty
exports.createAppointment = async (req, res) => {
  const {
    pacjent_id,
    data,
    godzina,
    lekarz_id,
    rodzaj_wizyty_id = 3, // domyślny rodzaj wizyty
    tytul,
    objawy,
    diagnoza = "",
  } = req.body;

  try {
    const result = await db.createAppointment({
      pacjent_id,
      data,
      godzina,
      lekarz_id,
      rodzaj_wizyty_id,
      tytul,
      objawy,
      diagnoza,
    });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Błąd przy tworzeniu wizyty:", err);
    res.status(500).json({ error: "Błąd serwera przy tworzeniu wizyty" });
  }
};

// Pobranie wizyt pacjenta
exports.getPatientAppointments = async (req, res) => {
  const patientId = parseInt(req.params.patientId);

  try {
    const result = await db.getAppointmentsByPatient(patientId);

    const mapped = result.rows.map((row) => ({
      ...row,
      data: dayjs.utc(row.data).tz("Europe/Warsaw").format("YYYY-MM-DD"),
    }));

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Błąd podczas pobierania wizyt pacjenta:", error);
    res.status(500).json({ error: "Błąd serwera podczas pobierania wizyt." });
  }
};

// aktualizacja dokumentów wizyty
exports.updateDocuments = async (req, res) => {
  const { id } = req.params;
  const { recepta = "", skierowanie = "" } = req.body;

  try {
    await db.updateAppointmentDocuments(id, { recepta, skierowanie });
    res.status(200).json({ recepta, skierowanie });
  } catch (err) {
    console.error("Błąd przy aktualizacji dokumentów wizyty:", err);
    res
      .status(500)
      .json({ error: "Błąd serwera przy aktualizacji dokumentów" });
  }
};

// aktualizacja notatek wizyty
exports.updateNotes = async (req, res) => {
  const { appointmentId } = req.params;
  const { objawy = "", diagnoza = "" } = req.body;
  try {
    await db.updateAppointmentNotes(appointmentId, { objawy, diagnoza });
    res.status(200).json({ objawy, diagnoza });
  } catch (err) {
    console.error("Błąd przy aktualizacji notatek wizyty:", err);
    res.status(500).json({ error: "Błąd serwera przy aktualizacji notatek" });
  }
};

// Ocena wizyty
exports.rateAppointment = async (req, res) => {
  const patientId = req.user.id;
  const appointmentId = parseInt(req.params.appointmentId, 10);
  const { ocena } = req.body;

  try {
    const result = await db.rateAppointment(appointmentId, patientId, ocena);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Nie znaleziono wizyty do oceny" });
    }

    res.json({ message: "Ocena zapisana", data: result.rows[0] });
  } catch (err) {
    console.error("Błąd zapisu oceny:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
};

//  Pobranie zgłoszeń wizyt dla lekarza
exports.getVisitRequests = async (req, res) => {
  const doctorId = parseInt(req.params.doctorId);

  try {
    const result = await db.getUpcomingVisitRequestsForDoctor(doctorId);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Błąd przy pobieraniu zgłoszeń wizyt:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
};

// Pobranie wizyt lekarza z danego dnia
exports.getAppointmentsCountByDate = async (req, res) => {
  const { doctorId, date } = req.params;

  try {
    const result = await db.getTodaysAppointmentsForDoctor(doctorId, date);
    res.status(200).json({ count: result.rows.length });
  } catch (error) {
    console.error("Błąd pobierania liczby wizyt lekarza:", error);
    res
      .status(500)
      .json({ error: "Błąd serwera podczas pobierania liczby wizyt." });
  }
};

// Pobranie notatek wizyty
exports.getAppointmentNote = async (req, res) => {
  try {
    const { visitId } = req.params;
    const result = await db.getAppointmentNote(visitId);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Wizyta nie została znaleziona" });
    }

    const note = result.rows[0].notatki_wizyty || {};
    res.status(200).json(note);
  } catch (error) {
    console.error("Błąd podczas pobierania notatek wizyty:", error);
    res.status(500).json({ error: "Błąd serwera podczas pobierania notatek" });
  }
};
