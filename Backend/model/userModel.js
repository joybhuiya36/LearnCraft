const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  pendingCourses: {
    type: [mongoose.Types.ObjectId],
    ref: "Course",
    default: [],
  },
  approvedCourses: {
    type: [mongoose.Types.ObjectId],
    ref: "Course",
    default: [],
  },
  notifications: {
    type: [mongoose.Types.ObjectId],
    ref: "Notification",
    default: [],
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
