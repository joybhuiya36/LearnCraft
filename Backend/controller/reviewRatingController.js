const reviewRatingModel = require("../model/reviewRatingModel");
const courseModel = require("../model/courseModel");
const userModel = require("../model/userModel");
const jsonwebtoken = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { success, failure } = require("../util/common");
const { default: mongoose } = require("mongoose");

class reviewRating {
  async addReviewRating(req, res) {
    try {
      if (!req.headers.authorization)
        return res.status(401).send(failure("Unauthorized Access!"));
      const token = req.headers.authorization.split(" ")[1];
      const check = jsonwebtoken.decode(token);
      if (check.role == 1 || check.role == 2) {
        return res
          .status(422)
          .send(failure("Admin or Instructor can't Perform Review Rating!"));
      }
      if (!check) throw new Error();

      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res.status(422).send(
          failure(
            "Failed to Add Review-Rating",
            validation.map((x) => x.msg)
          )
        );
      }
      const userId = check.user._id;
      const { courseId, review, rating } = req.body;
      const course = await courseModel.findOne({ _id: courseId });
      if (!course) {
        return res.status(404).send(failure("course is not Found!"));
      }
      let courseInReview = await reviewRatingModel.findOne({
        course: courseId,
      });

      if (courseInReview) {
        const existingUser = courseInReview.reviews.find((x) =>
          x.user.equals(userId)
        );
        if (existingUser) {
          return res
            .status(409)
            .send(failure("User Already Gave his/her Review-Rating!"));
        }
        courseInReview.totalRating =
          (courseInReview.totalRating * courseInReview.reviews.length +
            rating) /
          (courseInReview.reviews.length + 1);
        courseInReview.reviews.push({
          user: userId,
          review: review,
          rating: rating,
        });
        await courseInReview.save();
        course.rating = courseInReview.totalRating;
        await course.save();
      } else {
        courseInReview = await reviewRatingModel.create({
          course: courseId,
          reviews: [{ user: userId, review: review, rating: rating }],
          totalRating: rating,
        });
        const course = await courseModel.findOne({ _id: courseId });
        course.rating = rating;
        await course.save();
      }
      return res
        .status(201)
        .send(success("Review-Rating is Newly Created!", courseInReview));
    } catch (error) {
      if (error instanceof jsonwebtoken.TokenExpiredError) {
        return res.status(401).send(failure("Please Login Again!"));
      }
      if (error instanceof jsonwebtoken.JsonWebTokenError) {
        return res.status(401).send(failure("Token Invalid!"));
      }
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }

  async getAllReviewRating(req, res) {
    try {
      const allReviewRatings = await reviewRatingModel
        .find()
        .populate("reviews.user", "_id name email");

      if (!allReviewRatings || allReviewRatings.length === 0) {
        return res.status(404).send(failure("No Review Ratings Found!"));
      }
      return res
        .status(200)
        .send(success("All Review Ratings Retrieved", allReviewRatings));
    } catch (error) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async getOneCourseReviewRating(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res.status(422).send(
          failure(
            "Failed to Edit Review",
            validation.map((x) => x.msg)
          )
        );
      }
      const { courseId } = req.params;
      const allReviewRatings = await reviewRatingModel
        .findOne({
          course: new mongoose.Types.ObjectId(courseId),
        })
        .populate("reviews.user", "_id name email avatar");

      if (!allReviewRatings || allReviewRatings.length === 0) {
        return res.status(404).send(failure("No Review Ratings Found!"));
      }
      return res
        .status(200)
        .send(success("All Review Ratings Retrieved", allReviewRatings));
    } catch (error) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async editReviewRating(req, res) {
    try {
      if (!req.headers.authorization)
        return res.status(401).send(failure("Unauthorized Access!"));
      const token = req.headers.authorization.split(" ")[1];
      const check = jsonwebtoken.verify(token, process.env.SECRET_KEY);
      if (!check) throw new Error();

      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res.status(422).send(
          failure(
            "Failed to Edit Review",
            validation.map((x) => x.msg)
          )
        );
      }
      const { courseId, rating, review } = req.body;
      const course = await courseModel.findOne({ _id: courseId });
      if (!course) {
        return res.status(404).send(failure("Course is not Found!"));
      }
      const courseInReview = await reviewRatingModel
        .findOne({ course: courseId })
        .populate("course")
        .populate("reviews.user");
      if (courseInReview) {
        const existingUser = courseInReview.reviews.find((x) =>
          x.user.equals(check.user._id)
        );
        if (!existingUser) {
          return res.status(400).send(failure("User has no review!"));
        }
        const totalRating =
          (courseInReview.totalRating * courseInReview.reviews.length -
            existingUser.rating +
            rating) /
          courseInReview.reviews.length;
        existingUser.review = review;
        existingUser.rating = rating;
        courseInReview.totalRating = totalRating;
        course.rating = totalRating;
        await courseInReview.save();
        await course.save();
        return res
          .status(200)
          .send(success("Review is Successfully Edited", existingUser));
      } else {
        return res.status(404).send(failure("404 Not Found"));
      }
    } catch (error) {
      if (error instanceof jsonwebtoken.TokenExpiredError) {
        return res.status(401).send(failure("Please Login Again!"));
      }
      if (error instanceof jsonwebtoken.JsonWebTokenError) {
        return res.status(401).send(failure("Token Invalid!"));
      }
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async removeReviewRating(req, res) {
    try {
      if (!req.headers.authorization)
        return res.status(401).send(failure("Unauthorized Access!"));
      const token = req.headers.authorization.split(" ")[1];
      const check = jsonwebtoken.verify(token, process.env.SECRET_KEY);
      if (!check) throw new Error();

      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res.status(422).send(
          failure(
            "Failed to Edit Review",
            validation.map((x) => x.msg)
          )
        );
      }
      const { courseId } = req.params;
      const course = await courseModel.findOne({ _id: courseId });
      if (!course) {
        return res.status(404).send(failure("Course is not Found!"));
      }
      const courseInReview = await reviewRatingModel.findOne({
        course: courseId,
      });
      if (courseInReview) {
        const reviewIndex = courseInReview.reviews.findIndex((x) =>
          x.user.equals(check.user._id)
        );
        if (reviewIndex === -1) {
          return res
            .status(404)
            .send(failure("User Review-Rating isn't Found!"));
        }
        if (courseInReview.reviews.length === 1) {
          await reviewRatingModel.deleteOne({ course: courseId });
          course.rating = 0;
          await course.save();
          return res
            .status(200)
            .send(success("Review and Rating is Successfully Removed", course));
        }
        courseInReview.totalRating =
          (courseInReview.totalRating * courseInReview.reviews.length -
            courseInReview.reviews[reviewIndex].rating) /
          (courseInReview.reviews.length - 1);
        courseInReview.reviews.splice(reviewIndex, 1);
        await courseInReview.save();
        course.rating = courseInReview.totalRating;
        await course.save();
        return res
          .status(200)
          .send(success("Review and Rating is Successfully Removed", course));
      } else {
        return res.status(404).send(failure("404 Not Found"));
      }
    } catch (error) {
      if (error instanceof jsonwebtoken.TokenExpiredError) {
        return res.status(401).send(failure("Please Login Again!"));
      }
      if (error instanceof jsonwebtoken.JsonWebTokenError) {
        return res.status(401).send(failure("Token Invalid!"));
      }
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
}

module.exports = new reviewRating();
