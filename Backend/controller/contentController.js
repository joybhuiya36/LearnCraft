const { default: mongoose } = require("mongoose");
const contentModel = require("../model/contentModel");
const courseModel = require("../model/courseModel");
const { success, failure } = require("../util/common");
const { uploadFile, deleteFile } = require("../util/S3Manage");
const { getDuration } = require("../util/getVideoDuration");

class contentController {
  async create(req, res) {
    try {
      const { courseId, title, text } = req.body;
      const course = await courseModel.findOne({
        _id: new mongoose.Types.ObjectId(courseId),
      });
      if (!course) return res.status(404).send(failure("Course is not Found!"));
      const duration = await getDuration(req.file.buffer);
      if (duration == 0) req.file.originalname += ".mkv";
      const link = await uploadFile(req.file, courseId);

      const newContent = await contentModel.create({
        title,
        video: link,
        videoDuration: duration,
        text,
      });
      course.content.push(newContent._id);
      course.duration += duration;
      await course.save();
      return res
        .status(201)
        .send(success("Content is Created Successfully!", newContent));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async view(req, res) {
    try {
      const { contentId } = req.params;
      const content = await contentModel
        .findOne({ _id: contentId })
        .populate("quiz");
      if (!content)
        return res.status(404).send(failure("Content isn't Found!"));
      return res.status(200).send(success("Content Data is Fetched!", content));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async edit(req, res) {
    try {
      const { courseId, contentId, title, text } = req.body;
      const course = await courseModel.findOne({ _id: courseId });
      if (!course) return res.status(404).send(failure("Course is not Found!"));
      const content = await contentModel.findOne({ _id: contentId });
      if (!content)
        return res.status(404).send(failure("Content is not Found!"));
      if (title) content.title = title;
      if (text) content.text = text;
      if (req.file) {
        course.duration -= content.videoDuration;
        const duration = await getDuration(req.file.buffer);
        if (duration == 0) req.file.originalname += ".mkv";
        course.duration += duration;
        content.videoDuration = duration;
        await deleteFile(content.video);
        content.video = await uploadFile(req.file, courseId);
      }
      await course.save();
      await content.save();
      return res
        .status(200)
        .send(success("Content is Updated Successfully!", content));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async delete(req, res) {
    try {
      const { courseId, contentId } = req.params;
      const course = await courseModel.findOne({ _id: courseId });
      if (!course) return res.status(404).send(failure("Course is not Found!"));
      const content = await contentModel.findOne({ _id: contentId });
      if (!content)
        return res.status(404).send(failure("Content is not Found!"));
      await deleteFile(content.video);
      const idx = await course.content.findIndex((x) =>
        x._id.equals(contentId)
      );
      if (idx == -1)
        return res
          .status(404)
          .send(failure("Content is not Found in that Course!"));
      await course.content.splice(idx, 1);
      course.duration -= content.videoDuration;
      await course.save();
      const response = await contentModel.deleteOne({ _id: contentId });
      if (response.deletedCount)
        return res
          .status(200)
          .send(success("Content is Successfully Removed!"));
      return res.status(400).send(failure("Failed to Delete Content"));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
}

module.exports = new contentController();
