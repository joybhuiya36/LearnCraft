const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  reply: [
    {
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      time: {
        type: Date,
        required: true,
      },
    },
  ],
});
const Forum = mongoose.model("Forum", forumSchema);
module.exports = Forum;
