const mongoose = require('mongoose');

const joinProjectSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, // Same ID as the user's Profile document
    required: true,
  },
  asManager: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
  ],
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
  ],
});

module.exports = mongoose.model('JoinProject', joinProjectSchema);
