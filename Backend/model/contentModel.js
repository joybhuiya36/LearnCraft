const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  videoDuration: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  quiz: {
    type: [mongoose.Types.ObjectId],
    ref: "QuizQuestion",
    default: [],
  },
  assignment: {
    type: String,
    default: "",
  },
});

const Content = mongoose.model("Content", contentSchema);
module.exports = Content;
