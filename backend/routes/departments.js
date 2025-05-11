const express = require('express');
const router = express.Router();
const departmentsController = require('../controllers/departmentsController');

// Pobieranie listy oddziałów
router.get('/', departmentsController.getDepartments);

// Dodawanie oddziału
router.post('/', departmentsController.createDepartment);

// Edytowanie oddziału
router.put('/:departmentId', departmentsController.updateDepartment);

// Usuwanie oddziału
router.delete('/:departmentId', departmentsController.deleteDepartment);

module.exports = router;
