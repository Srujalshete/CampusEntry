const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'user'], default: 'user' },
  fullName: { type: String },
  phoneNumber: { type: String },
  dateOfBirth: { type: String },
  gender: { type: String },
  address: { type: String },
  courseEnrolled: { type: String },
});

module.exports = mongoose.model('Admin', AdminSchema);
