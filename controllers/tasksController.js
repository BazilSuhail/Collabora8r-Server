const Task = require('../models/tasks');
const Profile = require('../models/profile');
const AssignedTask = require('../models/assignTasks');
const Project = require('../models/projects');

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo, projectId } = req.body;
    const newTask = new Task({
      title,
      description,
      status,
      priority,
      progress: 0,
      assignedTo,
      dueDate,
      projectId
    });

    const savedTask = await newTask.save();

    await Project.findByIdAndUpdate(projectId, {
      $push: { tasks: savedTask._id }
    });

    // Create/ update AssignedTask document for the user
    if (assignedTo) {
      let assignedTask = await AssignedTask.findById(assignedTo);

      //console.log(savedTask._id)
      if (!assignedTask) {
        assignedTask = new AssignedTask({
          userId: assignedTo,
          assignTasks: [savedTask._id]
        });
        await assignedTask.save();

        await Profile.findByIdAndUpdate(assignedTo, {
          $set: { assignedTasks: assignedTask._id }
        });
      }
      else {
        assignedTask.assignTasks.push(savedTask._id);
        await assignedTask.save();

        const profile = await Profile.findById(assignedTo);
        if (!profile.assignedTasks || !profile.assignedTasks.equals(assignedTask._id)) {
          await Profile.findByIdAndUpdate(assignedTo, {
            $set: { assignedTasks: assignedTask._id }
          });
        }
      }
    }

    res.status(201).json(savedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create task.' });
  }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId).select('tasks name team');
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const tasks = await Promise.all(
      project.tasks.map(async (taskId) => {
        const task = await Task.findById(taskId).select('-comments').lean();
        if (!task) return null;

        const assignedTo = await Profile.findById(task.assignedTo).select('-_id email name avatar').lean();
        return {
          ...task,
          assignedTo,
        };
      })
    );

    // Filter out any null tasks (in case of invalid task IDs)
    const validTasks = tasks.filter((task) => task !== null);
    const projectName = project.name;
    const projectTeam = project.team.length || 0;

    res.status(200).json({ projectName, validTasks, projectTeam });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tasks for the project.' });
  }
};


exports.getTasksByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const assignedTasks = await AssignedTask.findOne({ userId }).populate('assignTasks');

    res.status(200).json(assignedTasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tasks for the user.' });
  }
};

// Edit Task
exports.editTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, dueDate, status, priority, assignedTo } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const oldAssignTo = task.assignedTo;

    // Update task details
    task.title = title || task.title;
    task.description = description || task.description;
    task.assignedTo = assignedTo || task.assignedTo;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    await task.save();

    // If the task was reassigned to a different user
    if (assignedTo && assignedTo !== oldAssignTo) {
      // Remove task from old user's assigned tasks
      const oldUserProfile = await Profile.findById(oldAssignTo);
      if (oldUserProfile && oldUserProfile.assignedTasks) {
        await AssignedTask.updateOne(
          { _id: oldUserProfile.assignedTasks },
          { $pull: { assignTasks: taskId } }
        );
      }

      // Add task to new user's assigned tasks
      const newUserProfile = await Profile.findById(assignedTo);
      if (newUserProfile && newUserProfile.assignedTasks) {
        await AssignedTask.updateOne(
          { _id: newUserProfile.assignedTasks },
          { $addToSet: { assignTasks: taskId } }
        );
      }
    }

    res.status(200).json({ message: 'Task updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task.' });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }


    await AssignedTask.findByIdAndUpdate(
      task.assignedTo,
      { $pull: { assignTasks: taskId } },
      { new: true }
    );

    await Project.findByIdAndUpdate(
      task.projectId,
      { $pull: { tasks: taskId } },
    );

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: 'Task deleted successfully.' });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task.' });
  }
};