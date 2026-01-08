const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

// ================= STUDENT DASHBOARD =================
router.get(
  "/student",
  authMiddleware,
  dashboardController.getStudentDashboard
);

module.exports = router;
