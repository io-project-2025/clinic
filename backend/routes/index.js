var express = require('express');
var router = express.Router();

const appointmentsRouter = require('./appointments');
const departmentsRouter = require('./departments');
const doctorsRouter = require('./doctors');
const documentsRouter = require('./documents');
const labResultsRouter = require('./labResults');
const patientsRouter = require('./patients');
const statisticsRouter = require('./statistics');
const authRouter = require('./auth');

router.use('/api/appointments', appointmentsRouter);
router.use('/api/departments', departmentsRouter);
router.use('/api/doctors', doctorsRouter);
router.use('/api/documents', documentsRouter);
router.use('/api/lab-results', labResultsRouter);
router.use('/api/patients', patientsRouter);
router.use('/api/statistics', statisticsRouter);
router.use('/api/auth', authRouter);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({Works: true})
});

module.exports = router;

