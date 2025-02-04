## Collabora8r's Server
**Collabora8r** a project collaboration and managment tool built using MERN stack aimed to enhance team collaboration, streamline task management, improved workflow and seamless communications resulting in  improved productivity. This is the Server Side of **collabora8r** built using `express-js`, `mongoDb` as a database `jwt-auth` for authentication of users and `socket-io` for real time exchange of notification and project updates.

</br>

[![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](#)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat&label=Contributions&colorA=red&colorB=black	)](#)

### Project Description
Collabor8r is a **MERN stack** based project management tool designed to streamline team collaboration, task management, and project tracking. With real-time notifications powered by `Socket.IO`, it ensures seamless communication, instant updates, and enhanced productivity for teams of all sizes. Keep your projects on track with intuitive workflows and advanced features. User authentication and secure access are managed using JWT (JSON Web Tokens), providing a reliable and scalable solution for verifying user identities. The backend, built on Node.js and Express.js, handles routing, middleware, and database interactions, ensuring fast and efficient data processing for all users.

### 🤖 Tech Stack 
<a href="#"> 
<img alt="JavaScript" src="https://img.shields.io/badge/javascript%20-%23323330.svg?&style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/>   
<img alt="Node js" src="https://img.shields.io/badge/Node.js-%23339933.svg?&style=for-the-badge&logo=node.js&logoColor=white"/> 
<img alt="Express js" src="https://img.shields.io/badge/Express.js-%23000000.svg?&style=for-the-badge&logo=express&logoColor=white"/>   
<img alt="MongoDB" src ="https://img.shields.io/badge/MongoDB-%234ea94b.svg?&style=for-the-badge&logo=mongodb&logoColor=white"/> 
 <img alt="JWT Auth" src="https://img.shields.io/badge/JWT%20Auth-%23F7B731.svg?&style=for-the-badge&logo=json-web-tokens&logoColor=white"/>

<img alt="Socket.IO" src="https://img.shields.io/badge/Socket.IO%20-%23010101.svg?&style=for-the-badge&logo=socket.io&logoColor=white"/>
 </a>
 

---
- Check out the latest demo of Project [Collabor8r-Site](https://collbora8r.netlify.app/). 
- Find the Client Repository of this Project Here [Collabor8r-Client](https://github.com/BazilSuhail/Collabora8r-Client). 
---

### Run Locally
Clone the project using the following command:
```bash
   git clone https://github.com/BazilSuhail/Collabora8r-Server.git
```
Go to the project directory
```bash
   cd Collabor8r-Client
```
Then **Run** this command in your terminal to install all required dependancies:
```bash
   npm install
```
In the project directory, you can run:
```bash
   npm start
``` 
Runs the app in the development mode. Your server will be running at port 3001, 
Open [http://localhost:3001](http://localhost:3001) or also you can modify it in the **.env** file.

## Features
### Task Management
- **Task Creation**: Create tasks with detailed descriptions, deadlines, and priority levels.
- **Task Assignment**: Assign tasks to specific team members, track progress, and set due dates.
- **Task Status Updates**: Real-time updates on task status (e.g., In Progress, Completed) with visual indicators.


### Real Time Notifications
- **Project Invitations**: Real-time notifications for team members when invited to join a project.
- **Manager Invitations**: Instant updates for managers when assigned to oversee a project.
- **Invitation Status**: Live tracking of invitation acceptance or rejection status.

### Team Collaboration
- **Discussion Boards**: Engage in team discussions for each project, share ideas, and resolve issues via comments in a particular task. 
- **Real-time Notifications**: Receive real-time notifications for team/ project invitation or a Project Manager Role.

### Project Timelines
- **Gantt Charts**: Visualize project timelines with interactive Gantt charts.
- **Milestone Tracking**: Set and track progress to ensure projects stay on schedule.
- **Progress Reporting**: View progress against individual tasks.

### User Profile Management
- **View and Edit Profile**: Users can view and update their profile information, including full name, email, and role within the team.
- **Profile Picture Upload**: Upload and update your profile picture for a personalized user experience.

### Analytics and Reporting
- **Project Analytics**: Gain insights into project performance with data-driven analytics.
- **Task Completion Reports**: View detailed reports on task completion rates, time spent, and team productivity.

### Security and Permissions
- **Role-Based Access Control**: Define roles and permissions to ensure secure and organized access to project data.
- **Data Encryption**: All sensitive data is encrypted to protect against unauthorized access.

