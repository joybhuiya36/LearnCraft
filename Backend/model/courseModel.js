const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  content: {
    type: [mongoose.Types.ObjectId],
    ref: "Content",
    default: [],
  },
  duration: {
    type: Number,
    default: 0,
  },
  instructor: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  students: {
    type: [mongoose.Types.ObjectId],
    ref: "User",
    default: [],
  },
  category: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    erum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  preRequisite: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  thumbnail: {
    type: String,
    default: "",
  },
  approved: {
    type: Boolean,
    default: false,
  },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
