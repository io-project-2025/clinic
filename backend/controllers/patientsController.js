const db = require("../model/DatabaseService");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

// Pobiera szczegóły konkretnego pacjenta
exports.getPatientDetails = async (req, res) => {
  const { patientId } = req.params;

  try {
    const result = await db.getPatientDetails(patientId);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pacjent nie znaleziony." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Błąd pobierania szczegółów pacjenta:", error);
    res
      .status(500)
      .json({ error: "Błąd serwera podczas pobierania pacjenta." });
  }
};

// Pobiera wszystkich pacjentów
exports.getAllPatients = async (req, res) => {
  try {
    const result = await db.getAllPatients();

    const mapped = result.rows.map((patient) => ({
      ...patient,
      data_urodzenia: patient.data_urodzenia
        ? dayjs
            .utc(patient.data_urodzenia)
            .tz("Europe/Warsaw")
            .format("YYYY-MM-DD")
        : null,
    }));

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Błąd pobierania pacjentów:", error);
    res.status(500).json({
      error: "Błąd serwera podczas pobierania pacjentów.",
    });
  }
};
