// models/AdminProject.js
const mongoose = require('mongoose');

const adminProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
    unique: true // Each user can only have one AdminProject document
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    }
  ] // Array of project IDs created by the user
});

module.exports = mongoose.model('AdminProject', adminProjectSchema);
