// models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  dob: {
    type: Date,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  adminProjects: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminProject'
  }, // Reference to the AdminProject document
  joinedProjects: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JoinProject'
  } // Reference to the JoinProject document
});

module.exports = mongoose.model('Profile', profileSchema);
