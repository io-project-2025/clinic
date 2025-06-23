const express = require("express");
const router = express.Router();
const adminRequestsController = require("../controllers/adminRequestsController");
const { authorizeRole } = require("../middleware/authMiddleware");

// Pobiera wszystkich użytkowników z bazy danych
router.get(
  "/users",
  authorizeRole(["admin"]),
  adminRequestsController.getUsers
);

// Aktualizuje hasło użytkownika na podstawie jego roli i ID
router.put(
  "/users/:role/:id/password",
  authorizeRole(["admin"]),
  adminRequestsController.updateUserPassword
);

// Wykonuje zapytanie SQL w konsoli
router.post(
  "/console",
  authorizeRole(["admin"]),
  adminRequestsController.runConsoleQuery
);

// Pobiera analitykę wizyt w klinice
router.get(
  "/visits/analytics",
  authorizeRole(["admin"]),
  adminRequestsController.getVisitAnalyticsDashboard
);

// Pobiera dyżury lekarzy z datą i opisem zmiany
router.get(
  "/doctors/shifts",
  authorizeRole(["admin"]),
  adminRequestsController.getDoctorShifts
);

// Przypisuje dyżur lekarza do konkretnej daty i zmiany
router.post(
  "/shifts/assign",
  authorizeRole(["admin"]),
  adminRequestsController.assignDoctorShift
);

// Usuwa dyżur lekarza na podstawie ID pracownika, daty i zmiany
router.post(
  "/shifts/unassign",
  authorizeRole(["admin"]),
  adminRequestsController.unassignDoctorShift
);

module.exports = router;
