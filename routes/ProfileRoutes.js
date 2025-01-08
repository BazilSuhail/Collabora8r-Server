const express = require('express');
const { getNotifications } = require('../controllers/ProfileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/get-notifications', authMiddleware, getNotifications);

module.exports = router;
