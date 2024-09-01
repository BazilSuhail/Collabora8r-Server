const Task = require('../models/tasks');
const Profile = require('../models/profile');
const AssignedTask = require('../models/assignTasks');
const Project = require('../models/projects');
exports.createTask = async (req, res) => {
    try {
      const { title, description, status, priority, dueDate, assignedTo, projectId } = req.body;
  
      // Create a new task
      const newTask = new Task({
        title,
        description,
        status,
        priority,
        dueDate,
        projectId
      });
  
      const savedTask = await newTask.save();
  
      // Update the project with the new task
      await Project.findByIdAndUpdate(projectId, {
        $push: { tasks: savedTask._id }
      });
  
      // Create or update AssignedTask document for the user
      if (assignedTo) {
        let assignedTask = await AssignedTask.findOne({ userId: assignedTo });
  
        if (!assignedTask) {
          assignedTask = new AssignedTask({
            userId: assignedTo,
            assignTasks: [savedTask._id]
          });
        } else {
          assignedTask.assignTasks.push(savedTask._id);
        }
  
        await assignedTask.save();
  
        // Update the user's profile with the new task ID
        await Profile.findByIdAndUpdate(assignedTo, {
          $push: { assignedTasks: savedTask._id }
        });
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
  
      const tasks = await Task.find({ projectId }).populate('assignedTo', 'email'); // Populate user details
  
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
  
  exports.updateTask = async (req, res) => {
    try {
      const { taskId } = req.params;
      const updates = req.body;
  
      const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });
  
      // Also update the assigned task details if necessary
      await AssignedTask.updateMany(
        { assignTasks: taskId },
        { $set: { 'assignTasks.$': updatedTask._id } }
      );
  
      res.status(200).json(updatedTask);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update task.' });
    }
  };
  
  exports.deleteTask = async (req, res) => {
    try {
      const { taskId } = req.params;
  
      await Task.findByIdAndDelete(taskId);
  
      // Remove task from project
      await Project.findOneAndUpdate(
        { tasks: taskId },
        { $pull: { tasks: taskId } }
      );
  
      // Remove task from user
      await Profile.updateMany(
        { assignedTasks: taskId },
        { $pull: { assignedTasks: taskId } }
      );
  
      // Remove from AssignedTask collection
      await AssignedTask.updateMany(
        {},
        { $pull: { assignTasks: taskId } }
      );
  
      res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to delete task.' });
    }
  };