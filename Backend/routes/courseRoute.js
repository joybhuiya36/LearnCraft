const express = require("express");
const routes = express();
const courseController = require("../controller/courseController");
const { isAdmin, authentication } = require("../middleware/auth");
const upload = require("multer")();

routes.post("/create", upload.single("thumbnail"), courseController.create);
routes.get("/all", courseController.getAll);
routes.get("/getone/:courseId", courseController.getOne);
routes.get("/pending", isAdmin, courseController.getPendingCourses);
routes.patch(
  "/edit",
  authentication,
  isAdmin,
  upload.single("thumbnail"),
  courseController.edit
);
routes.delete(
  "/delete/:courseId",
  authentication,
  isAdmin,
  courseController.delete
);

module.exports = routes;
