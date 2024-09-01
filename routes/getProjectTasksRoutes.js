const express = require('express');
const { getProjectTasks } = require('../controllers/getProjectTasksController');
const protect  = require('../middleware/authMiddleware'); // Assuming you have an authentication middleware

const router = express.Router();

router.get('/:projectId', protect, getProjectTasks);

module.exports = router;
