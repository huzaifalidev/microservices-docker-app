const Admin = require("../Models/Admin");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Portfolio = require("../Models/Portfolio");
const Task = require("../Models/Task");
const jwt = require("jsonwebtoken");
const ServiceProvider = require("../Models/ServiceProvider");
const Client = require("../Models/Client");
const sendNotification = require('../Controllers/Notification');
const signInAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminFound = await Admin.findOne({ email });
    if (!adminFound) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      adminFound.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: adminFound._id, email: adminFound.email },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      status: 200,
      message: "Admin logged in successfully",
      token: token,
      admin: adminFound,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const signUpAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(409)
        .json({ status: 409, message: "Admin already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, password: hashedPassword });
    await admin.save();
    res.status(200).json({
      status: 200,
      message: "Admin created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();
    const resetUrl = `${process.env.FRONTEND_URL}/taskMate/Admin/ResetPassword/${user.resetPasswordToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "TaskMate Password Reset Link",
      html: `
        <h1>Password Reset Request</h1>
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password. Please click the link below to reset your password:</p>
        <a href="${resetUrl}" style="
          background-color: #0025CC;
          border: none;
          color: white;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          cursor: pointer;
          border-radius: 4px;
        ">Reset Password</a>
        <p>This link is valid for 15 minutes only.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      message: "Password reset link sent",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const admin = await Admin.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpires");

  if (!admin) {
    return res.status(400).json({ message: "Invalid Token or expired token" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  admin.password = hashedPassword;
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpires = undefined;
  await admin.save();
  res.status(200).json({ message: "Password Updated" });
};

const acceptPortfolio = async (req, res) => {
  try {
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { serviceProviderId: req.params.serviceProviderId },
      { portfolioStatus: "approved" },
      { new: true }
    );
    updatedPortfolio.notifications.push({
      status: 1,
      title: "Portfolio Approved",
      message: `Your portfolio has been approved by the admin`,
    });
    await updatedPortfolio.save();
    res.status(200).json({
      message: `Portfolio ${updatedPortfolio.portfolioStatus} successfully`,
      portfolioId: updatedPortfolio.serviceProviderId,
      name: updatedPortfolio.serviceProviderName,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const acceptTask = async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params._id },
      { taskStatus: "approved" },
      { new: true }
    );
    updatedTask.notifications.push({
      status: 1,
      title: "Task Approved",
      message: `Your task has been approved by the admin`,
    });
    await updatedTask.save();
    res.status(200).json({
      message: `Task ${updatedTask.taskStatus} successfully`,
      clientName: updatedTask.clientName,
      taskId: updatedTask._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getPortfolios = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Authorization check
    if (!req.admin) {
      return res.status(403).json({
        status: 403,
        message: "Unauthorized access",
      });
    }

    const query = {};
    const sortObject = {};

    // Filter by portfolioStatus if provided
    if (req.query.portfolioStatus) {
      query.portfolioStatus = req.query.portfolioStatus;
    }

    // Sorting by averageRating
    if (req.query.sortBy === "highest") {
      sortObject.averageRating = -1;
    } else if (req.query.sortBy === "lowest") {
      sortObject.averageRating = 1;
    }

    // Sorting by submittedAt
    if (req.query.time === "newest") {
      sortObject.submittedAt = -1;
    } else if (req.query.time === "oldest") {
      sortObject.submittedAt = 1;
    }

    // Default fallback: if no sorting params, sort by submittedAt desc
    if (Object.keys(sortObject).length === 0) {
      sortObject.submittedAt = -1;
    }

    // Count total
    const totalCount = await Portfolio.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch data
    const allPortfolios = await Portfolio.find(query)
      .sort(sortObject)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: 200,
      message: allPortfolios.length > 0 ? "Portfolios fetched successfully" : "No portfolios found",
      portfolios: allPortfolios,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};


const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    const sortObject = {};

    if (req.query.taskStatus) {
      query.taskStatus = req.query.taskStatus;
    }

    if (req.query.sortBy === "highest") {
      sortObject.fare = -1;
    } else if (req.query.sortBy === "lowest") {
      sortObject.fare = 1;
    }

    if (req.query.time === "newest") {
      sortObject.timeSubmitted = -1;
    } else if (req.query.time === "oldest") {
      sortObject.timeSubmitted = 1;
    }

    if (Object.keys(sortObject).length === 0) {
      sortObject.timeSubmitted = -1;
    }

    if (!req.admin) {
      return res.status(403).json({
        status: 403,
        message: "Unauthorized access",
      });
    }

    const totalCount = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const allTasks = await Task.find(query)
      .sort(sortObject)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: 200,
      message: allTasks.length > 0 ? "Tasks fetched successfully" : "No tasks found",
      tasks: allTasks,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


const modifyPortfolio = async (req, res) => {
  try {
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { serviceProviderId: req.params.serviceProviderId },
      { portfolioStatus: "modify" },
      { new: true }
    );
    updatedPortfolio.notifications.push({
      status: 0,
      title: "Portfolio Modify",
      message: `Requested to modify your portfolio !`,
    });
    await updatedPortfolio.save();
    res.status(200).json({
      message: `Portfolio ${updatedPortfolio.portfolioStatus} successfully`,
      portfolioId: updatedPortfolio.serviceProviderId,
      name: updatedPortfolio.serviceProviderName,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const modifyTask = async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params._id },
      { taskStatus: "modify" },
      { new: true }
    );
    updatedTask.notifications.push({
      status: 0,
      title: "Task Modified",
      message: `Requested to modify your task !`,
    });
    await updatedTask.save();
    res.status(200).json({
      message: `Task ${updatedTask.taskStatus} successfully`,
      clientName: updatedTask.clientName,
      _id: updatedTask._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const adminInfo = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      a;
      return res.status(404).json({
        status: 404,
        message: "Admin not found",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Admin fetched successfully",
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { taskStatus } = req.body;
    if (!req.admin) {
      return res.status(403).json({
        status: 403,
        message: "Unauthorized access",
      });
    }

    if (
      !["pending", "in-progress", "approved", "modify", "completed"].includes(
        taskStatus
      )
    ) {
      return res.status(400).json({
        status: 400,
        message: "Invalid task approval status",
      });
    }
    const updatedTask = await Task.findByIdAndUpdate(
      { _id: taskId },
      { taskStatus },
      { new: true }
    );
    const task_client = await Client.findById(updatedTask.clientId);
    if (!updatedTask) {
      return res.status(404).json({
        status: 404,
        message: "Task not found",
      });
    }
    const playerId = task_client.playerId;
    if (taskStatus === "modify") {
      updatedTask.notifications.push({
        type: "TASK_MODIFIED_BY_ADMIN",
        taskId: taskId,
      });
      await sendNotification(playerId, "Modify Task", "Modify Task Request.", "notification");
    } else if (taskStatus === "approved") {
      updatedTask.notifications.push({
        type: "TASK_APPROVED_BY_ADMIN",
         taskId: taskId,
      });
      await sendNotification(playerId, "Task Approved", "Your task has been approved by the admin.", "notification");
    } else if (taskStatus === "completed") {
      updatedTask.notifications.push({
        type: "TASK_COMPLETED_BY_ADMIN",
         taskId: taskId,
      });
      await sendNotification(playerId, "Task Completed", "Your task has been completed by the admin.", "notification");
    } else if (taskStatus === "in-progress") {
      updatedTask.notifications.push({
        type: "TASK_IN_PROGRESS_BY_ADMIN",
         taskId: taskId,
      });
      await sendNotification(playerId, "Task In Progress", "Your task is in progress by the admin.", "notification");
    } else if (taskStatus === "pending") {
      updatedTask.notifications.push({
        type: "TASK_PENDING_BY_ADMIN",
         taskId: taskId,
      });
      await sendNotification(playerId, "Task Pending", "Your task is pending by the admin.", "notification");
    }
    await updatedTask.save();
    return res.status(200).json({
      status: 200,
      message: `Task ${taskStatus} successfully`,
      task: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const servicePorviderProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await ServiceProvider.findOne(
      { _id: id },
      {
        password: 0,
        otp: 0,
      }
    );
    if (!profile) {
      return res.status(404).json({
        status: 404,
        message: "Profile not found",
      });
    }
    if (!req.admin) {
      return res.status(403).json({
        status: 403,
        message: "Unauthorized access",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Service Provider Fetched ",
      profile: profile,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const { portfolioStatus } = req.body;
    if (!req.admin) {
      return res.status(403).json({
        status: 403,
        message: "Unauthorized access",
      });
    }

    if (!["pending", "approved", "modify"].includes(portfolioStatus)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid portfolio approval status",
      });
    }
    const portfolio = await Portfolio.findByIdAndUpdate(
      { _id: id },
      { portfolioStatus },
      { new: true }
    );
    const serviceProvider = await ServiceProvider.findById(portfolio.serviceProviderId);
    const playerId = serviceProvider.playerId;
    if (portfolioStatus === "modify") {
      portfolio.notifications.push({
        type: "PORTFOLIO_MODIFIED_BY_ADMIN",
      });
      await sendNotification(playerId, "Portfolio Modified", "Your portfolio has been requested for modification by the admin.", "notification");
    } else if (portfolioStatus === "approved") {
      portfolio.notifications.push({
        type: "PORTFOLIO_APPROVED_BY_ADMIN",
      });
      await sendNotification(playerId, "Portfolio Approved", "Your portfolio has been approved by the admin.", "notification");
    } else if (portfolioStatus === "pending") {
      portfolio.notifications.push({
        type: "PORTFOLIO_PENDING_BY_ADMIN",
      });
      await sendNotification(playerId, "Portfolio Pending", "Your portfolio is pending approval by the admin.", "notification");
    }
    await portfolio.save();
    res.status(200).json({
      status: 200,
      message: `Portfolio ${portfolioStatus} successfully`,
      portfolio: portfolio,
    });

    if (!portfolio) {
      return res.status(404).json({
        status: 404,
        message: "Portfolio not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const dashboard_details = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(403).json({
        status: 403,
        message: "Unauthorized access",
      });
    }
    const totalPortfolios = await Portfolio.countDocuments();
    const totalTasks = await Task.countDocuments();
    const totalServiceProviders = await ServiceProvider.countDocuments();
    const totalClients = await Client.countDocuments();
    const recentClients = await Client.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-password -otp");
      const recentTasks = await Task.find().select("-notifications").select("-interestedServiceProviders")
      .sort({ timeSubmitted: -1 })
      .limit(5);
      const recentServiceProviders = await ServiceProvider.find()
      .sort({ createdAt: -1 })
      .limit(5);
      const taskStatusCounts = await Task.aggregate([
        {
          $group: {
            _id: "$taskStatus",
            count: { $sum: 1 },
          },
        },
      ]);
    const taskStatusMap = {};
    taskStatusCounts.forEach((status) => {
      taskStatusMap[status._id] = status.count;
    });
    res.status(200).json({
      status: 200,
      message: "Dashboard details fetched successfully",
      data: {
        totalPortfolios: totalPortfolios,
        totalTasks: totalTasks,
        totalServiceProviders: totalServiceProviders,
        totalClients: totalClients,
        recentClients: recentClients,
        recentTasks: recentTasks,
        recentServiceProviders: recentServiceProviders,
        taskStatus: taskStatusMap,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  signInAdmin,
  signUpAdmin,
  forgetPassword,
  resetPassword,
  acceptPortfolio,
  acceptTask,
  getPortfolios,
  getTasks,
  modifyPortfolio,
  modifyTask,
  adminInfo,
  updateTask,
  servicePorviderProfile,
  updatePortfolio,
  dashboard_details,
};
