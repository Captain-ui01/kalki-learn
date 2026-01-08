// models/Enrollment.js
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course' 
  },
  
  fullName: String,
  gender: String,
  email: String,
  phone: String,
  course: String,
  timeZone: String,
  createdAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 },
  lastAccessed: Date
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
