const mongoose = require('mongoose');

const adminProjectSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, // Same ID as the user's Profile document
    required: true,
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
  ],
});

module.exports = mongoose.model('AdminProject', adminProjectSchema);
