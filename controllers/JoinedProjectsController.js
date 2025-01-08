const Project = require('../models/projects');
const Profile = require('../models/profile');
const JoinProject = require('../models/joinProjects');


// Fetch projects joined by a user
exports.getJoinedProjects = async (req, res) => {
    try {
        const userId = req.user.id; // This comes from the authenticateUser middleware 

        // Fetch the profile of the logged-in user
        /*const profile = await Profile.findById(userId).populate('joinedProjects');

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
*/
        // Fetch the JoinProject document referenced in profile.joinedProjects
        const joinProjectDoc = await JoinProject.findById(userId);

        if (!joinProjectDoc) {
            return res.status(404).json({ error: 'N sa  o joined projects found for this user.' });
        }

        // Fetch all projects using the project IDs stored in the joinProjectDoc.projects array
        const joinedProjects = await Project.find({
            _id: { $in: joinProjectDoc.projects }
        }).populate('team.userId', 'name email'); // Populate team member details if needed

        res.status(200).json(joinedProjects);
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
