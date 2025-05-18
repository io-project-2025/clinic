const express = require('express');
const router = express.Router();
const departmentsController = require('../controllers/departmentsController');

router.get('/', departmentsController.getDepartments);
router.post('/', departmentsController.createDepartment);
router.put('/:departmentId', departmentsController.updateDepartment);
router.delete('/:departmentId', departmentsController.deleteDepartment);

module.exports = router;
