const jwt = require("jsonwebtoken");
const Client = require("../Models/Client");
const ServiceProvider = require("../Models/ServiceProvider");

const AuthenticateUser = async (req, res, next) => {
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
      user = await Client.findById(decoded.id).select("-password");
    } else if (decoded.role === "serviceProvider") {
      user = await ServiceProvider.findById(decoded.id).select("-password");
    }

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = AuthenticateUser;
