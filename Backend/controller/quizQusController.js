const quizQusModel = require("../model/quizQusModel");
const contentModel = require("../model/contentModel");
const { success, failure } = require("../util/common");

class quizQusController {
  async create(req, res) {
    try {
      const { contentId, question, options, answer } = req.body;
      const content = await contentModel.findOne({ _id: contentId });
      if (!content)
        return res.status(404).send(failure("Content isn't Found!"));

      const qus = await quizQusModel.create({
        contentId,
        question,
        options,
        answer,
      });
      content.quiz.push(qus._id);
      await content.save();
      return res
        .status(201)
        .send(success("Question is Successfully Created!", qus));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async delete(req, res) {
    try {
      const { quizId } = req.params;
      const quiz = await quizQusModel.findOne({ _id: quizId });
      if (!quiz)
        return res.status(404).send(failure("Quiz Question isn't Found!"));
      const content = await contentModel.findOne({ _id: quiz.contentId });
      const quizDelete = await quizQusModel.deleteOne({ _id: quizId });
      if (quizDelete.deletedCount == 0)
        return res.status(404).send(failure("Failed to Delete Quiz Question"));
      const idx = content.quiz.findIndex((x) => x.equals(quizId));
      if (idx != -1) content.quiz.splice(idx, 1);
      await content.save();
      return res
        .status(200)
        .send(success("Quiz Question is Deleted Successfully!"));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
}

module.exports = new quizQusController();
