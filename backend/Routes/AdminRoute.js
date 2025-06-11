const express = require("express");
const router = express.Router();
const {
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
} = require("../Controllers/Admin");
const authAdmin = require("../Middlewares/AdminAuth");

router.post("/signin", signInAdmin);
router.post("/signup", signUpAdmin);
router.post("/forgetpassword", forgetPassword);
router.post("/resetpassword", resetPassword);
router.get("/adminInfo", authAdmin, adminInfo);
router.get("/getTasks", authAdmin, getTasks);
router.get("/getPortfolios", authAdmin, getPortfolios);

router.put("/acceptTask/:_id", acceptTask);
router.put("/acceptPortfolio/:serviceProviderId", acceptPortfolio);

router.put("/modifyTask/:_id", modifyTask);
router.put("/modifyPortfolio/:serviceProviderId", modifyPortfolio);
router.put("/updateTask/:id", authAdmin, updateTask);
router.get("/sp-profile/:id", authAdmin, servicePorviderProfile);
router.put("/updatePortfolio/:id", authAdmin, updatePortfolio);
router.get("/dashboard", authAdmin, dashboard_details);


module.exports = router;
