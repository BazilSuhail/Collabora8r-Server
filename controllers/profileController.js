const Notification = require('../models/notifications');
const Profile = require('../models/profile');

// Get the current user's profile
exports.getProfile = async (req, res) => {
    try {
        const profile = await Profile.findById(req.user.id);
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, gender, phone, email, dob, avatar } = req.body;

        const updatedProfile = await Profile.findByIdAndUpdate(
            req.user.id,
            { name, gender, phone, email, dob, avatar },
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json(updatedProfile);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
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
