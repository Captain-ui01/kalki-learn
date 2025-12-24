// src/config/db.js
const mongoose = require('mongoose');

let conn = null;

// Connect once and reuse the connection
async function connectDB() {
  if (conn && mongoose.connection.readyState === 1) {
    return conn; // already connected
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing in .env');

  try {
    conn = await mongoose.connect(uri); // no legacy options
    console.log('MongoDB connected (shared connection)');
    return conn;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

// Export connection + mongoose instance for models
module.exports = {
  connectDB,
  getMongoose: () => mongoose,
};
