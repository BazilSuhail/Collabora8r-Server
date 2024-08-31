// models/Project.js
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
      taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
      },
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
      },
      status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Completed'],
        default: 'To Do'
      }
    }
  ]
});

module.exports = mongoose.model('Project', projectSchema);
