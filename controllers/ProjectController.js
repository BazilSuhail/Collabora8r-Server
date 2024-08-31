// controllers/projectController.js
const Profile = require('../models/profile');
const Project = require('../models/projects');
const AdminProject = require('../models/adminProjects');
const JoinProject = require('../models/joinProjects');

// Create a new project
exports.createProject = async (req, res) => {
  const { name, description, projectManager } = req.body;
  const createdBy = req.user.id; // Admin user ID

  try {
    // Create a new Project document
    const newProject = new Project({
      name,
      description,
      createdBy,
      projectManager
    });

    await newProject.save();

    // Find or create the AdminProject document
    let adminProject = await AdminProject.findOne({ userId: createdBy });

    if (!adminProject) {
      adminProject = new AdminProject({ userId: createdBy, projects: [] });
    }

    // Add the project ID to the AdminProject document
    adminProject.projects.push(newProject._id);
    await adminProject.save();

    // Update the admin's profile with the AdminProject document ID
    const adminProfile = await Profile.findById(createdBy);
    if (!adminProfile) {
      return res.status(404).json({ error: 'Admin profile not found' });
    }

    adminProfile.adminProjects = adminProject._id;
    await adminProfile.save();

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Join an existing project
exports.joinProject = async (req, res) => {
  const { projectId } = req.body; // Project ID to join
  const userId = req.user.id;

  try {
    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Add the user to the project team
    if (!project.team.some(member => member.userId.toString() === userId)) {
      project.team.push({ userId, role: 'Team Member' });
      await project.save();
    }

    // Find or create the JoinProject document
    let joinProject = await JoinProject.findOne({ userId });

    if (!joinProject) {
      joinProject = new JoinProject({ userId, projects: [] });
    }

    // Add the project ID to the JoinProject document
    if (!joinProject.projects.includes(projectId)) {
      joinProject.projects.push(projectId);
      await joinProject.save();
    }

    // Update the user's profile with the JoinProject document ID
    const userProfile = await Profile.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    userProfile.joinedProjects = joinProject._id;
    await userProfile.save();

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Profile.find({}, '_id email');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};