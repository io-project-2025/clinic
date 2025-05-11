var express = require('express');
var router = express.Router();

const usersRouter = require('./users');
const schedulesRouter = require('./schedules');
const patientsRouter = require('./patients');
const appointmentsRouter = require('./appointments');
const medicalNotesRouter = require('./medicalNotes');
const labResultsRouter = require('./labResults');
const documentsRouter = require('./documents');
const statisticsRouter = require('./statistics');
const doctorsRouter = require('./doctors');
const departmentsRouter = require('./departments');
const roomsRouter = require('./rooms');

router.use('/api/users', usersRouter);
router.use('/api/schedules', schedulesRouter);
router.use('/api/doctor/patients', patientsRouter);
router.use('/api/appointments', appointmentsRouter);
router.use('/api/appointments/:id/note', medicalNotesRouter);
router.use('/api/patients/:patientId/lab-results', labResultsRouter);
router.use('/api/patients/:patientId/documents', documentsRouter);
router.use('/api/statistics', statisticsRouter);
router.use('/api/doctors', doctorsRouter);
router.use('/api/departments', departmentsRouter);
router.use('/api/rooms', roomsRouter);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({Works: true})
});

module.exports = router;

