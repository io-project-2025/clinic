// Lekarz: Wizyty
// Obsługuje: PATCH /api/appointments/:id/status, DELETE /api/appointments/:id, PUT /api/appointments/:id, POST /api/appointments, POST /api/appointments/:id/approve

// Aktualizacja statusu wizyty
exports.updateAppointmentStatus = (req, res) => {
    res.json({ message: `Status wizyty ${req.params.id} zaktualizowany` });
};

// Usunięcie wizyty  
exports.deleteAppointment = (req, res) => {
    res.json({ message: `Wizyta ${req.params.id} usunięta` });
};

// Aktualizacja wizyty
exports.updateAppointment = (req, res) => {
    res.json({ message: `Wizyta ${req.params.id} zaktualizowana` });
};

// Utworzenie wizyty
exports.createAppointment = (req, res) => {
    res.json({ message: 'Wizyta utworzona' });
};

// Zatwierdzenie wizyty
exports.approveAppointment = (req, res) => {
    res.json({ message: `Wizyta ${req.params.id} zatwierdzona` });
};