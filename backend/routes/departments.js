const express = require('express');
const router = express.Router();
const departmentsController = require('../controllers/departmentsController');
const { authorizeRole } = require('../middleware/authMiddleware');

router.get('/', 
    authorizeRole(['pacjent', 'lekarz', 'admin']), 
    departmentsController.getDepartments
);

router.post('/', 
    authorizeRole(['admin']), 
    departmentsController.createDepartment
);

router.put('/:departmentId', 
    authorizeRole(['admin']), 
    departmentsController.updateDepartment
);

router.delete('/:departmentId', 
    authorizeRole(['admin']), 
    departmentsController.deleteDepartment
);

module.exports = router;
