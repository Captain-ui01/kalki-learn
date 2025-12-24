// src/routes/pages.js (CommonJS)
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();

// Map pageId -> file path under public/pages (relative)
const PAGE_MAP = {
  'home-page': 'home.html',
  'dashboard-page': 'dashboard.html',
  'syllabus-page': 'syllabus.html',
  'about-page': 'about.html',
  'blog-page': 'blog.html',
  'contact-page': 'contact.html',
  'login-page': 'login.html',
  'signup-page': 'signup.html',
  'python-page': 'courses/python.html',
  'webdev-page': 'courses/webdev.html',
  'javascript-page': 'courses/javascript.html',
  'datascience-page': 'courses/datascience.html',
  'aiprompt-page': 'courses/aiprompt.html',
  'mobile-page': 'courses/mobile.html',
  'robotics-page': 'courses/robotics.html',
  'java-page': 'courses/java.html',
  'ml-page': 'courses/machinelearning.html',
  'medicalcoding-page': 'courses/medicalcoding.html',
  'networking-page': 'courses/networking.html'
};

router.get('/:pageId', async (req, res) => {
  try {
    const pageId = req.params.pageId;
    const rel = PAGE_MAP[pageId];
    if (!rel) return res.status(404).send('Page not found');

    const filePath = path.join(__dirname, '..', '..', 'public', 'pages', rel);

    // Make sure file exists (throw if not)
    const content = await fs.readFile(filePath, 'utf8');
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(content);
  } catch (err) {
    console.error('Error reading page:', err);
    res.status(500).send('Error loading content');
  }
});

module.exports = router;
