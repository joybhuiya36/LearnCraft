const express = require("express");
const route = express();
const quizSubmissionController = require("../controller/quizSubmissionController");

route.post("/submit", quizSubmissionController.submitQuiz);
route.get(
  "/submitted-quiz/:contentId/:studentId",
  quizSubmissionController.getSubmittedQuiz
);

module.exports = route;
