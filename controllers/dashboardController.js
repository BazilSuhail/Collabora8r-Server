const AssignedTasks = require('../models/assignTasks');
const Tasks = require('../models/tasks');
const Project = require('../models/projects');
const AdminProject = require('../models/adminProjects');
const JoinProject = require('../models/joinProjects');

exports.fetchAssignedTasks = async (req, res) => {
  try {
    const userId = req.user.id;

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
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching assigned tasks' });
  }
};

exports.fetchProgressOverview = async (req, res) => {
  try {
    const userId = req.user.id; 
    
    const assignedTasksDoc = await AssignedTasks.findById(userId);
    if (!assignedTasksDoc) {
      return res.status(404).json({ error: 'No assigned tasks found' });
    }

    const adminProjects = await AdminProject.findById(userId).select('projects -_id');
    if (!assignedTasksDoc) {
      return res.status(404).json({ error: 'No assigned tasks found' });
    }

    const joinedProjects = await JoinProject.findById(userId).select('asManager projects -_id');
    if (!assignedTasksDoc) {
      return res.status(404).json({ error: 'No assigned tasks found' });
    }
 
    const taskIds = assignedTasksDoc.assignTasks;

    // Fetch all tasks using Promise.all and map with findById
    const tasks = await Promise.all(
      taskIds.map(async (taskId) => {
        const task = await Tasks.findById(taskId).select('title progress status');
        return task; // Return only title and progress
      })
    );
    const projectCounts = {
      adminProjectsCount: adminProjects.projects.length,
      joinedProjectsCount: joinedProjects.projects.length,
      managerProjectCount: joinedProjects.asManager.length,
    } 
    
    res.status(200).json({
      projectCounts,
      tasks
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching assigned tasks' });
  }
};

