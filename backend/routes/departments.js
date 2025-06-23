const express = require('express');
const router = express.Router();
const departmentsController = require('../controllers/departmentsController');
const { authorizeRole } = require('../middleware/authMiddleware');

// Pobierz listę oddziałów
router.get('/', 
    authorizeRole(['pacjent', 'lekarz', 'admin']), 
    departmentsController.getDepartments
);

// Dodaj nowy oddział
router.post('/', 
    authorizeRole(['admin']), 
    departmentsController.createDepartment
);

// Edytuj istniejący oddział
router.put('/:departmentId', 
    authorizeRole(['admin']), 
    departmentsController.updateDepartment
);

// Usuń oddział
router.delete('/:departmentId', 
    authorizeRole(['admin']), 
    departmentsController.deleteDepartment
);

module.exports = router;