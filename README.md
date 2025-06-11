# 🧩 TaskMate – Microservices-Based Task Management System

**TaskMate** is a modern, microservices-based task management application designed to streamline project and task handling. The application is divided into two main services:

- A **React.js-based frontend** (Admin Portal)
- A **Node.js backend** API service

Each service runs in its own Docker container and communicates over a shared Docker network. This setup demonstrates the power of Docker in real-world microservice architectures.

---

## 🎯 Project Goals

- ✅ Build and deploy a microservices application using manual Docker commands.
- ✅ Learn Docker networking, volumes, image optimization, and health monitoring.
- ✅ Push images to Docker Hub and run services without Docker Compose.
- ✅ Add creative enhancements using Docker’s features.

---

## 🔧 Tech Stack

### 🌐 Frontend (Admin Portal)
- React.js  
- Tailwind CSS  
- Ant Design  
- ShadCN UI  
- React Router DOM  

### ⚙️ Backend API
- Node.js  
- Express.js  
- MongoDB  

---

## 🗂️ Folder Structure

microservices-docker-app/
├── backend/
│ ├── server.js
│ ├── Dockerfile
│ └── package.json
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Dashboard.jsx
│ │ │ ├── Landing.jsx
│ │ │ ├── Tasks.jsx
│ │ │ ├── Portfolio.jsx
│ │ │ ├── Reports.jsx
│ │ │ └── auth/
│ │ │ ├── Login.jsx
│ │ │ └── Register.jsx
│ ├── components/
│ ├── utils/
│ ├── App.jsx
│ └── Dockerfile

---

## ⚙️ Setup Instructions (Without Docker)

### 🧪 Backend

cd backend
npm install
node server.js
💻 Frontend

cd frontend
npm install
npm run dev

<<<<<<< HEAD

=======
🐳 Dockerfile - Frontend
>>>>>>> 6c1a4b970164c6bcfad8da8ffa7381c8c92b7214

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

<<<<<<< HEAD

# Use official Node.js image
=======
🐳 Dockerfile - Backend
>>>>>>> 6c1a4b970164c6bcfad8da8ffa7381c8c92b7214
FROM node:22

WORKDIR /app

<<<<<<< HEAD
# Copy only package.json and install inside container
COPY package*.json ./
RUN npm install

# Now copy the rest of your backend code
COPY . .

# Optional: Expose port (if using localhost testing)
=======
# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

>>>>>>> 6c1a4b970164c6bcfad8da8ffa7381c8c92b7214
EXPOSE 5001

CMD ["node", "server.js"]


<<<<<<< HEAD

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
=======
# Build the frontend image
docker build -t taskmate-frontend ./frontend

# Build the backend image
docker build -t taskmate-backend ./backend

# Docker Images
docker images

# Create Docker Network
docker network create app-network

# Run Containers
docker run -d --name frontend-container -p 3000:3000 taskmate-frontend
docker run -d --name backend-container -p 5001:5001 taskmate-backend

# Docker Containers
docker containers

#Docker All Containers
docker ps -a

# Docker Hub Authentication
docker login

# Tag Images for Docker Hub
# Tag the frontend image
docker tag taskmate-frontend huzaifali48/taskmate-frontend:v1

# Tag the backend image
docker tag taskmate-backend huzaifali48/taskmate-backend:v1

# Push Images to Docker Hub
docker push huzaifali48/taskmate-frontend:v1
docker push huzaifali48/taskmate-backend:v1

# Docker Logs
docker logs backend-container
docker logs frontend-container

# Docker Stop & Remove Containers 
docker stop frontend-container frontend-container-2 backend-container
docker rm frontend-container frontend-container-2 backend-container

🚀 Creative Feature: Simulated Load Balancing
To showcase Docker's flexibility and scalability, we implemented a simulated load balancing feature by running multiple frontend containers on different ports.

🔍 Purpose:
This demonstrates how microservices can scale horizontally by adding more instances, a common practice in production systems to handle high traffic and ensure better availability.

🛠️ Implementation:
We launched a second instance of the frontend container manually:


docker run -d --name frontend-container-2 --network app-network -p 3001:3000 taskmate-frontend

Now, the frontend is accessible on:

http://localhost:3000 (Container 1)

http://localhost:3001 (Container 2)

This simulates a real-world load-balanced environment. You can later integrate a reverse proxy like NGINX for automated request distribution.

📦 Docker Hub Pull Commands
To pull the prebuilt Docker images:

docker pull huzaifali48/taskmate-backend:v1
>>>>>>> 6c1a4b970164c6bcfad8da8ffa7381c8c92b7214
docker pull huzaifali48/taskmate-frontend:v1
