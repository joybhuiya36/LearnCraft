const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  contentId: {
    type: mongoose.Types.ObjectId,
    ref: "Content",
    required: true,
  },
  assignment: {
    type: String,
    required: true,
  },
});
const Assignment = mongoose.model("Assignment", assignmentSchema);
module.exports = Assignment;
