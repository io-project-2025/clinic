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
module.exports = router;
