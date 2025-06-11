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



# Stage 1 - Build
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2 - Production
FROM node:22-alpine

WORKDIR /app
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]


# Use official Node.js image
FROM node:22

WORKDIR /app

# Copy only package.json and install inside container
COPY package*.json ./
RUN npm install

# Now copy the rest of your backend code
COPY . .

# Optional: Expose port (if using localhost testing)
EXPOSE 5001

CMD ["node", "server.js"]



## Creative Feature: Simulated Load Balancing

To showcase Docker's flexibility and scalability, we implemented a simulated load balancing feature by running multiple frontend containers on different ports.

### Purpose:
This demonstrates how microservices can scale horizontally by adding more instances, which is a common practice in production systems to handle increased traffic and ensure high availability.

### How It Was Implemented:
We used Docker's networking to run a second instance of the frontend service:

```bash
docker run -d \
  --name frontend-container-2 \
  --network app-network \
  -p 3001:3000 \
  taskmate-frontend


  docker pull huzaifali48/taskmate-backend:v1
docker pull huzaifali48/taskmate-frontend:v1
