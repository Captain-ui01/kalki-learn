const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { getMongoose } = require("../config/db");

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const mongooseConn = getMongoose();

    const Model =
      decoded.role === "teacher"
        ? mongooseConn.model("Teacher")
        : mongooseConn.model("Student");

    const user = await Model.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = {
  id: user._id,
  role: decoded.role,
  email: user.email,
  name: user.name
};


    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
