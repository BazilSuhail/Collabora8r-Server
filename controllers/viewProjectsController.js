const Profile = require('../models/profile');
const Project = require('../models/projects');
const JoinProject = require('../models/joinProjects');
const AdminProject = require('../models/adminProjects'); // Ensure this model is imported

// List all projects created by the logged-in admin
exports.getCreatedProjects = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch projects created by the logged-in admin
    const adminProjects = await AdminProject.findOne({ userId }).populate('projects');
    
    if (!adminProjects) {
      return res.status(404).json({ error: 'Admin projects not found.' });
    }

    // Extract project IDs and fetch details for each project
    const projectIds = adminProjects.projects;
    const projects = await Project.find({ _id: { $in: projectIds } });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get details of a specific project
exports.getProjectDetails = async (req, res) => {
  const { projectId } = req.params; 

  try {
    const project = await Project.findById(projectId).populate('team.userId', 'email');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all users except the logged-in admin
exports.fetchUsersExcludingAdmin = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null; // Ensure req.user is available

    console.log('Fetching users excluding ID:', userId); // Log user ID

    // Fetch all users except the logged-in admin
    const users = await Profile.find(userId ? { _id: { $ne: userId } } : {}, 'email name');

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};