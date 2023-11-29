const courseModel = require("../model/courseModel");
const contentModel = require("../model/contentModel");
const quizModel = require("../model/quizQusModel");
const { success, failure } = require("../util/common");
const { uploadFile, deleteFile } = require("../util/S3Manage");

class courseController {
  async create(req, res) {
    try {
      const { title, instructor, desc, category, level, preRequisite } =
        req.body;
      if (!req.file)
        return res
          .status(404)
          .send(failure("Please Select a Thumbnail First!"));
      const link = await uploadFile(req.file, "thumbnail");
      const course = await courseModel.create({
        title,
        desc,
        instructor,
        category,
        level: level,
        preRequisite: preRequisite,
        thumbnail: link,
      });
      return res
        .status(201)
        .send(success("Course is Created Successfully!", course));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async getAll(req, res) {
    try {
      const {
        page,
        limit,
        sortBy,
        sortParam,
        rating,
        ratingFilter,
        search,
        category,
        level,
      } = req.query;
      if (
        (sortParam && !sortBy) ||
        (!sortParam && sortBy) ||
        (sortParam && sortBy != "asc" && sortBy != "desc") ||
        (sortParam && sortParam != "rating" && sortParam != "title") ||
        (rating && !ratingFilter) ||
        (!rating && ratingFilter) ||
        (ratingFilter && ratingFilter != "lt" && ratingFilter != "gt") ||
        (level &&
          level != "Beginner" &&
          level != "Intermediate" &&
          level != "Advanced")
      ) {
        return res.status(401).send(failure("Invalid Parameters"));
      }
      if (page < 1 || limit < 1) {
        return res
          .status(401)
          .send(failure("Page and Limit value must be at least 1"));
      }
      const filters = {};
      if (rating) {
        if (ratingFilter === "lt")
          filters.rating = { $lte: parseFloat(rating) };
        else filters.rating = { $gte: parseFloat(rating) };
      }
      if (search)
        filters.$or = [
          { title: { $regex: search, $options: "i" } },
          { desc: { $regex: search, $options: "i" } },
        ];
      if (category) filters.category = { $in: [category] };
      if (level) filters.level = { $in: [level] };
      const courses = await courseModel
        .find(filters)
        .sort({ [sortParam]: sortBy === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit ? limit : 6)
        .populate("content", "-__v")
        .populate("instructor", "name email avatar");
      const rslt = courses.filter((course) => course.approved === true);
      if (courses) {
        return res.status(200).send(success("All Courses are Fetched!", rslt));
      }
      return res.status(404).send(failure("No Courses Found!"));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async getOne(req, res) {
    try {
      const { courseId } = req.params;
      const courses = await courseModel
        .findOne({ _id: courseId })
        .populate("content", "-__v")
        .populate("instructor", "name email avatar");
      if (courses) {
        return res
          .status(200)
          .send(success("Course Data is Fetched!", courses));
      }
      return res.status(404).send(failure("No Courses Found!"));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async getPendingCourses(req, res) {
    try {
      const courses = await courseModel
        .find({ approved: false })
        .populate("content", "-__v")
        .populate("instructor", "name email avatar");
      if (courses) {
        return res
          .status(200)
          .send(success("Pending Courses are Fetched!", courses));
      }
      return res.status(404).send(failure("No Courses Found!"));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async edit(req, res) {
    try {
      const { courseId, title, desc, category, level, preRequisite } = req.body;
      console.log(
        courseId,
        title,
        desc,
        category,
        level,
        preRequisite,
        req.file
      );
      const course = await courseModel.findOne({ _id: courseId });
      if (!course) return res.status(404).send(failure("Course is not Found!"));
      if (title) course.title = title;
      if (desc) course.desc = desc;
      if (category) course.category = category;
      if (level) course.level = level;
      if (preRequisite) course.preRequisite = preRequisite;
      if (req.file) {
        await deleteFile(course.thumbnail);
        course.thumbnail = await uploadFile(req.file, "thumbnail");
      }
      await course.save();
      return res
        .status(200)
        .send(success("Course is Updated Successfully!", course));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async delete(req, res) {
    try {
      const { courseId } = req.params;
      const course = await courseModel.findOne({ _id: courseId });
      for (const x of course.content) {
        const content = await contentModel.findOne({ _id: x });
        for (const q of content.quiz) {
          await quizModel.deleteOne({ _id: q });
        }
        await contentModel.deleteOne({ _id: x });
      }
      await deleteFile(course.thumbnail);
      await courseModel.deleteOne({ _id: courseId });
      return res.status(200).send(success("Course is Deleted Successfully!"));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
}

module.exports = new courseController();
