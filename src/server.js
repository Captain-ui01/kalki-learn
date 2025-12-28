// src/server.js (FINAL & CLEAN)
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

// Load DB + model factories
const { connectDB, getMongoose } = require('./config/db');
const StudentFactory = require('./models/Student');
const TeacherFactory = require('./models/Teacher');
const CourseFactory = require('./models/Course');


// Routers
const pagesRouter = require('./routes/pages');
const coursesRouter = require('./routes/courses');
const contactRouter = require('./routes/contact');
const authRouter = require('./routes/auth');
const teacherRoutes = require("./routes/teacher.routes");
const studentRoutes = require("./routes/student.routes");


const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// Global middlewares
app.use(cors({
  origin: [
    "https://kalkilearning.com",
    "https://www.kalkilearning.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors()); // 🔥 VERY IMPORTANT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------------------------------
   CONNECT DATABASE + INITIALIZE MODELS HERE
------------------------------------------- */
connectDB()
  .then(() => {
    const mongoose = getMongoose();
    StudentFactory(mongoose);
    TeacherFactory(mongoose);
    CourseFactory(mongoose);
    console.log('Models initialized');
  })
  .catch(err => {
    console.error('DB connection failed:', err);
  });

/* ------------------------------------------
   STATIC FRONTEND
------------------------------------------- */
app.use(express.static(path.join(__dirname, '..', 'public')));

/* ------------------------------------------
   API ROUTES
------------------------------------------- */
app.use('/api/pages', pagesRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/contact', contactRouter);
app.use('/api/auth', authRouter);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/enroll", require("./routes/enrollment"));


// Protected API test
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ success: true, message: "Access granted", user: req.user });
});

/* ------------------------------------------
   SPA FRONTEND FALLBACK
------------------------------------------- */
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

/* ------------------------------------------
   GLOBAL ERROR HANDLER
------------------------------------------- */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (req.path.startsWith('/api/')) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
  next(err);
});

/* ------------------------------------------
   START SERVER
------------------------------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
