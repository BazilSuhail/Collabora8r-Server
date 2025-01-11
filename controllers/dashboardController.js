const AssignedTasks = require('../models/assignTasks');
const Tasks = require('../models/tasks');
const Project = require('../models/projects');

exports.fetchAssignedTasks = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract user ID from the route

    // Fetch the assigned tasks document for the user
    const assignedTasksDoc = await AssignedTasks.findById(userId);
    if (!assignedTasksDoc) {
      return res.status(404).json({ error: 'No assigned tasks found' });
    }

    const taskIds = assignedTasksDoc.assignTasks;

    // Fetch all tasks based on task IDs in assignedTasks
    const tasks = await Tasks.find({ _id: { $in: taskIds } });

    // For each task, fetch the project name from the project collection
    const tasksWithProject = await Promise.all(
      tasks.map(async (task) => {
        const project = await Project.findById(task.projectId);
        return {
          ...task._doc, // Return task data along with the project name
          projectName: project ? project.name : 'No Project Assigned',
        };
      })
    );

    // Return the tasks with project info
    res.status(200).json({ tasks: tasksWithProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching assigned tasks' });
  }
};
