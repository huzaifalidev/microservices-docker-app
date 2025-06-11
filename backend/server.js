const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const socketIO = require("socket.io");
const Task = require("./Models/Task");
const sendNotification = require('./Controllers/Notification');
dotenv.config();
const connectDB = require("./utils/connection");
const Messaging = require("./Models/Messaging");
connectDB();
const Client = require("./Models/Client");
const app = express();
const server = http.createServer(app);

const io = socketIO(5002, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const intervalId = setInterval(() => {
    const currentTime = new Date().toLocaleTimeString();
    socket.emit("time", currentTime);
  }, 1000);

  socket.on("send_message", async ({
    senderId,
    receiverId,
    content,
    taskId,
    senderRole
  }) => {
    try {
      const message = {
        senderId,
        receiverId,
        content,
        taskId,
        senderRole,
        status: "sent",
      };
      const savedMessage = await Messaging.create(message);
      io.emit("new_message", savedMessage);
      if (senderRole === "serviceProvider") {
        const client = await Client.findById({ _id: receiverId });
        console.log("name:", client.name);
        await sendNotification(
          client.playerId,
          "New message from taskMate",
          `${senderRole} sent you a new message: ${content}`,
          'message'
        );
      } else if (senderRole === "client") {
        const serviceProvider = await ServiceProvider.findById({ _id: receiverId });
        await sendNotification(
          serviceProvider.playerId,
          "New message from TaskMate",
          `${senderRole} sent you a new message: ${content}`,
          'message'
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Server error" });
    }
  });

  socket.on("get_previous_messages", async ({ senderId, receiverId }) => {
    try {
      const messages = await Messaging.find({
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }).sort({ createdAt: 1 });
      socket.emit("previous_messages", messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      socket.emit("error", { message: "Server error" });
    }
  });

  socket.on(
    "updateTaskStatus",
    async ({ taskId, newStatus, serviceProviderId }) => {
      try {
        const updatedTask = await Task.findByIdAndUpdate(
          taskId,
          { taskStatus: newStatus },
          { new: true }
        );

        if (!updatedTask) {
          socket.emit("error", { message: "Task not found" });
          return;
        }

        socket.emit("taskStatusUpdated", { taskId, newStatus });
        if (newStatus === "in-progress") {
          updatedTask.notifications.push({
            serviceProviderId: serviceProviderId,
            taskId: taskId,
            type: "VIEW_PROGRESS_TASK",
          });
          const client = await Client.findById(updatedTask.clientId);
          await sendNotification(
            client.playerId,
            "Task Status Updated",
            `Your task with is now in progress.`,
            'notification'
          );
          await updatedTask.save();
        } else if (newStatus === "completed") {
          updatedTask.notifications.push({
            serviceProviderId: serviceProviderId,
            taskId: taskId,
            type: "TASK_COMPLETED",
          });
          const client = await Client.findById(updatedTask.clientId);
          await sendNotification(
            client.playerId,
            "Task Status Updated",
            `Your task with title ${updatedTask.title} is now completed.`,
            'notification'
          );
          await sendNotification(
            client.playerId,
            "Give Feedback",
            `Please provide feedback for the completed task: ${updatedTask.title}.`,
            'notification',
            1
          );
          const portfolio = await Portfolio.findOne({
            serviceProviderId: serviceProviderId,
          });
          portfolio.completedTasks.push(taskId);
          await updatedTask.save();
          await portfolio.save();
        }
      } catch (error) {
        console.error("Error updating task status:", error);
        socket.emit("error", { message: "Server error" });
      }
    }
  );

  socket.on("getTaskStatus", async ({ taskId }) => {
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        socket.emit("error", { message: "Task not found" });
        return;
      }
      socket.emit("taskStatus", { taskId, status: task.taskStatus });
    } catch (error) {
      console.error("Error fetching task status:", error);
      socket.emit("error", { message: "Server error" });
    }
  });

  socket.on('messageRead', async ({ messageId }) => {
    try {
      const message = await Messaging.findById(messageId);
      if (!message) {
        socket.emit('error', { message: 'Message not found' });
        return;
      }
      message.status = 'read';
      await message.save();

      io.emit('messageStatusUpdated', { messageId, status: 'read' });
    } catch (error) {
      console.error('Error updating message status:', error);
      socket.emit('error', { message: 'Server error' });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    clearInterval(intervalId);
  });
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

const adminRoute = require("./Routes/AdminRoute");
app.use("/taskMate/admin", adminRoute);

const userRoute = require("./Routes/UserRoute");
app.use("/taskMate", userRoute);

const taskRoute = require("./Routes/TaskRoute");
app.use("/taskMate", taskRoute(io));

const portfolioRoute = require("./Routes/PortfolioRoute");
const Portfolio = require("./Models/Portfolio");
const ServiceProvider = require("./Models/ServiceProvider");
app.use("/taskMate", portfolioRoute);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Test route is working!" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});