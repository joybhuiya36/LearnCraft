const express = require("express");
const routes = express();
const contentController = require("../controller/contentController");
const upload = require("multer")();

routes.post("/create", upload.single("video"), contentController.create);
routes.get("/view/:contentId", contentController.view);
routes.patch("/edit", upload.single("video"), contentController.edit);
routes.delete("/delete/:courseId/:contentId", contentController.delete);

module.exports = routes;
