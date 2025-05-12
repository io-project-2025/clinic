// Lekarz: Pacjenci
// Obsługuje: GET /api/doctor/patients, GET /api/patients/:patientId

// Pobiera wszystkich pacjentów lekarza
exports.getDoctorPatients = (req, res) => {
    res.json([{ id: 1, name: 'Jan Kowalski' }]);
  };

// Pobiera szczegóły pacjenta
exports.getPatientDetails = (req, res) => {
    const patientId = req.params.patientId;
    res.json({ id: patientId, name: 'Jan Kowalski', age: 40 });
};

exports.getPatients = (req, res) => {
    //TODO 
}