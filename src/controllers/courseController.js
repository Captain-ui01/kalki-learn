const Course = require('../models/Course');

exports.getAll = async (req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.json(courses);
};

exports.getOne = async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug });
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json(course);
};

// Admin create (simple)
exports.create = async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
};
