const mongoose = require('mongoose');

const assignedTaskSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, // Same ID as the user's Profile document
    required: true,
  },
  assignTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
});

module.exports = mongoose.model('AssignedTask', assignedTaskSchema);
