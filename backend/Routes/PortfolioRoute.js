const express = require("express");
const router = express.Router();
const {
  createPortfolio,
  updatePortfolio,
  getPortfolio,
  getPortfolioCLient,
  serviceProviderCompletedTasks,
} = require("../Controllers/PortfolioController");
const upload = require("../config/multerConfig_portfolio");
const AuthenticateUser = require("../Middlewares/Auth");
const { get_messages } = require("../Controllers/Messaging_controller");

router.post("/portfolio", upload, AuthenticateUser, createPortfolio);

router.get("/portfolio", AuthenticateUser, getPortfolio);
router.put("/portfolio", upload, AuthenticateUser, updatePortfolio);
router.get(
  "/portfolio/:serviceProviderId",
  AuthenticateUser,
  getPortfolioCLient
);
router.get(
  "/portfolio/completed/tasks",
  AuthenticateUser,
  serviceProviderCompletedTasks
);

router.get(
  "/messages",
  AuthenticateUser,
  get_messages
);
module.exports = router;
