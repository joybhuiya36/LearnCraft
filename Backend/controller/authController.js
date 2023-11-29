const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const userModel = require("../model/userModel");
const authModel = require("../model/authModel");
const { success, failure } = require("../util/common");
const jsonwebtoken = require("jsonwebtoken");
const path = require("path");
const crypto = require("crypto");
const ejs = require("ejs");
const { promisify } = require("util");
const ejsRenderFile = promisify(ejs.renderFile);
const transporter = require("../config/mail");
const mongoose = require("mongoose");

class Auth {
  async signup(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res.status(422).send(
          failure(
            "Failed to Add User",
            validation.map((x) => x.msg)
          )
        );
      }
      const { name, email, password, phone, address, role } = req.body;
      const finder = await userModel.findOne({ email: email });
      if (finder) {
        return res.status(200).send(failure("User Already Exists"));
      }
      const userData = await userModel.create({ name, email, phone, address });

      const hashedPassword = await bcrypt.hash(password, 10).then((hash) => {
        return hash;
      });
      const authData = await authModel.create({
        email: email,
        password: hashedPassword,
        user: userData._id,
        role: role,
      });
      if (!authData)
        return res.status(200).send(failure("Failed to Create User"));

      const token = crypto.randomBytes(32).toString("hex");
      authData.verficationExpire = Date.now() + 60 * 60 * 12 * 1000;
      authData.verificationToken = token;
      authData.save();
      const verificationURL = path.join(
        process.env.FRONTEND_URL,
        "verify-email",
        token,
        authData._id.toString()
      );
      const htmlbody = await ejsRenderFile(
        path.join(__dirname, "..", "views", "verify-email.ejs"),
        {
          name: name,
          verificationURL: verificationURL,
        }
      );
      const result = await transporter.sendMail({
        from: "elearning@support.com",
        to: `${name} ${email}`,
        subject: "Email Verification for Sign Up",
        html: htmlbody,
      });
      if (result.messageId) {
        return res
          .status(200)
          .send(success("Email Verification Request is Sent!"));
      }
      return res.status(422).send(failure("Something Went Wrong!"));
    } catch (err) {
      console.log(err);
      return res.status(500).send(failure("Internal Server Error"));
    }
  }
  async validVerificationReq(req, res) {
    try {
      const { token, userId } = req.body;
      const auth = await authModel.findOne({
        _id: new mongoose.Types.ObjectId(userId),
      });
      if (!auth) {
        return res.status(404).send(failure("Invalid Request!"));
      }
      if (auth.verified)
        return res.status(400).send(failure("Your Email is Already Verified!"));
      if (
        auth.verificationToken != token ||
        auth.verficationExpire < Date.now()
      ) {
        return res.status(404).send(failure("Invalid Token!"));
      }
      return res.status(200).send(success("Token is Valid!"));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async emailVerification(req, res) {
    try {
      const { userId } = req.body;
      const auth = await authModel.findOne({
        _id: new mongoose.Types.ObjectId(userId),
      });
      if (!auth) {
        return res.status(404).send(failure("User isn't Found!"));
      }
      auth.verified = true;
      auth.verficationExpire = null;
      auth.verificationToken = null;
      await auth.save();
      return res.status(200).send(success("Email is Verified Successfully!"));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async forgetPassMail(req, res) {
    try {
      const { recipient } = req.body;
      if (!recipient || recipient === "") {
        return res
          .status(422)
          .send(failure("Recipient Email is not Provided!"));
      }
      const auth = await authModel
        .findOne({ email: recipient })
        .populate("user");
      if (!auth) {
        return res.status(404).send(failure("User is not Found!"));
      }
      const token = crypto.randomBytes(32).toString("hex");
      auth.resetPasswordToken = token;
      auth.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
      auth.resetPassword = true;
      await auth.save();

      const resetURL = path.join(
        process.env.FRONTEND_URL,
        "reset-password",
        token,
        auth._id.toString()
      );
      const htmlbody = await ejsRenderFile(
        path.join(__dirname, "..", "views", "forget-password.ejs"),
        {
          name: auth.user.name,
          resetURL: resetURL,
        }
      );
      const result = await transporter.sendMail({
        from: "elearning@support.com",
        to: `${auth.user.name} ${recipient}`,
        subject: "Forget Password?",
        html: htmlbody,
      });
      if (result.messageId) {
        return res
          .status(200)
          .send(success("Reset_Password Request is Sent Successfully!"));
      }
      return res.status(422).send(failure("Something Went Wrong!"));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async resetPassword(req, res) {
    try {
      const { userId, newPassword } = req.body;
      // console.log(userId, newPassword);
      const auth = await authModel.findOne({
        _id: new mongoose.Types.ObjectId(userId),
      });
      if (!auth) {
        return res.status(404).send(failure("Invalid Request!"));
      }
      const checkPass = await bcrypt.compare(newPassword, auth.password);
      if (checkPass) {
        return res
          .status(404)
          .send(failure("Password can't be same as old password!"));
      }
      const newHashedPass = await bcrypt.hash(newPassword, 10).then((hash) => {
        return hash;
      });
      const result = await authModel.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(userId) },
        {
          password: newHashedPass,
          resetPassword: false,
          resetPasswordExpire: null,
          resetPasswordToken: null,
        }
      );
      if (result.isModified) {
        return res
          .status(200)
          .send(success("Password is Successfully Updated!"));
      }
      return res.status(400).send("Something Went Wrong!");
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async validPasswordResetReq(req, res) {
    try {
      const { token, userId } = req.body;
      const auth = await authModel.findOne({
        _id: new mongoose.Types.ObjectId(userId),
      });
      if (!auth) {
        return res.status(404).send(failure("Invalid Request!"));
      }
      if (
        auth.resetPassword === false ||
        auth.resetPasswordToken != token ||
        auth.resetPasswordExpire < Date.now()
      ) {
        return res.status(404).send(failure("Invalid Token!"));
      }
      return res.status(200).send(success("Token is Valid!"));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async login(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res.status(422).send(
          failure(
            "Failed to Login",
            validation.map((x) => x.msg)
          )
        );
      }
      const { email, password } = req.body;
      const auth = await authModel
        .findOne({ email: email })
        .populate(
          "user",
          "-__v -pendingCourses -approvedCourses -notifications"
        );
      if (!auth) {
        return res.status(404).send(failure("Invalid Credentials!"));
      }
      if (!auth.verified) {
        return res.status(404).send(failure("Please verify your email first!"));
      }
      const rslt = await bcrypt.compare(password, auth.password);
      if (!rslt) {
        return res.status(401).send(failure("Invalid Credentials!"));
      }
      const responseData = auth.toObject();
      delete responseData._id;
      delete responseData.password;
      delete responseData.__v;
      delete responseData.resetPassword;
      delete responseData.resetPasswordExpire;
      delete responseData.resetPasswordToken;
      delete responseData.verficationExpire;
      delete responseData.verificationToken;
      const jwt = jsonwebtoken.sign(responseData, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      responseData.token = jwt;
      return res
        .status(200)
        .send(success("Successfully Logged In", responseData));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
}

module.exports = new Auth();
