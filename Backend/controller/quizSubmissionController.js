const { success, failure } = require("../util/common");
const quizSubmissionModel = require("../model/quizSubmissionModel");

class QuizSubmissionController {
  async submitQuiz(req, res) {
    try {
      const { contentId, studentId, submission } = req.body;
      const submitQuiz = await quizSubmissionModel.create({
        contentId,
        studentId,
        submission,
      });
      return res
        .status(201)
        .send(success("Quiz is Successfully Submitted!", submitQuiz));
    } catch (error) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async getSubmittedQuiz(req, res) {
    try {
      const { contentId, studentId } = req.params;
      const submittedQuiz = await quizSubmissionModel.findOne({
        contentId,
        studentId,
      });
      if (submittedQuiz) {
        return res
          .status(200)
          .send(
            success(
              "Submitted Quiz Data is Successfully Fetched!",
              submittedQuiz
            )
          );
      }
      return res.status(404).send(failure("Quiz Data isn't Found!"));
    } catch (error) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
}

module.exports = new QuizSubmissionController();
