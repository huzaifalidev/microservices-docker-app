const bcrypt = require("bcryptjs");
const Client = require("../Models/Client");
const ServiceProvider = require("../Models/ServiceProvider");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const Portfolio = require("../Models/Portfolio");
const Task = require("../Models/Task");
const Messaging = require("../Models/Messaging");
const signUpSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.min": "Name should be at least 3 characters.",
    "string.max": "Name should be at most 30 characters.",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email.",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&+_-])[A-Za-z\\d@$!%*?&+_-]+$"
      )
    )
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters.",
      "string.max": "Password must be at most 30 characters.",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "any.required": "Password is required",
    }),
  role: Joi.string().valid("client", "serviceProvider").required().messages({
    "any.only": "Invalid role",
    "any.required": "Role is required",
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be 10-15 digits.",
      "any.required": "Phone number is required",
    }),
  cnicNumber: Joi.string()
    .pattern(/^[0-9]{13}$/)
    .required()
    .messages({
      "string.pattern.base": "CNIC must be exactly 13 digits.",
      "any.required": "CNIC is required",
    }),
  city: Joi.string().min(2).max(50).required().messages({
    "string.min": "City must be at least 2 characters.",
    "string.max": "City must be at most 50 characters.",
    "any.required": "City is required",
  }),
});
const sendNotification = require('../Controllers/Notification');
const userSignUp = async (req, res) => {
  try {
    const { error } = signUpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { name, email, password, role, phoneNumber, cnicNumber, city } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existingClient = await Client.findOne({ email: normalizedEmail });
    const existingServiceProvider = await ServiceProvider.findOne({
      email: normalizedEmail,
    });

    if (existingClient || existingServiceProvider) {
      return res
        .status(409)
        .json({ message: "Email is already registered", data: { email } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser =
      role === "client"
        ? new Client({
          name,
          email: normalizedEmail,
          password: hashedPassword,
          role,
          phoneNumber,
          cnicNumber,
          city
        })
        : new ServiceProvider({
          name,
          email: normalizedEmail,
          password: hashedPassword,
          role,
          phoneNumber,
          cnicNumber,
          city
        });

    await newUser.save();
    return res.status(201).json({
      message: `${role} created successfully`,
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const userSignIn = async (req, res) => {
  const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    playerId: Joi.string().optional(),
  });

  try {
    const { error } = signInSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password, playerId } = req.body;
    const [client, serviceProvider] = await Promise.all([
      Client.findOne({ email }),
      ServiceProvider.findOne({ email }),
    ]);

    if (!client && !serviceProvider) {
      return res.status(401).json({ status: "error", message: "User not found" });
    }

    let notifications = 0;
    if (client) {
      const tasks = await Task.find({ clientId: client._id }).populate('notifications');
      if (tasks.length === 0) {
        notifications = 0;
      } else {
        notifications = tasks.reduce((count, task) => {
          if (task.notifications && task.notifications.length > 0) {
            return count + task.notifications.filter(item => item.read === false).length;
          }
          return count;
        }, 0);
      }
    } else {
      const portfolio = await Portfolio.findOne({ serviceProviderId: serviceProvider._id });
      if (!portfolio) {
        notifications = 0;
      } else if (portfolio.notifications.length === 0) {
        notifications = 0;
      } else {
        notifications = portfolio.notifications.filter(item => item.read === false).length;
      }
    }

    const user = client || serviceProvider;

    const messages = await Messaging.find({
      $or: [{ senderId: user._id }, { receiverId: user._id }]
    });

    let unreadMessagesCount = 0;
    messages.forEach(msg => {
      if (msg.receiverId.toString() === user._id.toString() && msg.status === "sent") {
        unreadMessagesCount++;
      }
    });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ status: 401, message: "Invalid password" });
    }

    if (playerId && user.playerId !== playerId) {
      user.playerId = playerId;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await sendNotification(user.playerId, "Login", `${user.name} logged in ✅`, "notification");

    if (user.role === "client") {
      return res.status(200).json({
        status: 200,
        message: `${user.name} Logged in`,
        data: user,
        token,
        notifications: notifications || 0,
        unreadMessagesCount: unreadMessagesCount || 0,
      });
    } else if (user.role === "serviceProvider") {
      const portfolio = await Portfolio.findOne({ serviceProviderId: user._id });
      return res.status(200).json({
        status: 200,
        message: `${user.name} Logged in`,
        data: user,
        portfolio,
        token,
        notifications: notifications || 0,
        unreadMessagesCount: unreadMessagesCount || 0,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const getUserInfo = async (req, res) => {
  try {
    return res.status(200).json({
      message: "User info retrieved successfully.",
      data: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Access Denied. Invalid token format.",
      });
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        status: "error",
        message: "Invalid or expired token.",
      });
    }
    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token payload.",
      });
    }
    let user;
    if (decoded.role === "client") {
      user = await Client.findById(decoded.id);
    } else if (decoded.role === "serviceProvider") {
      user = await ServiceProvider.findById(decoded.id);
    }
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }
    const isSamePassword = await bcrypt.compare(req.body.newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        status: "error",
        message: "New password cannot be the same as the current password.",
      });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Both Current and New passwords are required.",
      });
    }
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({
        status: 401,
        message: "Invalid old password.",
      });
    }
    if (user.password === newPassword) {
      return res.status(400).json({
        status: 400,
        message: "New password cannot be the same as the current password.",
      });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.status(200).json({
      status: 200,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("❌ Error updating password:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const updateUserInfo = async (req, res) => {
  try {
    const { id, role } = req.user;
    const updates = req.body;
    if (role === "client") {
      const updateCLient = await Client.findByIdAndUpdate(id, updates, {
        new: true,
      });
      if (!updateCLient) {
        return res.status(404).json({
          status: 404,
          message: "Client not found.",
        });
      }
      return res.status(200).json({
        status: 200,
        message: "User info updated successfully.",
        data: updateCLient,
      });
    } else if (role === "serviceProvider") {
      const updateServiceProvider = await ServiceProvider.findByIdAndUpdate(
        id,
        updates,
        {
          new: true,
        }
      );
      if (!updateServiceProvider) {
        return res.status(404).json({
          status: 404,
          message: "Service Provider not found.",
        });
      }
      return res.status(200).json({
        status: 200,
        message: "User info updated successfully.",
        data: updateServiceProvider,
      });
    }
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = {
  userSignUp,
  userSignIn,
  getUserInfo,
  updatePassword,
  updateUserInfo,
};
