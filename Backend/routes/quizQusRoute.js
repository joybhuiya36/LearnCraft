const express = require("express");
const routes = express();
const quizQusController = require("../controller/quizQusController");

routes.post("/create", quizQusController.create);
routes.delete("/delete/:quizId", quizQusController.delete);

module.exports = routes;
