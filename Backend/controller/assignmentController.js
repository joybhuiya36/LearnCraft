const contentModel = require("../model/contentModel");
const assignmentModel = require("../model/assignmentModel");
const { uploadFile, deleteFile } = require("../util/S3Manage");
const { success, failure } = require("../util/common");

class assignmentController {
  async assignAssignment(req, res) {
    try {
      const { contentId } = req.body;
      if (!req.file) return res.status(404).send(failure("File isn't Found!"));
      const content = await contentModel.findOne({ _id: contentId });
      if (content) {
        if (content.assignment.length > 0) await deleteFile(content.assignment);
        const link = await uploadFile(req.file, "assignment");
        content.assignment = link;
        await content.save();
        return res
          .status(200)
          .send(success("Assignment is Successfully Uploaded!", content));
      }
      return res.status(404).send(failure("Content isn't Found!"));
    } catch (error) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async assignmentSubmit(req, res) {
    try {
      const { userId, contentId } = req.body;
      console.log(userId, contentId, req.file);
      if (!req.file) return res.status(404).send(failure("File isn't Found!"));
      const link = await uploadFile(req.file, "submitted_Assignment");
      const submittedAssignment = await assignmentModel.create({
        userId: userId,
        contentId: contentId,
        assignment: link,
      });
      return res
        .status(201)
        .send(
          success("Assignment is Submitted Successfully!", submittedAssignment)
        );
    } catch (error) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async assignmentCheck(req, res) {
    try {
      const { userId, contentId } = req.params;

      const submittedAssignment = await assignmentModel.findOne({
        userId: userId,
        contentId: contentId,
      });
      if (submittedAssignment)
        return res
          .status(201)
          .send(success("Assignment is Found!", submittedAssignment));
      return res.status(404).send(failure("Assignment is not Found!"));
    } catch (error) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
}

module.exports = new assignmentController();
