const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,  // Same as the user Profile's _id
    required: true,
  },
  notifications: [
    {
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      isLink: {
        type: Boolean,
        required: true
      },
      link: {
        type: String,
        default: '', // Default to an empty string if isLink is false
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile', // Reference to Profile collection (sender)
        required: true,
      },
    }
  ]
});

module.exports = mongoose.model('Notification', notificationSchema);
