// controllers/userController.js
const User = require('../models/profile'); // Adjust the path as needed

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json(users); // Send the users as a JSON response
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};
