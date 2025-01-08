const express = require('express');
const { getProjectTasks,updateTaskStatus } = require('../controllers/UsersProjectTasksController');
const protect  = require('../middleware/authMiddleware'); // Assuming you have an authentication middleware

const router = express.Router();

router.get('/:projectId', protect, getProjectTasks);


router.patch('/tasks/update', updateTaskStatus);

module.exports = router;
