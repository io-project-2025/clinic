const express = require('express');
const router = express.Router();
const doctorsController = require('../controllers/doctorsController');
const { authorizeRole } = require('../middleware/authMiddleware');

router.get('/', authorizeRole(['pacjent', 'lekarz']), doctorsController.getDoctors);
router.post('/', authorizeRole(['lekarz']), doctorsController.createDoctor);
router.put('/:doctorId', authorizeRole(['lekarz']), doctorsController.updateDoctor);
router.delete('/:doctorId', authorizeRole(['lekarz']), doctorsController.deleteDoctor);

module.exports = router;