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

// Optional: Fetch comments for a task
exports.getCommentsForTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    // Populate comments with the actual Comment documents
    const comments = await Comment.find({ _id: { $in: task.comments.map(id => mongoose.Types.ObjectId(id)) } });

    res.status(200).json({ comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch comments.' });
  }
};
