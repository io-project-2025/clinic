const express = require("express");
const router = express.Router();
const adminRequestsController = require("../controllers/adminRequestsController");
const { authorizeRole } = require("../middleware/authMiddleware");

router.get(
  "/users",
  authorizeRole(["admin"]),
  adminRequestsController.getUsers
);
router.put(
  "/users/:role/:id/password",
  authorizeRole(["admin"]),
  adminRequestsController.updateUserPassword
);
router.post(
  "/console",
  authorizeRole(["admin"]),
  adminRequestsController.runConsoleQuery
);

router.get(
  "/visits/analytics",
  authorizeRole(["admin"]),
  adminRequestsController.getVisitAnalyticsDashboard
);

router.get(
  "/doctors/shifts",
  authorizeRole(["admin"]),
  adminRequestsController.getDoctorShifts
);

router.post(
  "/shifts/assign",
  authorizeRole(["admin"]),
  adminRequestsController.assignDoctorShift
);

router.post(
  "/shifts/unassign",
  authorizeRole(["admin"]),
  adminRequestsController.unassignDoctorShift
);

module.exports = router;
