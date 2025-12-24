// src/models/EmailOtp.js
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, index: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  verified: { type: Boolean, default: false }
}, { timestamps: true });

// optional TTL index if you want Mongo to auto-delete expired docs
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('EmailOtp', schema);
