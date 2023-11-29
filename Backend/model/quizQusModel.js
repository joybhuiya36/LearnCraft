const mongoose = require("mongoose");

const quizQuestionSchema = new mongoose.Schema({
  contentId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  answer: {
    type: String,
    required: true,
  },
});

const QuizQuestion = mongoose.model("QuizQuestion", quizQuestionSchema);

module.exports = QuizQuestion;
