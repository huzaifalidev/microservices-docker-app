const Portfolio = require("../Models/Portfolio");
const ServiceProvider = require("../Models/ServiceProvider");
const Task = require("../Models/Task");
const Joi = require("joi");
const portfolioSchema = Joi.object({
  aboutMe: Joi.string().min(20).required(),
  workExperience: Joi.string().required(),
  skills: Joi.string().min(1).required(),
  displayPicture: Joi.string().uri().optional(),
});

const createPortfolio = async (req, res) => {
  try {
    const { id, role } = req.user;

    // Role check
    if (role !== "serviceProvider") {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Only service providers can create a portfolio.",
      });
    }

    const serviceProvider = await ServiceProvider.findById(id);
    if (!serviceProvider) {
      return res.status(404).json({
        success: false,
        message: "Service provider not found.",
      });
    }

    // Portfolio duplication check
    const existingPortfolio = await Portfolio.findOne({
      serviceProviderId: id,
    });
    if (existingPortfolio) {
      return res.status(400).json({
        success: false,
        message:
          "Portfolio already exists. Please use update portfolio instead.",
      });
    }

    // Validate input
    const { error } = portfolioSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { aboutMe, workExperience, skills } = req.body;
    const baseUrl = `/uploads/portfolio/`;

    // Process files
    let certImagesProcessed = [];
    let cnicImagesProcessed = [];

    if (req.files?.certImages) {
      certImagesProcessed = req.files.certImages.map(
        (file) => `${baseUrl}certifications/${file.filename}`
      );
    }
    if (req.files?.cnicImages) {
      cnicImagesProcessed = req.files.cnicImages.map(
        (file) => `${baseUrl}cnic/${file.filename}`
      );
    }

    // Save new portfolio
    const newPortfolio = new Portfolio({
      serviceProviderId: id,
      serviceProviderName: serviceProvider.name,
      cnicNumber: serviceProvider.cnicNumber,
      aboutMe,
      workExperience,
      skills,
      certImages: certImagesProcessed,
      cnicImages: cnicImagesProcessed,
      portfolioStatus: "pending",
    });

    const savedPortfolio = await newPortfolio.save();

    res.status(201).json({
      success: true,
      message: "Portfolio created successfully",
      data: savedPortfolio,
    });
  } catch (error) {
    console.error("Portfolio creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create portfolio",
      error: error.message,
    });
  }
};

const getPortfolio = async (req, res) => {
  try {
    const { id, role } = req.user;
    if (role !== "serviceProvider") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only service providers can view portfolios.",
      });
    }
    const portfolio = await Portfolio.findOne({ serviceProviderId: id });
    if (!portfolio) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Portfolio not found",
      });
    }
    res.status(200).json({
      status: 200,
      data: portfolio,
      completedTasks:portfolio.completedTasks,
    });
  } catch (error) {
    console.error("Portfolio fetching error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch portfolio",
      error: error.message,
    });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const { id, role } = req.user;
    if (role !== "serviceProvider") {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Only service providers can update a portfolio.",
      });
    }
    const serviceProvider = await ServiceProvider.findById(id);
    if (!serviceProvider) {
      return res.status(404).json({
        success: false,
        message: "Service provider not found.",
      });
    }

    const existingPortfolio = await Portfolio.findOne({
      serviceProviderId: id,
    });
    if (!existingPortfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found.",
      });
    }
    const { error } = portfolioSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { aboutMe, workExperience, skills, displayPicture } = req.body;
    const baseUrl = `/uploads/portfolio/`;

    let certImagesProcessed = existingPortfolio.certImages;
    let cnicImagesProcessed = existingPortfolio.cnicImages;

    if (req.files) {
      if (req.files["certImages"]) {
        certImagesProcessed = req.files["certImages"].map(
          (file) => `${baseUrl}certifications/${file.filename}`
        );
      }
      if (req.files["cnicImages"]) {
        cnicImagesProcessed = req.files["cnicImages"].map(
          (file) => `${baseUrl}cnic/${file.filename}`
        );
      }
    }
    existingPortfolio.aboutMe = aboutMe;
    existingPortfolio.workExperience = workExperience;
    existingPortfolio.skills = skills;
    existingPortfolio.displayPicture = displayPicture;
    existingPortfolio.certImages = certImagesProcessed;
    existingPortfolio.cnicImages = cnicImagesProcessed;
    existingPortfolio.portfolioStatus = "pending";
    const updatedPortfolio = await existingPortfolio.save();
    res.status(200).json({
      success: true,
      message: "Portfolio updated successfully",
      data: updatedPortfolio,
    });
    console.log(updatedPortfolio);
  } catch (error) {
    console.error("Portfolio update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update portfolio",
      error: error.message,
    });
  }
};

const getPortfolioCLient = async (req, res) => {
  try {
    const { serviceProviderId } = req.params;
    const portfolio = await Portfolio.findOne({ serviceProviderId });
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }
    res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    console.error("Portfolio fetching error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch portfolio",
      error: error.message,
    });
  }
};

const serviceProviderCompletedTasks = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role !== "serviceProvider") {
      return res.status(403).json({
        status: 403,
        message:
          "Access denied. Only service providers can view completed tasks.",
      });
    }

    const portfolio = await Portfolio.findOne({
      serviceProviderId: _id,
    });
    if (!portfolio) {
      return res.status(404).json({
        status: 404,
        message: "Portfolio not found",
      });
    } else if (!portfolio.completedTasks || portfolio.completedTasks.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No completed tasks found for this portfolio",
      });
    } else if (portfolio.portfolioStatus !== "approved") {
      return res.status(403).json({
        status: 403,
        message: "Portfolio is still under review",
      });
    }
    const tasks = await Task.find({
      _id: { $in: portfolio.completedTasks },
    })
      .select("-notifications ")
      .select("-interestedServiceProviders")
      .select("-__v");

    res.status(200).json({
      status: 200,
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching completed tasks:", error);
    res.status(500).json({
      status: 500,
      message: "Failed to fetch completed tasks",
      error: error.message,
    });
  }
};

module.exports = {
  createPortfolio,
  updatePortfolio,
  getPortfolio,
  getPortfolioCLient,
  serviceProviderCompletedTasks,
};
