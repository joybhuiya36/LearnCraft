const wishlistModel = require("../model/wishlistModel");
const userModel = require("../model/userModel");
const courseModel = require("../model/courseModel");
const cartModel = require("../model/cartModel");
const jsonwebtoken = require("jsonwebtoken");
const { success, failure } = require("../util/common");
const { validationResult } = require("express-validator");

class Cart {
  async addToWishlist(req, res) {
    try {
      const { courseId } = req.body;
      if (!req.headers.authorization)
        return res.status(401).send(failure("Unauthorized Access!"));
      const token = req.headers.authorization.split(" ")[1];
      const check = jsonwebtoken.verify(token, process.env.SECRET_KEY);
      if (check.role == 1) {
        return res.status(422).send(failure("Admin can't add to cart"));
      }
      if (!check) throw new Error();
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res.status(422).send(
          failure(
            "Failed to Add to Wishlist",
            validation.map((x) => x.msg)
          )
        );
      }

      const course = await courseModel.findOne({ _id: courseId });
      if (!course) {
        return res.status(404).send(failure("Course doesn't Exist!"));
      }
      const user = await userModel.findOne({ _id: check.user._id });
      if (user.pendingCourses.includes(courseId))
        return res
          .status(400)
          .send(
            failure(
              "Your Enrollment Request for this Course is Already Pending!"
            )
          );
      if (user.approvedCourses.includes(courseId))
        return res
          .status(400)
          .send(failure("You have Already Enrolled this Course!"));
      const cart = await cartModel.findOne({ user: check.user._id });
      if (cart) {
        const idx = cart.courses.findIndex((x) => x.equals(courseId));
        if (idx != -1)
          return res
            .status(400)
            .send(failure("Course is Already Added to Cart!"));
      }
      const wishlist = await wishlistModel.findOne({ user: check.user._id });

      if (wishlist) {
        const idx = wishlist.courses.findIndex((x) => x.equals(courseId));
        if (idx != -1)
          return res
            .status(400)
            .send(failure("Course is Already Added to Wislist!"));

        wishlist.courses.push(courseId);
        await wishlist.save();
        return res
          .status(201)
          .send(
            success("Course Added Newly to the Cart Successfully!", wishlist)
          );
      } else {
        const newWishlist = await wishlistModel.create({
          user: check.user._id,
        });

        newWishlist.courses.push(courseId);
        await newWishlist.save();
        return res
          .status(201)
          .send(
            success(
              "Course Added Newly to the Wishlist Successfully!",
              newWishlist
            )
          );
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
  async removeItem(req, res) {
    try {
      const { courseId } = req.params;
      if (!req.headers.authorization)
        return res.status(401).send(failure("Unauthorized Access!"));
      const token = req.headers.authorization.split(" ")[1];
      const check = jsonwebtoken.verify(token, process.env.SECRET_KEY);
      if (!check) throw new Error();

      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res.status(200).send(
          failure(
            "Failed to Add to Wishlist",
            validation.map((x) => x.msg)
          )
        );
      }

      const course = await courseModel.findOne({ _id: courseId });
      if (!course) {
        return res.status(404).send(failure("Course doesn't Exist!"));
      }
      const wishlist = await wishlistModel.findOne({ user: check.user._id });
      if (!wishlist) {
        return res.status(404).send(failure("Wishlist doesn't Exist!"));
      }
      const idx = wishlist.courses.findIndex((x) => x.equals(courseId));
      if (idx == -1)
        return res.status(400).send(failure("Course isn't Found in wishlist!"));
      if (wishlist.courses.length == 1) {
        await wishlistModel.deleteOne({ user: check.user._id });
      } else {
        wishlist.courses.splice(idx, 1);
        await wishlist.save();
      }
      return res
        .status(200)
        .send(success("Course is Removed from the Wishlist!"));
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
  async viewWishlist(req, res) {
    try {
      if (!req.headers.authorization)
        return res.status(401).send(failure("Unauthorized Access!"));
      const token = req.headers.authorization.split(" ")[1];
      const check = jsonwebtoken.verify(token, process.env.SECRET_KEY);
      if (!check) throw new Error();
      const wishlist = await wishlistModel
        .findOne({ user: check.user._id })
        .populate("user", "name -_id")
        .populate({
          path: "courses",
          select: "instructor rating title thumbnail",
          populate: { path: "instructor", select: "name" },
        });
      if (!wishlist) {
        return res
          .status(404)
          .send(success("Wishlist for this User isn't Found!"));
      }
      return res
        .status(200)
        .send(success("wishlist Data is Successfully Fetched!", wishlist));
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
  async addToCartAll(req, res) {
    try {
      if (!req.headers.authorization)
        return res.status(401).send(failure("Unauthorized Access!"));
      const token = req.headers.authorization.split(" ")[1];
      const check = jsonwebtoken.verify(token, process.env.SECRET_KEY);
      if (check.role == 1) {
        return res.status(422).send(failure("Admin can't Add to Cart"));
      }
      if (!check) throw new Error();
      const wishlist = await wishlistModel.findOne({ user: check.user._id });
      if (!wishlist) {
        return res
          .status(404)
          .send(failure("Wishlist is not Found for this User!"));
      }

      const userCart = await cartModel.findOne({ user: check.user._id });
      if (userCart) {
        wishlist.courses.forEach((course) => userCart.courses.push(course));
        await userCart.save();
      } else {
        const newCart = await cartModel.create({
          user: check.user._id,
        });
        newCart.courses = wishlist.courses;
        await newCart.save();
      }

      const deletionResult = await wishlistModel.deleteOne({
        user: check.user._id,
      });
      if (deletionResult.deletedCount)
        return res.status(200).send(success("Successfully Added to Cart!"));
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
  async addToCartOne(req, res) {
    try {
      if (!req.headers.authorization)
        return res.status(401).send(failure("Unauthorized Access!"));
      const token = req.headers.authorization.split(" ")[1];
      const check = jsonwebtoken.verify(token, process.env.SECRET_KEY);
      if (check.role == 1) {
        return res.status(422).send(failure("Admin can't Add to Cart"));
      }
      if (!check) throw new Error();
      const { courseId } = req.body;
      const wishlist = await wishlistModel.findOne({ user: check.user._id });
      if (!wishlist) {
        return res
          .status(404)
          .send(failure("Wishlist is not Found for this User!"));
      }

      const userCart = await cartModel.findOne({ user: check.user._id });
      if (userCart) {
        userCart.courses.push(courseId);
        await userCart.save();
      } else {
        const newCart = await cartModel.create({
          user: check.user._id,
        });
        newCart.courses.push(courseId);
        await newCart.save();
      }
      if (wishlist.courses.length == 1) {
        await wishlistModel.deleteOne({ user: check.user._id });
      } else {
        const idx = wishlist.courses.findIndex((course) =>
          course.equals(courseId)
        );
        wishlist.courses.splice(idx, 1);
        await wishlist.save();
      }
      return res.status(200).send(success("Successfully Added to Cart!"));
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

module.exports = new Cart();
