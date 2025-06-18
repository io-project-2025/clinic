const express = require('express');
const router = express.Router();
const departmentsController = require('../controllers/departmentsController');
const { authorizeRole } = require('../middleware/authMiddleware');

router.get('/', authorizeRole(['pacjent', 'lekarz']), departmentsController.getDepartments);
router.post('/', authorizeRole(['lekarz']), departmentsController.createDepartment);
router.put('/:departmentId', authorizeRole(['lekarz']), departmentsController.updateDepartment);
router.delete('/:departmentId', authorizeRole(['lekarz']), departmentsController.deleteDepartment);

module.exports = router;
