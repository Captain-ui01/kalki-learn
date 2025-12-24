const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const Teacher = mongoose.model("Teacher");
    const Course = mongoose.model("Course");

    const teacher = await Teacher.findById(req.user._id).lean();
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const courses = await Course.find({ teacherId: teacher._id }).lean();

    let totalStudents = 0;
    courses.forEach(c => {
      totalStudents += c.enrolledStudents?.length || 0;
    });

    res.json({
      success: true,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email
      },
      stats: {
        totalCourses: courses.length,
        totalStudents
      },
      courses
    });

  } catch (err) {
    console.error("Teacher dashboard error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load teacher dashboard"
    });
  }
});

module.exports = router;
