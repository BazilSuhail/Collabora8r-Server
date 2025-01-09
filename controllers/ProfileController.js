const Notification = require('../models/notifications');

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from the middleware
        //console.log("id is "+userId)
        const userNotifications = await Notification.findById(userId);

        if (!userNotifications) {
            return res.status(404).json({ error: 'Notifications not found' });
        }

        res.status(200).json(userNotifications.notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
