const express = require('express');
const { addCommentToTask, getCommentsForTask, editComment, deleteComment, getProjectCreatorName } = require('../controllers/CommentsController');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');

// Route to add a comment to a task
router.post('/tasks/:taskId/comments', authenticateUser, addCommentToTask);

// Route to get comments for a specific task
router.get('/tasks/:taskId/comments', authenticateUser, getCommentsForTask);
router.put('/:commentId', authenticateUser, editComment);
router.delete('/:commentId', authenticateUser, deleteComment);
router.get('/:id/name',getProjectCreatorName);

module.exports = router;
