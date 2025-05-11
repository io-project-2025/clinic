// Administrator: Zarządzanie oddziałami
// Obsługuje: GET /api/departments, POST /api/departments, PUT /api/departments/:departmentId, DELETE /api/departments/:departmentId

// Pobieranie listy oddziałów
exports.getDepartments = (req, res) => {
    res.json({ message: 'Lista oddziałów' });
};

// Dodawanie nowego oddziału
exports.createDepartment = (req, res) => {
    res.json({ message: 'Oddział dodany' });
};

// Edytowanie oddziału
exports.updateDepartment = (req, res) => {
    res.json({ message: `Oddział ${req.params.departmentId} zaktualizowany` });
};

// Usuwanie oddziału
exports.deleteDepartment = (req, res) => {
    res.json({ message: `Oddział ${req.params.departmentId} usunięty` });
};