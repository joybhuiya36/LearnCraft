const express = require("express");
const route = express();
const subsController = require("../controller/subscriptionController");
const { authentication, isAdmin } = require("../middleware/auth");

route.get("/all", authentication, isAdmin, subsController.getAll);

module.exports = route;
