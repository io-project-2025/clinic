const express = require('express');
const router = express.Router();
const doctorsController = require('../controllers/doctorsController');
const { authorizeRole } = require('../middleware/authMiddleware');

router.get('/', 
    authorizeRole(['pacjent', 'lekarz', 'admin']), 
    doctorsController.getDoctors
);

router.put('/:doctorId', 
    authorizeRole(['lekarz', 'admin']), 
    doctorsController.updateDoctor
);

router.post('/',
    authorizeRole(['admin']), 
    doctorsController.createDoctor
);

router.delete('/:doctorId',
    authorizeRole(['admin']), 
    doctorsController.deleteDoctor
);

router.get('/:doctorId', 
    authorizeRole(['admin']), 
    controller.getDoctorDetails
);

module.exports = router;
