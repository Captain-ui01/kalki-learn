// src/routes/auth.js
const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');

const authController = require('../controllers/authController'); // single import
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Multer storage config (store in public/uploads)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage }); // use `upload` consistently


// Helper: middleware alias - use the name your controller exports for auth checking.
// If your controller exports `requireAuth`, we use that. If it is named differently,
// change the right side accordingly (e.g. authController.verifyToken).

// POST /api/auth/avatar  -- quick test endpoint (no auth)
router.post('/avatar-test', upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`; // accessible because server serves /public
    return res.json({ success: true, url });
  } catch (err) {
    console.error('Avatar upload error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Protected avatar upload route (requires Authorization header: "Bearer <token>")
router.post('/avatar', authMiddleware, upload.single('avatar'), authController.uploadAvatar);

// Protected profile update route
router.put('/profile', authMiddleware, authController.updateProfile);

router.delete(
  "/avatar",
  authMiddleware,
  authController.removeAvatar
);

// --- Signup ---
router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('role').isIn(['student','teacher']).withMessage('Role must be student or teacher')
  ],
  authController.signup
);

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);

// --- Login ---
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required')
  ],
  authController.login
);

module.exports = router;
