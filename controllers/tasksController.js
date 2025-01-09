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
      assignedTo,
      dueDate,
      projectId
    });

    const savedTask = await newTask.save();
    //console.log(savedTask)

    await Project.findByIdAndUpdate(projectId, {
      $push: { tasks: savedTask._id }
    });

    // Create or update AssignedTask document for the user
    if (assignedTo) {
      let assignedTask = await AssignedTask.findById(assignedTo);

      console.log(savedTask._id)
      if (!assignedTask) {
        // Create a new AssignedTask document if it doesn't exist
        assignedTask = new AssignedTask({
          userId: assignedTo,
          assignTasks: [savedTask._id]
        });
        await assignedTask.save();

        // Update the user's profile with the AssignedTask document's ID
        await Profile.findByIdAndUpdate(assignedTo, {
          $set: { assignedTasks: assignedTask._id }
        });
      }
      else {
        // Add the new task ID to the existing AssignedTask document
        assignedTask.assignTasks.push(savedTask._id);
        await assignedTask.save();

        // Check if the AssignedTask document's ID is already stored in the user's profile
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

    const tasks = await Task.find({ projectId }).populate('assignedTo', 'email');

    res.status(200).json(tasks);
  } catch (err) {
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
  const { title, description, assignedTo } = req.body;

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

    // Remove task from assigned user's assigned tasks
    await AssignedTask.findByIdAndUpdate(
      task.assignedTo, // Assuming `task.assignedTo` is the _id of the AssignedTask document
      { $pull: { assignTasks: taskId } },
      { new: true } // Return the updated document
    );

    await Project.findByIdAndUpdate(
      task.projectId,
      { $pull: { tasks: taskId } },
    );

    // Finally, delete the task itself
    await Task.findByIdAndDelete(taskId);
    //await Task.deleteOne({ _id: taskId });

    res.status(200).json({ message: 'Task deleted successfully.' });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task.' });
  }
};