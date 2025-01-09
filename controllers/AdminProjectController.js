const Profile = require('../models/profile');
const Project = require('../models/projects');
const JoinProject = require('../models/joinProjects');
const Task = require('../models/tasks');
const AdminProject = require('../models/adminProjects');  

// List all projects created by the logged-in admin
exports.getCreatedProjects = async (req, res) => {
  const userId = req.user.id; // Logged-in admin's user ID

  try {
    // Find the AdminProject document using findById with the userId
    const adminProjects = await AdminProject.findById(userId);

    if (!adminProjects) {
      return res.status(404).json({ error: 'Admin projects not found.' });
    }

    // Retrieve all projects from the Project collection using the project IDs
    const projects = await Promise.all(
      adminProjects.projects.map(async (projectId) => {
        const project = await Project.findById(projectId);
        return project;
      })
    );

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Get details of a specific project
exports.getProjectDetails = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    } 
    
    const teamDetails = await Promise.all(
      project.team.map(async (member) => {
        const userProfile = await Profile.findById(member).select('name email avatar -_id');
        return userProfile || null;
      })
    ); 
    // Filter out null entries in case a user profile is missing
    const filteredTeam = teamDetails.filter((member) => member !== null);
    const taskCount = project.tasks.length;

    const taskDetails = await Promise.all(
      project.tasks.slice(0, 5).map(async (taskId) => {
        const task = await Task.findById(taskId, 'title priority dueDate -_id');
        return task || null;
      })
    );

    const filteredTasks = taskDetails.filter((task) => task !== null);
    const projectDetails = {
      ...project.toObject(),
      team: filteredTeam,
      taskCount,
      tasks: filteredTasks,
    };

    res.status(200).json(projectDetails);
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const mongoose = require('mongoose');

exports.searchUserByEmail = async (req, res) => {
  try {
    const { email, projectId } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required.' });
    }

    // Find the user by email
    const user = await Profile.findOne({ email }).select('name email avatar');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Find the project and its team array
    const project = await Project.findById(projectId).select('team');
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Check if the user's ID exists in the team array
    const isUserInTeam = project.team.some(
      (memberId) => memberId.toString() === user._id.toString()
    );
    if (isUserInTeam) {
      return res.status(400).json({ error: 'User is already added to the team.' });
    }

    // If not, return the user details
    res.status(200).json({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error('Error searching user by email:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.addUserToProjectInvitation = async (req, res) => {
  //const { projectId } = req.params;
  const senderUserId = req.user.id;
  const { userId, projectId } = req.body;
  //console.log(userId)
  try {
    const notificationDoc = await Notification.findById(userId);
    console.log(notificationDoc)
    notificationDoc.notifications.push({
      type: "teamMember",
      data: {
        projectId: projectId,
        from: senderUserId,
        description: "New project invitation",

        createdAt: Date.now(),
      },
    });
    await notificationDoc.save();

    res.status(200).json({ message: 'Invitation sent' });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add user to project team.' });
  }
};