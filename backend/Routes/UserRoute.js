const express = require("express");
const router = express.Router();
const {
  userSignUp,
  userSignIn,
  getUserInfo,
  updatePassword,
  updateUserInfo,
} = require("../Controllers/UserController");
const {
  sendResetOTP,
  verifyResetOTP,
  resetPassword,
} = require("../Controllers/forgetPasswordController");
const authenticateUser = require("../Middlewares/Auth");

router.post("/signUp", userSignUp);
router.post("/signIn", userSignIn);
router.post("/forgetPassword", sendResetOTP);
router.post("/resetPassword", resetPassword);
router.post("/OTP", verifyResetOTP);
router.get("/getUserInfo", authenticateUser, getUserInfo);
router.put("/updatePassword", updatePassword);
router.put("/user", authenticateUser, updateUserInfo);

module.exports = router;
