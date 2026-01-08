const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing"
      });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 ALWAYS use User model
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Attach full user
    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};
