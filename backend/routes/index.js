var express = require("express");
var router = express.Router();

const appointmentsRouter = require("./appointments");
const departmentsRouter = require("./departments");
const doctorsRouter = require("./doctors");
const patientsRouter = require("./patients");
const authRouter = require("./auth");
const messagesRouter = require("./messages");
const adminRouter = require("./admins");

router.use("/api/appointments", appointmentsRouter);
router.use("/api/departments", departmentsRouter);
router.use("/api/doctors", doctorsRouter);
router.use("/api/patients", patientsRouter);
router.use("/api/auth", authRouter);
router.use("/api/messages", messagesRouter);
router.use("/api/admins", adminRouter);

/* GET home page */
router.get("/", function (req, res, next) {
  res.status(200).json({ Works: true });
});

module.exports = router;
