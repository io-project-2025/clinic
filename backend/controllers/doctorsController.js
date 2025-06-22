const db = require("../model/DatabaseService");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

// Pobieranie listy lekarzy
exports.getDoctors = async (req, res) => {
  try {
    const result = await db.getDoctors();
    res.json(result.rows);
  } catch (err) {
    console.error("Błąd pobierania lekarzy:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
};

// Edytowanie lekarza
exports.updateDoctor = async (req, res) => {
  const { doctorId } = req.params;
  const { imie, nazwisko, email, haslo, oddzial_id } = req.body;
  if (!imie || !nazwisko) {
    return res.status(400).json({ error: "Imię i nazwisko są wymagane" });
  }
  try {
    const result = await db.updateDoctor(doctorId, {
      imie,
      nazwisko,
      email,
      haslo,
      oddzial_id,
    });
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Lekarz nie znaleziony" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Błąd aktualizacji lekarza:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
};

// Dodawanie nowego lekarza
exports.createDoctor = async (req, res) => {
  const { imie, nazwisko, email, haslo, oddzial_id } = req.body;
  if (!imie || !nazwisko) {
    return res.status(400).json({ error: "Imię i nazwisko są wymagane" });
  }
  try {
    const result = await db.createDoctor({
      imie,
      nazwisko,
      email,
      haslo,
      oddzial_id,
    });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Błąd dodawania lekarza:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
};

// Usuwanie lekarza
exports.deleteDoctor = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const result = await db.deleteDoctor(doctorId);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Lekarz nie znaleziony" });
    }
    res.json({ message: `Lekarz ${doctorId} usunięty` });
  } catch (err) {
    console.error("Błąd usuwania lekarza:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
};

// Pobiera szczegóły konkretnego lekarza
exports.getDoctorDetails = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const result = await db.getDoctorById(doctorId);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Lekarz nie znaleziony." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Błąd pobierania szczegółów lekarza:", error);
    res.status(500).json({ error: "Błąd serwera podczas pobierania lekarza." });
  }
};

// Pobiera wszystkich pacjentów danego lekarza
exports.getDoctorPatients = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const result = await db.getDoctorPatients(doctorId);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Błąd pobierania pacjentów lekarza:", error);
    res
      .status(500)
      .json({ error: "Błąd serwera podczas pobierania pacjentów." });
  }
};

// Pobiera dzisiejszy dyżur lekarza
exports.getDoctorTodayShift = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const result = await db.getDoctorTodayShift(doctorId);

    if (result.rows.length === 0) {
      return res.status(200).json({ grafik: "Brak dyżuru" });
    }
    const shiftName = result.rows[0].shift;
    const shiftMap = {
      Ranna: "06:00-14:00",
      Dzienna: "14:00-22:00",
    };

    const grafik = shiftMap[shiftName] || "Nieznana zmiana";

    res.status(200).json({ grafik });
  } catch (error) {
    console.error("Błąd pobierania dzisiejszego dyżuru lekarza:", error);
    res.status(500).json({ error: "Błąd serwera podczas pobierania dyżuru." });
  }
};

// Pobiera grafik lekarza
exports.getDoctorSchedule = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const result = await db.getDoctorSchedule(doctorId);
    console.log(result.rows);
    const mapped = result.rows.map(({ date, shift }) => ({
      date: dayjs.utc(date).tz("Europe/Warsaw").format("YYYY-MM-DD"), // Pobiera tylko datę bez czasu
      type:
        shift === "Ranna"
          ? "06:00-14:00"
          : shift === "Dzienna"
          ? "14:00-22:00"
          : "Nieznana",
    }));
    console.log(mapped);
    res.status(200).json(mapped);
  } catch (error) {
    console.error("Błąd pobierania wszystkich dyżurów lekarza:", error);
    res.status(500).json({ error: "Błąd serwera podczas pobierania dyżurów" });
  }
};

// Pobiera dyżur lekarza w danym dniu

exports.getDoctorShiftByDate = async (req, res) => {
  const { doctorId, date } = req.params;

  try {
    const result = await db.getDoctorShiftByDate(doctorId, date);
    if (result.rows.length === 0) {
      return res.status(200).json({ type: null }); // brak dyżuru
    }

    const shift = result.rows[0].shift;
    const type =
      shift === "Ranna"
        ? "06:00-14:00"
        : shift === "Dzienna"
        ? "14:00-22:00"
        : "Nieznana";

    res.status(200).json({ type });
  } catch (error) {
    console.error("Błąd pobierania dyżuru lekarza:", error);
    res.status(500).json({ error: "Błąd serwera podczas pobierania dyżuru." });
  }
};
