// models/AssignedTask.js
const mongoose = require('mongoose');

const assignedTaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  assignTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }
  ],
});

module.exports = mongoose.model('AssignedTask', assignedTaskSchema);
