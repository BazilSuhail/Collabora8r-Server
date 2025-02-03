const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  theme: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  projectManager: {
    managerProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile'
    },
    email: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    }
  },
  team: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile' // Reference to the Profile collection
    }
  ],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }
  ]
});

module.exports = mongoose.model('Project', projectSchema);
