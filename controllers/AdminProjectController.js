const Profile = require('../models/profile');
const Project = require('../models/projects');
const JoinProject = require('../models/joinProjects');
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
    const project = await Project.findById(projectId).populate('team.userId', 'email');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
 