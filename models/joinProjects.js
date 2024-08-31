// models/JoinProject.js
const mongoose = require('mongoose');

const joinProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
    unique: true // Each user can only have one JoinProject document
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    }
  ] // Array of project IDs the user has joined
});

module.exports = mongoose.model('JoinProject', joinProjectSchema);
