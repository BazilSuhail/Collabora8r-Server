const Profile = require('../models/profile');
const Project = require('../models/projects');
const AdminProject = require('../models/adminProjects');
const JoinProject = require('../models/joinProjects');
const Notification = require('../models/notifications');

// Create a new project
exports.createProject = async (req, res) => {
  const { name, description, projectManagerEmail,theme } = req.body;  
  const createdBy = req.user.id;  

  try { 
    let projectManager = {
      email: projectManagerEmail,
      status: 'Pending',
    };

    // Create a new Project document
    const newProject = new Project({
      name,
      theme,
      description,
      createdBy,
      projectManager,
    });

    await newProject.save();
 
    let adminProject = await AdminProject.findById(createdBy);

    if (!adminProject) {
      adminProject = new AdminProject({ userId: createdBy, projects: [] });
    }
 
    adminProject.projects.push(newProject._id);
    await adminProject.save();
 
    const projectManagerProfile = await Profile.findOne({ email: projectManagerEmail }); 
    if (projectManagerProfile) {
      projectManager.status = 'Pending';
 
      const notificationDoc = await Notification.findById(projectManagerProfile._id);

      // If notification document exists, add the notification
      if (notificationDoc) {
        notificationDoc.notifications.push({
          type: "projectManager",  
          data: {
            title: 'New Project Assignment',
            description: `You have been assigned as a project manager for ${name}`,
            isLink: false,
            link: '',
            from: createdBy,  
            createdAt: Date.now(),
          },
        });
        

        await notificationDoc.save();
      } else { 
        const newNotification = new Notification({
          _id: projectManagerProfile._id,
          notifications: [
            {
              type: "projectManager",  
              data: {
                title: 'New Project Assignment',
                description: `You have been assigned as a project manager for ${name}`,
                isLink: false,
                link: '',
                from: createdBy,
                createdAt: Date.now(),
              },
            }
          ],
        });

        await newNotification.save();
      } 
      projectManager.id = projectManagerProfile._id;
    } 
    else { 
      projectManager.email = '';
    }
 
    await newProject.save();
 
    res.status(201).json({
      message: 'Project created successfully!',
      project: newProject,
    });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProject = async (req, res) => {
  const { projectId } = req.params;
  const { name, description, projectManagerEmail, theme } = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { name, description, projectManagerEmail, theme },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};
