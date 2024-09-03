const Task = require('../models/tasks');
const Comment = require('../models/comments');

exports.addCommentToTask = async (req, res) => {
  const { taskId } = req.params;
  const { content, userId } = req.body;
  try {
    // Create the comment
    const comment = new Comment({
      content,
      userId,
      taskId,
    });

    await comment.save();

    // Add the comment ID as a string to the task's comments array
    await Task.findByIdAndUpdate(taskId, { $push: { comments: comment._id.toString() } });

    res.status(201).json({ message: 'Comment added successfully.', comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add comment.' });
  }
};

// Get comments for a specific task along with user details
exports.getCommentsForTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    console.log(taskId);

    // Fetch the task by ID
    const task = await Task.findById(taskId).lean();
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Fetch comments for the task and populate user details
    const comments = await Comment.find({ _id: { $in: task.comments } })
      .populate('userId', 'name email') // Assuming the comment schema has a `userId` field
      .lean();

    res.status(200).json({ comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch task comments' });
  }
};


// Edit a comment
exports.editComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    ).populate('userId', 'name');

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    res.status(200).json({ message: 'Comment updated successfully.', comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update comment.' });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    // Remove the comment ID from the associated task's comments array
    await Task.findByIdAndUpdate(comment.taskId, { $pull: { comments: commentId } });

    res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete comment.' });
  }
};