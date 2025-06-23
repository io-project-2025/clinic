const db = require("../model/DatabaseService");

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
