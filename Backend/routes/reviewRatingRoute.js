const express = require("express");
const route = express();
const reviewRatingController = require("../controller/reviewRatingController");
const { isValid } = require("../middleware/validator");

route.post(
  "/add",
  isValid.reviewRatingAdd,
  reviewRatingController.addReviewRating
);
route.get("/all", reviewRatingController.getAllReviewRating);
route.get(
  "/getone/:courseId",
  isValid.mongooseValidIdParam,
  reviewRatingController.getOneCourseReviewRating
);
route.patch(
  "/edit",
  isValid.editReview,
  reviewRatingController.editReviewRating
);
route.delete(
  "/remove/:courseId",
  isValid.mongooseValidIdParam,
  reviewRatingController.removeReviewRating
);

module.exports = route;
