const db = require("../model/DatabaseService");

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
  const id = req.params.id;

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
  const id = req.params.id;

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
  const { pacjent_id, data, godzina, lekarz_id, rodzaj_wizyty_id, tytul, objawy, diagnoza = ""} = req.body;

  try {
    const result = await db.createAppointment({ pacjent_id, data, godzina, lekarz_id, rodzaj_wizyty_id, tytul, objawy, diagnoza});
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
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Błąd przy pobieraniu wizyt:", err);
    res.status(500).json({ error: "Błąd serwera przy pobieraniu wizyt" });
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

exports.rateAppointment = async (req, res) => {
  const patientId = req.user.id;
  const appointmentId = parseInt(req.params.appointmentId, 10);
  const { ocena } = req.body;

  try {
    const result = await db.rateAppointment(appointmentId, patientId, ocena);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Nie znaleziono wizyty do oceny' });
    }

    res.json({ message: 'Ocena zapisana', data: result.rows[0] });
  } catch (err) {
    console.error("Błąd zapisu oceny:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
};
