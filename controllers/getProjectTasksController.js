const Project = require('../models/projects'); // Assuming Project model exists
const Task = require('../models/tasks'); // Assuming Task model exists
const Profile = require('../models/profile'); // Assuming Profile model exists

// Get tasks for a project by project ID
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find project by ID
    const project = await Project.findById(projectId).populate('tasks');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Fetch tasks and their assigned users
    const tasksWithUsers = await Promise.all(
      project.tasks.map(async (taskId) => {
        const task = await Task.findById(taskId); // Get task details
        if (!task) return null;

        const user = await Profile.findById(task.assignedTo); // Get user details
        if (!user) return null;

        return {
          task,
          user: {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
          },
        };
      })
    );

    // Filter out null tasks (in case any are not found)
    const validTasks = tasksWithUsers.filter(taskData => taskData !== null);

    res.status(200).json({ project, tasks: validTasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTaskDetails = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

