const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, // Same as the user Profile's _id
    required: true,
  },
  notifications: [
    {
      _id: false,
      type: {
        type: String, // A variable of string type to represent the notification type
        required: true,
      },
      data: {
        type: mongoose.Schema.Types.Mixed, // Schemaless object for arbitrary attributes
        default: () => ({ createdAt: Date.now() }), // Initialize `data` with `createdAt`
      },
    },
  ],
});

module.exports = mongoose.model('Notification', notificationSchema);
