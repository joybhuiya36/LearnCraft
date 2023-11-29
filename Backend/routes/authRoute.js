const express = require("express");
const routes = express();
const authController = require("../controller/authController");
const { authValidator } = require("../middleware/validator");

routes.post("/signup", authValidator.signup, authController.signup);
routes.post("/login", authValidator.login, authController.login);
routes.post("/forget-password", authController.forgetPassMail);
routes.post("/reset-password", authController.resetPassword);
routes.post("/reset-request", authController.validPasswordResetReq);
routes.post("/verify-email", authController.emailVerification);
routes.post("/verify-request", authController.validVerificationReq);

module.exports = routes;
