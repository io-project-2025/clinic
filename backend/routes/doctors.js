const express = require('express');
const router = express.Router();
const doctorsController = require('../controllers/doctorsController');

router.get('/', doctorsController.getDoctors);
router.post('/', doctorsController.createDoctor);
router.put('/:doctorId', doctorsController.updateDoctor);
router.delete('/:doctorId', doctorsController.deleteDoctor);

module.exports = router;