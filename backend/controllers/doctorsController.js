// Administrator: Zarządzanie lekarzami
// Obsługuje: GET /api/doctors, POST /api/doctors, PUT /api/doctors/:doctorId, DELETE /api/doctors/:doctorId

// Pobieranie listy lekarzy
exports.getDoctors = (req, res) => {
    res.json({ message: 'Lista lekarzy' });
};

// Dodawanie nowego lekarza
exports.createDoctor = (req, res) => {
    res.json({ message: 'Lekarz dodany' });
};

// Edytowanie lekarza
exports.updateDoctor = (req, res) => {
    res.json({ message: `Lekarz ${req.params.doctorId} zaktualizowany` });
};

// Usuwanie lekarza
exports.deleteDoctor = (req, res) => {
    res.json({ message: `Lekarz ${req.params.doctorId} usunięty` });
};