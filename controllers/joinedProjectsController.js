const Project = require('../models/projects');
const Profile = require('../models/profile');
const JoinProject = require('../models/joinProjects');


// Optimized fetch projects joined by a user
exports.getJoinedProjects = async (req, res) => {
    try {
        const userId = req.user.id;
        const joinProjectDoc = await JoinProject.findById(userId).select('projects');

        if (!joinProjectDoc) {
            return res.status(404).json({ error: 'No joined projects found for this user.' });
        }

        const projectIds = joinProjectDoc.projects; // Array of project ObjectIds

        // Use Promise.all to process all projects in parallel
        const joinedProjects = await Promise.all(
            projectIds.map(async (projectId) => {
                const project = await Project.findById(projectId)
                    .select('name description createdBy projectManager theme tasks team') // Fetch only required fields
                    .lean(); // Convert Mongoose document to plain JS object

                if (!project) return null;

                // Fetch the admin (createdBy) details from the Profile collection
                const adminProfile = await Profile.findById(project.createdBy)
                    .select('name avatar')
                    .lean();

                return {
                    _id:project._id,
                    name: project.name,
                    projectManager:project.projectManager,
                    theme: project.theme,
                    description: project.description,
                    createdBy: adminProfile ? { name: adminProfile.name, avatar: adminProfile.avatar } : null,
                    taskCount: project.tasks.length,
                    teamCount: project.team.length,
                };
            })
        );

        // Filter out any null projects (in case a projectId is invalid or deleted)
        const filteredProjects = joinedProjects.filter(Boolean);
        //console.log(filteredProjects)\
        res.status(200).json(filteredProjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while fetching joined projects' });
    }
};

// Optimized fetch projects joined by a user
exports.getJoinedProjectsAsManager = async (req, res) => {
    try {
        const userId = req.user.id;
        const joinProjectDoc = await JoinProject.findById(userId).select('asManager');

        if (!joinProjectDoc) {
            return res.status(404).json({ error: 'No joined projects found for this user.' });
        }

        const projectIds = joinProjectDoc.asManager; // Array of project ObjectIds

        // Use Promise.all to process all projects in parallel
        const joinedProjects = await Promise.all(
            projectIds.map(async (projectId) => {
                const project = await Project.findById(projectId)
                    .select('name description createdBy projectManager theme tasks team') // Fetch only required fields
                    .lean(); // Convert Mongoose document to plain JS object

                if (!project) return null;

                // Fetch the admin (createdBy) details from the Profile collection
                const adminProfile = await Profile.findById(project.createdBy)
                    .select('name avatar')
                    .lean();

                return {
                    _id:project._id,
                    name: project.name,
                    projectManager:project.projectManager,
                    theme: project.theme,
                    description: project.description,
                    createdBy: adminProfile ? { name: adminProfile.name, avatar: adminProfile.avatar } : null,
                    taskCount: project.tasks.length,
                    teamCount: project.team.length,
                };
            })
        );

        // Filter out any null projects (in case a projectId is invalid or deleted)
        const filteredProjects = joinedProjects.filter(Boolean);
        //console.log(filteredProjects)\
        res.status(200).json(filteredProjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while fetching joined projects' });
    }
};

exports.getProjectDetails = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Fetch the project details by ID
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if the team is empty or undefined
        if (!project.team || project.team.length === 0) {
            return res.status(200).json({
                project,
                teamDetails: 'No team members found for this project.'
            });
        }

        // Fetch profiles one by one using findById
        const profilePromises = project.team.map(userId =>
            Profile.findById(userId).select('name email avatar')
        );


        // Resolve all promises
        const profiles = await Promise.all(profilePromises);

        // Map profiles to their IDs for quick lookup
        const profileMap = profiles.reduce((map, profile) => {
            if (profile) { // Ensure profile is not null
                map[profile._id.toString()] = profile;
            }
            return map;
        }, {});
        const populatedTeam = project.team.map(userId => {
            const profile = profileMap[userId.toString()];
            return {
                _id: userId,
                name: profile ? profile.name : 'Name not found',
                email: profile ? profile.email : 'Email not found',
                avatar: profile ? profile.avatar : 'Avatar not found'
            };
        });

        //console.log(populatedTeam)
        res.status(200).json({
            project: {
                ...project._doc,
                team: populatedTeam
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while fetching project details' });
    }
};

// Fetch team members for a project
exports.getTeamMembers = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId).populate('team.userId');
        if (!project) {
            return res.status(404).json({ error: 'Project not found.' });
        }

        const teamMembers = project.team.map(member => member.userId);
        res.status(200).json(teamMembers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch team members.' });
    }
};
