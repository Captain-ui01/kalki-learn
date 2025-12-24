const express = require("express");
const router = express.Router();
const Enrollment = require("../models/Enrollment");

router.post("/", async (req, res) => {
  try {
    console.log("Enrollment received:", req.body);

    const enrollment = new Enrollment(req.body);
    await enrollment.save();

    res.status(200).json({
      success: true,
      message: "Enrollment successful"
    });

  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
