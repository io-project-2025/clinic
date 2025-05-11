// Administrator: Zarządzanie pokojami
// Obsługuje: GET /api/rooms, POST /api/rooms, PUT /api/rooms/:roomId, DELETE /api/rooms/:roomId

// Pobieranie listy pokoi
exports.getRooms = (req, res) => {
    res.json({ message: 'Lista pokoi' });
};

// Dodawanie nowego pokoju
exports.createRoom = (req, res) => {
    res.json({ message: 'Pokój dodany' });
};

// Edytowanie pokoju
exports.updateRoom = (req, res) => {
    res.json({ message: `Pokój ${req.params.roomId} zaktualizowany` });
};

// Usuwanie pokoju
exports.deleteRoom = (req, res) => {
    res.json({ message: `Pokój ${req.params.roomId} usunięty` });
};