const express = require('express');
const { getNotifications, getProfile, updateProfile } = require('../controllers/ProfileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getProfile);
// Update the current user's profile
router.put('/', authMiddleware, updateProfile);
router.get('/get-notifications', authMiddleware, getNotifications);

module.exports = router;
