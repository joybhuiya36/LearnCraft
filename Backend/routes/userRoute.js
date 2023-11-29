const express = require("express");
const routes = express();
const userController = require("../controller/userController");
const { isValid } = require("../middleware/validator");
const { isAdmin, authentication } = require("../middleware/auth");
const upload = require("multer")();

routes.get("/all", authentication, isAdmin, userController.getAllUser);
routes.get("/details", userController.getOneUser);
routes.post(
  "/change-profile",
  upload.single("pic"),
  userController.changeProfilePic
);
routes.patch("/edit", userController.editUser);
routes.delete(
  "/delete/:userId",
  isValid.mongooseValidIdParam,
  userController.deleteUser
);

module.exports = routes;
