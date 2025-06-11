const Task = require("../Models/Task");
const Client = require("../Models/Client");
const Portfolio = require("../Models/Portfolio");
const ServiceProvider = require("../Models/ServiceProvider");
const sendNotification = require('../Controllers/Notification');
const createTask = async (req, res) => {
  try {
    const { id, role } = req.user;
    if (role !== "client") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only clients can create tasks.",
      });
    }
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }
    const { title, description, fare, deadline } = req.body;
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.path);
    }
    const newTask = new Task({
      clientId: client._id,
      clientName: client.name,
      cnicNumber: client.cnicNumber,
      title,
      description,
      fare: parseFloat(fare),
      deadline: deadline
        ? new Date(deadline)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      images,
      status: "pending",
      createdAt: new Date(),
    });

    const savedTask = await newTask.save();
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: savedTask,
    });
  } catch (error) {
    console.error("Task creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};

const getAllTaskClient = async (req, res) => {
  try {
    const { id, role } = req.user;
    if (role !== "client") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only clients can create tasks.",
      });
    }
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({
        status: 404,
        message: "Client not found.",
      });
    }
    const tasks = await Task.find({ clientId: id }).sort({ timeSubmitted: -1 });
    res.status(200).json({
      status: 200,
      message: "Tasks retrieved successfully",
      data: tasks,
    });
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve tasks",
      error: error.message,
    });
  }
};

const homeTask = async (req, res) => {
  try {
    const { id, role } = req.user;
    if (role !== "serviceProvider") {
      return res.status(401).json({
        status: 401,
        message: "You are not authorized to access this route.",
      });
    }
    const serviceProvider = await Portfolio.findOne({
      serviceProviderId: id,
    });
    if (!serviceProvider) {
      return res.status(401).json({
        status: 401,
        message: "Access denied. Portfolio not found.",
      });
    }
    if (serviceProvider && serviceProvider.portfolioStatus !== "approved") {
      return res.status(403).json({
        status: 403,
        message: "Access denied. Portfolio not approved.",
      });
    }

    const tasks = await Task.find({
      taskStatus: "approved",
      interestedServiceProviders: {
        $not: {
          $elemMatch: {
            serviceProviderId: id,
          },
        },
      },
    }).sort({ timeSubmitted: -1 }).select('title description fare images deadline clientId clientName cnicNumber createdAt').populate("clientId", "profilePicture city");
    res.status(200).json({
      status: 200,
      message: "Tasks fetched successfully",
      user: { id, role },
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: 500,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

const updatedTask = async (req, res) => {
  try {
    const { id, role } = req.user;
    if (role !== "client") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only clients can update tasks.",
      });
    }
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }
    const { title, description, fare, deadline } = req.body;
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.path);
    }
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        clientId: client._id,
        clientName: client.name,
        cnicNumber: client.cnicNumber,
        title,
        description,
        fare: parseFloat(fare),
        deadline: deadline
          ? new Date(deadline)
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        images,
        taskStatus: "pending",
        createdAt: new Date(),
      },
      { new: true }
    );
    res.status(201).json({
      status: 201,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Task update error:", error);
    res.status(500).json({
      status: 500,
      message: "Failed to update task",
      error: error.message,
    });
  }
};

const showInterest = () => async (req, res) => {
  try {
    const { taskId, clientId } = req.params;
    const { _id, role } = req.user;

    if (role !== "serviceProvider") {
      return res
        .status(403)
        .json({ message: "Only service providers can show interest." });
    }
    const client = await Client.findOne({ _id: clientId });
    console.log("Client playerId:", client.playerId);
    const playerId = client.playerId;
    const serviceProvider = await ServiceProvider.findById(_id);
    if (!serviceProvider) {
      return res.status(404).json({ message: "Service provider not found." });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const alreadyInterested = task.interestedServiceProviders.some(
      (sp) => sp.serviceProviderId.toString() === _id.toString()
    );

    if (alreadyInterested) {
      return res
        .status(400)
        .json({ message: "You have already shown interest." });
    }

    task.interestedServiceProviders.push({
      serviceProviderId: _id,
    });

    task.notifications.push({
      type: "SERVICE_PROVIDER_INTERESTED",
      serviceProviderId: _id,
      taskId: task._id,
    });
    await sendNotification(
      playerId,
      "New Task Applicant",
      `${serviceProvider.name} has shown interest in your task: ${task.title}`,
      "notification"
    );
    await task.save();
    res.status(200).json({
      message: "Interest shown and notification sent.",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const notifications = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role === "client") {
      const tasks = await Task.find({
        clientId: _id,
      }).select("notifications")
      const notifications = tasks.flatMap((task) => task.notifications);
      return res.status(200).json({
        status: 200,
        message: "Notifications Fetched",
        data: notifications.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }),
        unReadCount: notifications.filter(
          (notification) => !notification.read
        ).length,
      });
    } else if (role === "serviceProvider") {
      const portfolio = await Portfolio.findOne({
        serviceProviderId: _id,
      })
        .select("notifications")
      const decendingNotifications = portfolio.notifications.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      if (!portfolio) {
        return res.status(404).json({
          status: 404,
          message: "Portfolio not found.",
          message: "No notifications found for this service provider.",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Notifications retrieved successfully.",
        data: portfolio.notifications,
        unReadCount: decendingNotifications.filter(
          (notification) => !notification.read
        ).length,
      });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { _id, role } = req.user;
    console.log("Marking notification as read:", notificationId, "for user:", _id, "with role:", role);
    if (role === "client") {
      const task = await Task.findOne({ "notifications._id": notificationId });
      const notification = task.notifications.id(notificationId);
      if (notification) {
        console.log("Notification found:", notification);
        notification.read = true;
        await task.save();
        return res.status(200).json({
          status: 200,
          message: "Notification marked as read.",
        });
      } else {
        return res.status(404).json({
          status: 404,
          message: "Notification not found.",
        });
      }
    } else {
      const portfolio = await Portfolio.findOne({ serviceProviderId: _id }).select("notifications");
      if (!portfolio) {
        return res.status(404).json({
          status: 404,
          message: "Portfolio not found.",
        });
      }
      const notification = portfolio.notifications.id(notificationId);
      if (!notification) {
        return res.status(404).json({
          status: 404,
          message: "Notification not found.",
        });
      }
      notification.read = true;
      await portfolio.save();
      return res.status(200).json({
        status: 200,
        message: "Notification marked as read.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};


function notifyTaskStatusChange(taskId, newStatus) {
  io.emit("taskStatusUpdated", { taskId, newStatus });
}
const taskStatusFun = (io) => async (req, res) => {
  const { taskId } = req.params;
  const { taskStatus } = req.body;
  console.log("Updating task status:", taskId, taskStatus);
  console.log("Task status updated:", taskId, taskStatus);
  io.emit("taskStatusUpdated", { taskId, newStatus: taskStatus });
  res.json({ status: 200, taskId, newStatus: taskStatus });
};

const acceptTask = async (req, res) => {
  const { taskId, spId } = req.params;
  const { _id, role } = req.user;
  if (role !== "client") {
    return res.status(403).json({
      status: 403,
      message: "You are not authorized to accept this task.",
    });
  }
  try {
    const task = await Task.findById(taskId);
    const client = await Client.findById(_id);
    const serviceProvider = await ServiceProvider.findById(spId);
    const portfolio = await Portfolio.findOne({ serviceProviderId: spId });
    if (!task) {
      return res.status(404).json({
        status: 404,
        message: "Task not found.",
      });
    }

    if (!portfolio) {
      return res.status(404).json({
        status: 404,
        message: "Service provider not found.",
      });
    }
    const taskAlreadyInPortfolio = portfolio.completedTasks.some(
      (t) => t.taskId && t.taskId.toString() === taskId
    );

    // if (taskAlreadyInPortfolio) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: "Task already accepted.",
    //   });
    // }
    portfolio.notifications.push({
      type: "CLIENT_ACCEPTED_OFFER",
      clientId: task.clientId,
      taskId: taskId,
    });
    await sendNotification(
      serviceProvider.playerId,
      "Task Accepted",
      `${client.name} have accepted a offer.`,
      "notification"
    );
    await portfolio.save();
    await task.save();

    return res.status(200).json({
      status: 200,
      message: "Task accepted successfully.",
      task: task,
      portfolio: portfolio,
    });
  } catch (error) {
    console.error("Error accepting task:", error);
    res.status(500).json({
      status: 500,
      message: "Failed to accept task",
      error: error.message,
    });
  }
};
const getTask = async (req, res, io) => {
  try {
    const { taskId } = req.params;
    const { _id, role } = req.user;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const clientId = task.clientId;
    const client = await Client.findById({
      _id: clientId
    }).select("profilePicture name");
    io.emit("taskStatus", {
      taskId: task.taskId,
      status: task.taskStatus,
    });

    return res.status(200).json({ status: 200, data: task, client: client });
  } catch (error) {
    console.error("Error fetching task:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const serviceProviderInfo = async (req, res) => {
  try {
    const { clientId, role } = req.user;
    if (role !== "client") {
      return res.status(403).json({
        status: 403,
        message: "Access denied. Only client can view their info.",
      });
    }
    const { spID } = req.params;
    const serviceProvider = await ServiceProvider.findById(spID);
    if (!serviceProvider) {
      return res.status(404).json({ message: "Service provider not found" });
    }
    return res.status(200).json({ status: 200, data: serviceProvider });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

const reviewRating = async (req, res) => {
  try {
    const { taskId, spId } = req.params;
    const { rating, review } = req.body;
    const { _id, role } = req.user;
    if (role !== "client") {
      return res.status(403).json({
        status: 403,
        message: "Access denied. Only service providers can review.",
      });
    }
    console.log(taskId, spId, rating, review);
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const client = await Client.findById(_id);
    const portfolio = await Portfolio.findOne({ serviceProviderId: spId });
    const serviceProvider = await ServiceProvider.findById(spId);
    portfolio.completedTasks.push({
      taskId: taskId,
      clientId: _id,
      clientName: client.name,
      review: review,
      rating: rating,
    });
    await task.save();
    portfolio.notifications.push({
      type: "REVIEW_ADDED",
      taskId: taskId,
      clientId: _id,
    });
    await sendNotification(
      serviceProvider.playerId,
      "Review Added",
      `${client.name} have added a review.`,
      "notification"
    );
    await portfolio.save();
    return res.status(200).json({ status: 200, message: "Review Added" });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTask,
  homeTask,
  getAllTaskClient,
  updatedTask,
  showInterest,
  notifications,
  taskStatusFun,
  acceptTask,
  getTask,
  markNotificationAsRead,
  serviceProviderInfo,
  reviewRating,
};