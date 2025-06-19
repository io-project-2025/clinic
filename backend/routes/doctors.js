const express = require('express');
const router = express.Router();
const doctorsController = require('../controllers/doctorsController');
const { authorizeRole } = require('../middleware/authMiddleware');

router.get('/', 
    authorizeRole(['pacjent', 'lekarz']), 
    doctorsController.getDoctors
);

router.put('/:doctorId', 
    authorizeRole(['lekarz']), 
    doctorsController.updateDoctor
);

module.exports = router;