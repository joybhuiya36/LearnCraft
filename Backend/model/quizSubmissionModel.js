const mongoose = require("mongoose");

const quizSubmissionSchema = new mongoose.Schema({
  contentId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  studentId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  submission: {
    type: Map,
    of: {
      type: String,
      value: String,
    },
  },
});

const QuizSubmission = mongoose.model("QuizSubmission", quizSubmissionSchema);

module.exports = QuizSubmission;
