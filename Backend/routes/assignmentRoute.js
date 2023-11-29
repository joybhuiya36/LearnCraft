const express = require("express");
const routes = express();
const assignmentController = require("../controller/assignmentController");
const upload = require("multer")();

routes.post(
  "/upload",
  upload.single("assignment"),
  assignmentController.assignAssignment
);
routes.post(
  "/submit",
  upload.single("assignment"),
  assignmentController.assignmentSubmit
);
routes.get(`/check/:userId/:contentId`, assignmentController.assignmentCheck);

module.exports = routes;
