const express = require('express');
const router = express.Router();
const Student = require("../models/Student");
const authMiddleware = require('../middleware/authMiddleware');

// GET STUDENT DASHBOARD
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    // Role protection
    if (req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const student = req.user;

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const enrolledCourses = Array.isArray(student.enrolledCourses) ? student.enrolledCourses : [];
    const achievements = Array.isArray(student.achievements) ? student.achievements : [];
    const deadlines = Array.isArray(student.deadlines) ? student.deadlines : [];
    const certificates = Array.isArray(student.certificates) ? student.certificates : [];
    const projects = Array.isArray(student.projects) ? student.projects : [];
    const totalHours = typeof student.totalHours === "number" ? student.totalHours : 0;

    return res.json({
  success: true,
  stats: {
    courses: enrolledCourses.length,
    hours: totalHours,
    certificates: certificates.length,
    projects: projects.length
  },
  continueLearning: enrolledCourses,
  achievements: achievements,
  deadlines: deadlines
});


  } catch (err) {
    console.error('Student dashboard error:', err);
    res.status(500).json({ success: false, message: 'Failed to load dashboard' });
  }
});

module.exports = router;
