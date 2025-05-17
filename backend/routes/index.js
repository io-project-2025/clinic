var express = require('express');
var router = express.Router();

const appointmentsRouter = require('./routes/appointments');
const departmentsRouter = require('./routes/departments');
const doctorsRouter = require('./routes/doctors');
const documentsRouter = require('./routes/documents');
const labResultsRouter = require('./routes/labResults');
const patientsRouter = require('./routes/patients');
const statisticsRouter = require('./routes/statistics');

app.use('/api/appointments', appointmentsRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/lab-results', labResultsRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/statistics', statisticsRouter);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({Works: true})
});

module.exports = router;

