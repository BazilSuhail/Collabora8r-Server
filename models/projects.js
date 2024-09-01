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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
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
