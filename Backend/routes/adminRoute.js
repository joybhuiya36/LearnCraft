const express = require("express");
const routes = express();
const adminController = require("../controller/adminController");
const { authentication, isAdmin } = require("../middleware/auth");

routes.post(
  "/sub-approve",
  authentication,
  isAdmin,
  adminController.approveSubscription
);
routes.post(
  "/sub-reject",
  authentication,
  isAdmin,
  adminController.rejectSubcription
);
routes.post(
  "/course-approve",
  authentication,
  isAdmin,
  adminController.approveCourse
);

module.exports = routes;
