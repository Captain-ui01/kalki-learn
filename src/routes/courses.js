// src/routes/courses.js (CommonJS)
const express = require('express');
const router = express.Router();

const courses = [
  { slug: 'python', title: 'Python Programming', pageId: 'python-page', level: 'All levels' },
  { slug: 'webdev', title: 'Full Stack Web Development', pageId: 'webdev-page', level: 'Beginner→Advanced' },
  { slug: 'javascript', title: 'JavaScript & React', pageId: 'javascript-page', level: 'Beginner→Advanced' },
  { slug: 'datascience', title: 'Data Science', pageId: 'datascience-page', level: 'All levels' },
  { slug: 'aiprompt', title: 'AI Prompt Engineering', pageId: 'aiprompt-page', level: 'Intermediate→Advanced' },
  { slug: 'mobile', title: 'Mobile Development', pageId: 'mobile-page', level: 'All levels' },
  { slug: 'robotics', title: 'Robotics', pageId: 'robotics-page', level: 'All levels' },
  { slug: 'java', title: 'Java', pageId: 'java-page', level: 'All levels' },
  { slug: 'machine-learning', title: 'Machine Learning', pageId: 'ml-page', level: 'Beginner→Advanced' },
  { slug: 'medical-coding', title: 'Medical Coding', pageId: 'medicalcoding-page', level: 'Beginner→Advanced' },
  { slug: 'networking', title: 'Networking', pageId: 'networking-page', level: 'Beginner→Advanced' }
];

router.get('/', (req, res) => res.json(courses));

router.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  const course = courses.find(c => c.slug === slug);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
});

module.exports = router;
