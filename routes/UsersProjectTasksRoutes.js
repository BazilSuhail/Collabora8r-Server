const express = require('express');
const { getProjectTasks, updateTaskStatus, updateTaskStatusAndProgress } = require('../controllers/UsersProjectTasksController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:projectId', authMiddleware, getProjectTasks);


router.patch('/tasks/update', updateTaskStatus);
router.put('/update-task-progress/:taskId', authMiddleware, updateTaskStatusAndProgress);

module.exports = router;
