const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  notifications: [
    {
      _id: false,
      type: {
        type: String, // Represent the notification type
        required: true,
      },
      data: {
        type: mongoose.Schema.Types.Mixed, // Schemaless object for arbitrary attributes
        default: () => ({ createdAt: Date.now() }),
      },
    },
  ],
});

module.exports = mongoose.model('Notification', notificationSchema);
