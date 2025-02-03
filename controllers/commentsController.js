const Task = require('../models/tasks');
const Comment = require('../models/comments');
const Profile = require('../models/profile');

// Get comments for a specific task along with user details
exports.getCommentsForTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).lean();
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Fetch comments for the task
    const comments = await Comment.find({ _id: { $in: task.comments } }).lean();

    // Fetch user details for each comment
    const commentsWithUserDetails = await Promise.all(comments.map(async (comment) => {
      const user = await Profile.findById(comment.userId, 'name email avatar').lean();
      return {
        ...comment,
        user: user || { name: 'Unknown', email: 'N/A', avatar: null }, // Fallback if user not found
      };
    }));

    res.status(200).json({ comments: commentsWithUserDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch task comments' });
  }
};
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

// Controller to get the name of the user by ID
exports.getProjectCreatorName = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the profile by ID and return only the 'name' field
    const profile = await Profile.findById(id).select('name');

    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ name: profile.name });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};