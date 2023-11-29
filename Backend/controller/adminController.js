const subsModel = require("../model/subscriptionModel");
const userModel = require("../model/userModel");
const courseModel = require("../model/courseModel");
const { success, failure } = require("../util/common");

class Subscription {
  async approveSubscription(req, res) {
    try {
      const { id, userId, courseId } = req.body;
      const user = await userModel.findOne({ _id: userId });
      if (user.approvedCourses.includes(courseId))
        return res
          .status(400)
          .send(failure("Enrollment Request is Already Approved!"));
      const subs = await subsModel.findOne({
        _id: id,
      });

      const course = await courseModel.findOne({ _id: courseId });
      course.students.push(userId);
      await course.save();
      const idx = user.pendingCourses.findIndex((x) => x.equals(courseId));
      user.pendingCourses.splice(idx, 1);
      user.approvedCourses.push(courseId);
      await user.save();
      for (const ob of subs.courses) {
        if (ob.course.equals(courseId)) {
          ob.status = "approved";
          break;
        }
      }
      await subs.save();
      return res
        .status(200)
        .send(success("Enrollment Request is Successfully Approved!", user));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async rejectSubcription(req, res) {
    try {
      const { userId, courseId } = req.body;
      const user = await userModel.findOne({ _id: userId });
      const subs = await subsModel.findOne({
        user: userId,
        "courses.course": courseId,
      });
      const idx = user.pendingCourses.findIndex((x) => x.equals(courseId));
      user.pendingCourses.splice(idx, 1);
      await user.save();
      for (const ob of subs.courses) {
        if (ob.course.equals(courseId)) {
          ob.status = "rejected";
          break;
        }
      }
      await subs.save();
      return res
        .status(200)
        .send(success("Enrollment Request is Successfully Rejected!", user));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async approveCourse(req, res) {
    try {
      const { courseId } = req.body;
      const course = await courseModel.findOne({ _id: courseId });
      if (!course) return res.status(404).send(failure("Course isn't Found!"));
      course.approved = true;
      await course.save();
      const user = await userModel.findOne({ _id: course.instructor });
      const idx = user.pendingCourses.findIndex((course) =>
        course.equals(courseId)
      );
      user.pendingCourses.splice(idx, 1);
      user.approvedCourses.push(courseId);
      await user.save();
      return res
        .status(200)
        .send(success("Successfully Approved the Course!", course));
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
}

module.exports = new Subscription();
