const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
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
      type: String, // Store the email initially
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'], // Status of the project manager
      default: 'Pending'
    }
  },
  team: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
      },
      role: {
        type: String,
        enum: ['Project Manager', 'Team Member'],
        default: 'Team Member'
      }
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
