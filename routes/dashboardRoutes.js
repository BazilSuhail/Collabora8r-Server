const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/dashboardController');
const authMiddleware  = require('../middleware/authMiddleware'); // Middleware to check token

router.get('/assigned-tasks', authMiddleware, dashboard.fetchAssignedTasks);
router.get('/progress-overview', authMiddleware, dashboard.fetchProgressOverview);

module.exports = router;
