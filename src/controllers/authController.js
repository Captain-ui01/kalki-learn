// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const path = require('path');
const mongoose = require('mongoose');

const User = require('../models/User');         // optional shared user model
const Student = require('../models/Student');   // students collection model
const Teacher = require('../models/Teacher');   // teachers collection model

const crypto = require('crypto');
const EmailOtp = require('../models/EmailOtp');
const { sendMail, buildOtpEmailHtml  } = require('../utils/mailer');


function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

exports.sendOtp = async (req, res) => {
  try {
    const { email, name } = req.body || {};
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Valid email required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
    const otpHash = hashOtp(otp);
    const expireMinutes = Number(process.env.OTP_EXPIRE_MINUTES || 10);
    const expiresAt = new Date(Date.now() + expireMinutes * 60 * 1000);

    await EmailOtp.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { email: email.toLowerCase().trim(), otpHash, expiresAt, attempts: 0 },
      { upsert: true, new: true }
    );

    // send email
    const subject = `Kalki verification code: ${otp}`;
    const html = buildOtpEmailHtml({ name: name || '', otp, minutes: expireMinutes });
    const text = `Your verification code is ${otp}. It expires in ${expireMinutes} minutes.`;

    await sendMail({ to: email, subject, html, text });

    return res.json({ success: true, message: 'OTP sent' });
  } catch (err) {
    console.error('sendOtp error', err);
    return res.status(500).json({ success: false, message: 'Server error sending OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body || {};
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP required' });

    const doc = await EmailOtp.findOne({ email: email.toLowerCase().trim() });
    if (!doc) return res.status(400).json({ success: false, message: 'OTP missing or expired' });

    if (doc.expiresAt && doc.expiresAt < new Date()) {
      await EmailOtp.deleteOne({ _id: doc._id });
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    if (doc.attempts >= 5) {
      return res.status(429).json({ success: false, message: 'Too many wrong attempts. Request new OTP.' });
    }

    const otpHash = hashOtp(otp);
    if (otpHash !== doc.otpHash) {
      doc.attempts = (doc.attempts || 0) + 1;
      await doc.save();
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    // success: mark verified and keep for a short window to allow signup to check
    doc.verified = true;
    // optionally shorten expiry so it cleans soon after verification:
    doc.expiresAt = new Date(Date.now() + (Number(process.env.OTP_VERIFIED_TTL_MIN || 10) * 60 * 1000));
    await doc.save();

    return res.json({ success: true, message: 'OTP verified' });
  } catch (err) {
    console.error('verifyOtp error', err);
    return res.status(500).json({ success: false, message: 'Server error verifying OTP' });
  }
};

// uploadAvatar: expects req.user (set by auth middleware) or req.userId, and req.file
exports.uploadAvatar = async (req, res) => {
  try {
    // prefer req.user (populated by auth middleware); fallback to req.userId
    const userId = (req.user && (req.user._id || req.user.id)) || req.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const avatarUrl = `/uploads/${req.file.filename}`;

    // Try to find user in shared User collection first, then students/teachers
    let user = await User.findById(userId);
    if (!user) {
      user = await Student.findById(userId) || await Teacher.findById(userId);
    }
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.avatar = avatarUrl;
    await user.save();

    return res.json({ success: true, avatar: avatarUrl, user: { name: user.name, email: user.email, avatar: avatarUrl, _id: user._id } });
  } catch (err) {
    console.error('uploadAvatar error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = (req.user && (req.user._id || req.user.id)) || req.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // find in User then Student then Teacher
    let user = await User.findById(userId) || await Student.findById(userId) || await Teacher.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name.trim();
    await user.save();

    return res.json({ success: true, user: { name: user.name, email: user.email, avatar: user.avatar, _id: user._id, role: user.role } });
  } catch (err) {
    console.error('updateProfile error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Generate JWT — include role
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
};

// Helper: pick model for a role
function modelForRole(role) {
  const r = (role || '').toLowerCase();
  if (r === 'teacher' || r === 'tutor') return Teacher;
  return Student;
}

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    console.log('Signup request body:', req.body);
    const { name, email, password, role } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields (name, email, password).' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }

    const userRole = (role || 'student').toLowerCase();
    if (!['student', 'teacher', 'tutor'].includes(userRole)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const ModelToUse = modelForRole(userRole);

    // Check existing in chosen collection
    const existing = await ModelToUse.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'User with that email already exists.' });
    }

        // require that email is verified via OTP
    const normalizedEmail = email.toLowerCase().trim();
    const otpRecord = await EmailOtp.findOne({ email: normalizedEmail, verified: true });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Email not verified. Please verify OTP before signing up.' });
    }

    // Optionally delete OTP docs after verification (clean up)
    await EmailOtp.deleteMany({ email: normalizedEmail });


    const hashed = await bcrypt.hash(password, 10);

    const userDoc = new ModelToUse({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      role: userRole
    });

    await userDoc.save();

    const token = generateToken(userDoc._id, userDoc.role);

    return res.status(201).json({
      success: true,
      message: 'User created',
      token,
      user: {
        id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        avatar: userDoc.avatar || null,
        role: userDoc.role
      }
    });
  } catch (err) {
    console.error('Signup error', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    console.log('Login request body:', req.body);
    const { email, password, role } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Missing email or password.' });
    }

    const emailNorm = email.toLowerCase().trim();

    // Step 1: ALWAYS search all collections first
    let user =
      await Student.findOne({ email: emailNorm }) ||
      await Teacher.findOne({ email: emailNorm }) ||
      await User.findOne({ email: emailNorm });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Step 2: Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Step 3: Role mismatch validation
    if (role && user.role !== role) {
      const hint =
        user.role === 'teacher'
          ? 'Please use the Tutor login.'
          : 'Please use the Student login.';

      return res.status(403).json({
        success: false,
        message: `Role mismatch. ${hint}`
      });
    }

    // Step 4: Generate token
    const token = generateToken(user._id, user.role);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar || null
      }
    });

  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
