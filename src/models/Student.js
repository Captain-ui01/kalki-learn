// src/models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, default: 'student' },
  createdAt: { 
      type: Date, 
      default: Date.now 
    },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalHours: Number,
  level: Number,
  streak: Number
}, { timestamps: true });

// If model already exists (hot-reload), reuse it to avoid OverwriteModelError
module.exports = mongoose.models && mongoose.models.Student
  ? mongoose.models.Student
  : mongoose.model('Student', studentSchema);
