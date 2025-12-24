// src/controllers/contactController.js
const Contact = require('../models/Contact');

exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }

    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    res.json({ success: true, message: 'Contact saved' });
  } catch (err) {
    console.error('Contact save error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
