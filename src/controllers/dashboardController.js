const Enrollment = require("../models/Enrollment");

// ================= STUDENT DASHBOARD CONTROLLER =================
exports.getStudentDashboard = async (req, res) => {
  try {
    // 🔒 Allow only students
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Student access only"
      });
    }

    const studentId = req.user.id;

    // Get enrollments
    const enrollments = await Enrollment.find({ studentId });

    const coursesInProgress = enrollments.filter(
      e => (e.progress || 0) < 100
    ).length;

    const coursesCompleted = enrollments.filter(
      e => e.progress === 100
    ).length;

    // Example hours logic (can improve later)
    const hoursLearned = enrollments.reduce(
      (sum, e) => sum + Math.floor((e.progress || 0) / 10),
      0
    );

    const events = [];

    let achievements = [];

    if (coursesCompleted >= 1) {
      achievements.push({
        title: "First Course Completed",
        description: "You completed your first course 🎉",
        icon: "🏅"
      });
    }

    if (coursesCompleted >= 5) {
      achievements.push({
        title: "Learning Streak",
        description: "Completed 5 courses 🚀",
        icon: "🔥"
      });
    }

    return res.json({
      success: true,
      data: {
        coursesInProgress,
        coursesCompleted,
        certificates: coursesCompleted,
        hoursLearned,
        continueLearning: enrollments.filter(e => e.progress < 100),
        events,
        achievements
      }
    });

  } catch (err) {
    console.error("Student dashboard error:", err);
    return res.status(500).json({
      success: false,
      message: "Dashboard error"
    });
  }
};
