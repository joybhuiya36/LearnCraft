const forumModel = require("../model/forumModel");
const { failure, success } = require("../util/common");

class forumController {
  async createComment(req, res) {
    try {
      const { courseId, userId, comment } = req.body;
      const discussion = await forumModel.create({
        courseId,
        userId,
        comment,
        time: Date.now(),
      });
      if (discussion)
        return res
          .status(201)
          .send(success("Comment is Created Successfully!", discussion));
      return res.status(422).send(failure("Failed to Create Comment!"));
    } catch (error) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async reply(req, res) {
    try {
      const { discussionId, userId, comment } = req.body;
      const discussion = await forumModel.findOne({ _id: discussionId });
      if (!discussion)
        return res.status(404).send(failure("Comment isn't Found!"));
      discussion.reply.push({ userId, comment, time: Date.now() });
      await discussion.save();
      return res
        .status(200)
        .send(success("Reply Comment is Successfully Added!", discussion));
    } catch (error) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async deleteComment(req, res) {
    try {
      const { commentId } = req.params;
      const dltComment = await forumModel.deleteOne({ _id: commentId });
      if (dltComment.deletedCount > 0)
        return res
          .status(200)
          .send(success("Comment is Successfully Deleted!"));
      return res.status(422).send(failure("Failed to Delete Comment!"));
    } catch (error) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async deleteReply(req, res) {
    try {
      const { commentId, replyId } = req.params;
      const comment = await forumModel.findOne({ _id: commentId });
      if (!comment)
        return res.status(404).send(failure("Comment isn't Found!"));
      const idx = comment.reply.findIndex((x) => x._id.equals(replyId));
      console.log("idxxx", idx);
      if (idx == -1) return res.status(404).send(failure("Reply isn't Found!"));
      comment.reply.splice(idx, 1);
      await comment.save();
      return res
        .status(200)
        .send(success("Reply Comment is Successfully Deleted!"));
    } catch (error) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async getDiscussion(req, res) {
    try {
      const { courseId } = req.params;
      const allDiscussion = await forumModel
        .find({ courseId })
        .populate("userId", "name email avatar")
        .populate("reply.userId", "name email avatar");
      if (!allDiscussion)
        return res.status(404).send(failure("Discussion isn't Found!"));
      return res
        .status(200)
        .send(
          success("All Discussion is Fetched Successfully!", allDiscussion)
        );
    } catch (error) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
}

module.exports = new forumController();
