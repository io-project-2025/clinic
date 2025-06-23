const db = require("../model/DatabaseService");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

// Pobiera wszystkich użytkowników z bazy danych
exports.getUsers = async (req, res) => {
  try {
    const result = await db.getAllUsers();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Błąd podczas pobierania użytkowników" });
  }
};

// Aktualizuje hasło użytkownika na podstawie jego roli i ID
exports.updateUserPassword = async (req, res) => {
  const { role, id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Brak nowego hasła w żądaniu" });
  }

  if (!["user", "doctor"].includes(role)) {
    return res.status(400).json({ error: "Nieprawidłowa rola użytkownika" });
  }
  try {
    const result = await db.updateUserPassword(Number(id), role, password);
    if (result.lenght === 0) {
      return res
        .status(404)
        .json({ error: "Nie znaleziono użytkownika do aktualizacji" });
    }

    res.json({
      message: "Hasło zostało zaktualizowane",
      user: result[0], // jeśli RETURNING było użyte
    });
  } catch (error) {
    console.error("Błąd przy aktualizacji hasła:", error);
    res.status(500).json({ error: "Błąd serwera przy aktualizacji hasła" });
  }
};

exports.runConsoleQuery = async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== "string") {
    return res
      .status(400)
      .json({ error: "Brak lub nieprawidłowe zapytanie SQL." });
  }

  try {
    const result = await db.runConsoleQuery(query);
    console.log("Wynik zapytania:", result.rows);
    if (result.rowCount === 0) {
      return res.json("Zapytanie wykonane pomyślnie.");
    } else res.json({ output: result.rows });
  } catch (error) {
    console.error("Błąd podczas wykonywania zapytania SQL:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getVisitAnalyticsDashboard = async (req, res) => {
  const dayTranslation = {
    Monday: "Poniedziałek",
    Tuesday: "Wtorek",
    Wednesday: "Środa",
    Thursday: "Czwartek",
    Friday: "Piątek",
    Saturday: "Sobota",
    Sunday: "Niedziela",
  };
  try {
    const [
      totalVisitsResult,
      visitsByTypeResult,
      visitsByDoctorResult,
      visitsByDayResult,
    ] = await Promise.all([
      db.getAllVisitsCount(),
      db.getVisitsCountByVisitType(),
      db.getVisitsCountByVisitDoctor(),
      db.getVisitsCountByDay(),
    ]);

    const totalVisits = parseInt(totalVisitsResult.rows[0].count, 10);

    const mostCommonVisits = visitsByTypeResult.rows.map((row) => ({
      type: row.type,
      count: parseInt(row.count, 10),
    }));

    const topDoctors = visitsByDoctorResult.rows.map((row) => ({
      name: row.name,
      visits: parseInt(row.visits, 10),
    }));

    const busiestDays = visitsByDayResult.rows.map((row) => ({
      day: dayTranslation[row.day.trim()] || row.day.trim(),
      visits: parseInt(row.visits, 10),
    }));

    res.json({
      totalVisits,
      mostCommonVisits,
      topDoctors,
      busiestDays,
    });
  } catch (err) {
    console.error("Błąd przy generowaniu analityki wizyt:", err);
    res.status(500).json({ error: "Wystąpił błąd serwera" });
  }
};

// Pobiera dyżury lekarzy z datą i opisem zmiany

exports.getDoctorShifts = async (req, res) => {
  try {
    const result = await db.getDoctorShifts();

    const mapped = result.rows.map(({ doctor_id, name, date, shift }) => ({
      doctor_id,
      name,
      date: dayjs.utc(date).tz("Europe/Warsaw").format("YYYY-MM-DD"),
      shift,
    }));

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Błąd podczas pobierania dyżurów lekarzy:", error);
    res.status(500).json({ error: "Błąd serwera podczas pobierania dyżurów" });
  }
};

exports.assignDoctorShift = async (req, res) => {
  try {
    const { employeeId, date, shift } = req.body;

    if (!employeeId || !date || !shift) {
      return res.status(400).json({ error: "Brakuje wymaganych pól." });
    }

    await db.assignDoctorShift(employeeId, date, shift);

    res.status(200).json({ message: "Dyżur przypisany pomyślnie." });
  } catch (error) {
    console.error("Błąd przypisywania dyżuru:", error);
    res
      .status(500)
      .json({ error: "Błąd serwera podczas przypisywania dyżuru." });
  }
};

exports.unassignDoctorShift = async (req, res) => {
  try {
    const { employeeId, date, shift } = req.body;

    if (!employeeId || !date || !shift) {
      return res.status(400).json({ error: "Brakuje wymaganych danych." });
    }

    await db.unassignDoctorShift(employeeId, date, shift);

    res.status(200).json({ message: "Dyżur usunięty pomyślnie." });
  } catch (error) {
    console.error("Błąd usuwania dyżuru:", error);
    res.status(500).json({ error: "Błąd serwera podczas usuwania dyżuru." });
  }
};
