const cartModel = require("../model/cartModel");
const userModel = require("../model/userModel");
const courseModel = require("../model/courseModel");
const subsModel = require("../model/subscriptionModel");
const wishlistModel = require("../model/wishlistModel");
const jsonwebtoken = require("jsonwebtoken");
const { success, failure } = require("../util/common");
const { validationResult } = require("express-validator");

class Cart {
  async addToCart(req, res) {
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
            "Failed to Add to Cart",
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
      const wishlist = await wishlistModel.findOne({ user: check.user._id });
      if (wishlist) {
        const idx = wishlist.courses.findIndex((x) => x.equals(courseId));
        if (idx != -1) {
          wishlist.courses.splice(idx, 1);
          await wishlist.save();
        }
      }
      const userInCart = await cartModel.findOne({ user: check.user._id });

      if (userInCart) {
        const idx = userInCart.courses.findIndex((x) => x.equals(courseId));
        if (idx != -1)
          return res
            .status(400)
            .send(failure("Course is Already Added to Cart!"));

        userInCart.courses.push(courseId);
        await userInCart.save();
        return res
          .status(201)
          .send(
            success("Course Added Newly to the Cart Successfully!", userInCart)
          );
      } else {
        const cart = await cartModel.create({
          user: check.user._id,
        });

        cart.courses.push(courseId);
        await cart.save();
        return res
          .status(201)
          .send(success("Course Added Newly to the Cart Successfully!", cart));
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
            "Failed to Remove from Cart",
            validation.map((x) => x.msg)
          )
        );
      }

      const course = await courseModel.findOne({ _id: courseId });
      if (!course) {
        return res.status(404).send(failure("Course doesn't Exist!"));
      }
      const userInCart = await cartModel.findOne({ user: check.user._id });
      if (!userInCart) {
        return res.status(404).send(failure("Cart doesn't Exist!"));
      }
      const idx = userInCart.courses.findIndex((x) => x.equals(courseId));
      if (idx == -1)
        return res.status(400).send(failure("Course isn't Found in Cart!"));
      if (userInCart.courses.length == 1) {
        await cartModel.deleteOne({ user: check.user._id });
      } else {
        userInCart.courses.splice(idx, 1);
        await userInCart.save();
      }
      return res
        .status(200)
        .send(success("Course is Removed from the Cart!", userInCart));
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
  async viewCart(req, res) {
    try {
      if (!req.headers.authorization)
        return res.status(401).send(failure("Unauthorized Access!"));
      const token = req.headers.authorization.split(" ")[1];
      const check = jsonwebtoken.verify(token, process.env.SECRET_KEY);
      if (!check) throw new Error();

      const cart = await cartModel
        .findOne({ user: check.user._id })
        .populate("user", "name -_id")
        .populate({
          path: "courses",
          select: "instructor rating title thumbnail",
          populate: { path: "instructor", select: "name" },
        });
      if (!cart) {
        return res.status(404).send(success("Cart for this user not found!"));
      }
      const viewCart = cart.toObject();
      delete viewCart._id;
      delete viewCart.__v;
      return res
        .status(200)
        .send(success("Cart Data is Successfully Fetched!", viewCart));
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
  async checkout(req, res) {
    try {
      if (!req.headers.authorization)
        return res.status(401).send(failure("Unauthorized Access!"));
      const token = req.headers.authorization.split(" ")[1];
      const check = jsonwebtoken.verify(token, process.env.SECRET_KEY);
      if (check.role == 1) {
        return res.status(422).send(failure("Admin can't checkout"));
      }
      if (!check) throw new Error();
      const userInCart = await cartModel.findOne({ user: check.user._id });
      if (!userInCart) {
        return res
          .status(404)
          .send(failure("Cart is not Found for this User!"));
      }

      const subs = await subsModel.create({
        cart: userInCart._id,
        user: check.user._id,
      });
      const user = await userModel.findOne({ _id: check.user._id });
      userInCart.courses.forEach((x) => {
        user.pendingCourses.push(x);
        subs.courses.push({ course: x });
      });
      await user.save();
      await subs.save();
      const populateData = await subsModel
        .findOne({ cart: userInCart._id })
        .populate("user", "-_id -__v")
        .populate("courses.course");

      const deletionResult = await cartModel.deleteOne({
        user: check.user._id,
      });
      if (deletionResult.deletedCount)
        return res
          .status(200)
          .send(success("Successfully Checked Out!", populateData));
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
