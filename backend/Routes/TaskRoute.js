const express = require("express");
const router = express.Router();
const {
  createTask,
  homeTask,
  getAllTaskClient,
  updatedTask,
  showInterest,
  notifications,
  taskStatusFun,
  acceptTask,
  getTask,
  serviceProviderInfo,
  reviewRating,
  markNotificationAsRead,
} = require("../Controllers/TaskController");
const upload = require("../config/multerConfig");
const AuthenticateUser = require("../Middlewares/Auth");
const authAdmin = require("../Middlewares/AdminAuth");

module.exports = (io) => {
  router.post("/task", upload.array("images", 5), AuthenticateUser, createTask);
  router.get("/task/home", AuthenticateUser, homeTask);
  router.get("/task/taskList", AuthenticateUser, getAllTaskClient);
  router.put(
    "/task/:id",
    upload.array("images", 5),
    AuthenticateUser,
    updatedTask
  );
  router.post("/task/interest/:taskId/:clientId", AuthenticateUser, showInterest(io));
  router.get("/alerts", AuthenticateUser, notifications);
  // router.put("/tasks/:taskId/status", AuthenticateUser, taskStatusFun);
  router.get("/task/accept/:taskId/:spId", AuthenticateUser, acceptTask);
  router.patch("/tasks/status/:taskId", (req, res) =>
    taskStatusFun(req, res, io)
  );
  router.get("/task/:taskId", AuthenticateUser, (req, res) => getTask(req, res, io));
  router.get("/spInfo/:spID", AuthenticateUser, serviceProviderInfo);
  router.post("/review/:taskId/:spId", AuthenticateUser, reviewRating);
  router.put("/markNotificationAsRead/:notificationId", AuthenticateUser, markNotificationAsRead);
  return router;
};
