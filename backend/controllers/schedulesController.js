// Administrator: Zarządzanie harmonogramem lekarzy
// Obsługuje: GET /api/schedules, POST /api/schedules, PUT /api/schedules/:scheduleId

// Przeglądanie harmonogramów lekarzy
exports.getSchedules = (req, res) => {
    res.json({ message: 'Lista harmonogramów lekarzy' });
};

// Dodawanie nowego harmonogramu lekarza
exports.createSchedule = (req, res) => {
    res.json({ message: 'Harmonogram lekarza dodany' });
};

// Edytowanie harmonogramu lekarza
exports.updateSchedule = (req, res) => {
    res.json({ message: `Harmonogram lekarza ${req.params.scheduleId} zaktualizowany` });
};