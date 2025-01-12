const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/DashboardController');
const authMiddleware  = require('../middleware/authMiddleware'); // Middleware to check token

router.get('/assigned-tasks', authMiddleware, dashboard.fetchAssignedTasks);

module.exports = router;
