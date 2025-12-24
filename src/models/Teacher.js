// src/models/Teacher.js
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, default: 'teacher' },
  bio: { type: String },
  createdAt: { 
      type: Date, 
      default: Date.now 
    },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: Number,
  totalStudents: Number
}, { timestamps: true });

module.exports = mongoose.models && mongoose.models.Teacher
  ? mongoose.models.Teacher
  : mongoose.model('Teacher', teacherSchema);
