const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: Number,
    required: true,
    default: 3,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verficationExpire: {
    type: Date || null,
    required: false,
    default: null,
  },
  verificationToken: {
    type: String || null,
    required: false,
    default: null,
  },
  resetPassword: {
    type: Boolean || null,
    require: false,
    default: false,
  },
  resetPasswordToken: {
    type: String || null,
    required: false,
    default: null,
  },
  resetPasswordExpire: {
    type: Date || null,
    required: false,
    default: null,
  },
});
const Auth = mongoose.model("Auth", authSchema);
module.exports = Auth;
