const jsonwebtoken = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const userModel = require("../model/userModel");
const authModel = require("../model/authModel");
const { success, failure } = require("../util/common");
const { uploadFile, deleteFile } = require("../util/S3Manage");

class User {
  async getAllUser(req, res) {
    try {
      const allUser = await userModel.aggregate([
        {
          $lookup: {
            from: "auths",
            localField: "_id",
            foreignField: "user",
            as: "authData",
          },
        },
      ]);

      if (allUser.length > 0) {
        const userAggregateData = allUser.map((user) => {
          const { _id, name, email, avatar, phone, address } = user;
          const { role } = user.authData[0];
          return {
            _id,
            name,
            email,
            avatar,
            phone,
            address,
            role,
          };
        });

        return res
          .status(200)
          .send(success("All User Data is Fetched!", userAggregateData));
      } else {
        return res.status(404).send(success("No User Data is Found!"));
      }
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async getOneUser(req, res) {
    try {
      if (!req.headers.authorization)
        return res.status(401).send(failure("Unauthorized Access!"));
      const token = req.headers.authorization.split(" ")[1];
      const check = jsonwebtoken.verify(token, process.env.SECRET_KEY);
      if (!check) throw new Error();
      const user = await userModel
        .findOne({ _id: check.user._id })
        .populate("approvedCourses");
      if (!user) return res.status(404).send(success("User Data isn't Found!"));
      return res
        .status(200)
        .send(success("User Data is Successfully Fetched!", user));
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
  async changeProfilePic(req, res) {
    try {
      if (!req.headers.authorization)
        return res.status(401).send(failure("Unauthorized Access!"));
      const token = req.headers.authorization.split(" ")[1];
      const check = jsonwebtoken.verify(token, process.env.SECRET_KEY);
      if (!check) throw new Error();
      if (!req.file)
        return res.status(404).send(failure("Image file isn't Found!"));
      const user = await userModel.findOne({ _id: check.user._id });
      if (!user) return res.status(404).send(success("User Data isn't Found!"));

      await deleteFile(user.avatar);
      user.avatar = await uploadFile(req.file, "profilePic");
      await user.save();
      return res
        .status(200)
        .send(success("Profile Picture is Changed Successfully!"));
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
  async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      const deleteResult = await userModel.deleteOne({ _id: userId });
      if (deleteResult.deletedCount) {
        await authModel.deleteOne({ user: userId });
        return res.status(200).send(success("User is Deleted Successfully!"));
      } else {
        return res.status(404).send(failure("Failed to Delete User!"));
      }
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async editUser(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res.status(422).send(
          failure(
            "Invalid Input Provided",
            validation.map((x) => x.msg)
          )
        );
      }
      const { id, name, email, phone, address } = req.body;
      const user = await userModel.findOne({ _id: id });
      if (name != undefined) user.name = name;
      if (email != undefined) user.email = email;
      if (phone != undefined) user.phone = phone;
      if (address != undefined) user.address = address;

      await user.save();
      if (
        name == undefined &&
        email == undefined &&
        phone == undefined &&
        address == undefined
      ) {
        return res.status(200).send(success("No Data is Updated!"));
      }
      return res
        .status(200)
        .send(success("User Data is Updated Successfully", user));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
}

module.exports = new User();
