🧩 TaskMate – Microservices-Based Task Management System
TaskMate is a modern, microservices-based task management application designed to streamline project and task handling. The application is divided into two main services:

A React.js-based frontend (Admin Portal)

A Node.js backend API service

Each service runs in its own Docker container, communicating over a shared Docker network. This setup demonstrates the power of Docker in real-world microservice architecture.

🎯 Project Goal
✅ Build and deploy a microservices application using manual Docker commands.

✅ Learn Docker networking, volumes, image optimization, and health monitoring.

✅ Push images to Docker Hub and run services without Docker Compose.

✅ Add creative enhancements using Docker’s features.

🔧 Tech Stack
🌐 Frontend (Admin Portal)
React.js

Tailwind CSS

Ant Design

ShadCN UI

React Router DOM

⚙️ Backend API
Node.js

Express.js

MongoDB

🗂️ Folder Structure

microservices-docker-app/
├── backend/
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── auth/
│   │   │       ├── Login.jsx
│   │   │       └── Register.jsx
│   ├── components/
│   ├── utils/
│   ├── App.jsx
│   └── Dockerfile

⚙️ Setup Instructions (Without Docker)

🧪 Backend

cd Backend
npm install
node server.js

💻 Frontend

cd frontend
npm install
npm run dev
