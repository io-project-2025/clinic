const db = require('../model/DatabaseService');

// Pobieranie wiadomości między pacjentem a lekarzem
exports.getMessages = async (req, res) => {
  const { id: userId, role } = req.user;

  try {
    let pacjentId, lekarzId;

    // Pobieramy ID rozmówcy z query, weryfikujemy poprawność
    if (role === 'pacjent') {
      pacjentId = userId;
      lekarzId = req.query.lekarzId;
      if (!lekarzId) return res.status(400).json({ error: 'Brak parametru lekarzId w zapytaniu' });
    } else if (role === 'lekarz') {
      lekarzId = userId;
      pacjentId = req.query.pacjentId;
      if (!pacjentId) return res.status(400).json({ error: 'Brak parametru pacjentId w zapytaniu' });
    } else {
      return res.status(400).json({ error: 'Nieznana rola użytkownika' });
    }

    const result = await db.getMessagesBetween(pacjentId, lekarzId);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Błąd podczas pobierania wiadomości:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

// Wysyłanie wiadomości między pacjentem a lekarzem
exports.sendMessage = async (req, res) => {
  const { id: nadawcaId, role: nadawcaRole } = req.user;
  const { odbiorcaId, odbiorcaRole, tresc } = req.body;

  if (!odbiorcaId || !odbiorcaRole || !tresc) {
    return res.status(400).json({ error: 'Brakuje wymaganych danych: odbiorcaId, odbiorcaRole lub tresc' });
  }

  let pacjentId, lekarzId;

  // Ustalamy pacjentId i lekarzId na podstawie ról nadawcy i odbiorcy
  if (nadawcaRole === 'pacjent' && odbiorcaRole === 'lekarz') {
    pacjentId = nadawcaId;
    lekarzId = odbiorcaId;
  } else if (nadawcaRole === 'lekarz' && odbiorcaRole === 'pacjent') {
    pacjentId = odbiorcaId;
    lekarzId = nadawcaId;
  } else {
    return res.status(400).json({ error: 'Nieprawidłowe role nadawcy lub odbiorcy. Nadawca musi być pacjentem lub lekarzem, odbiorca przeciwnej roli.' });
  }

  try {
    const result = await db.sendMessage(pacjentId, lekarzId, nadawcaRole, tresc);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Błąd podczas wysyłania wiadomości:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};