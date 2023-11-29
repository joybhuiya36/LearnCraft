const subsModel = require("../model/subscriptionModel");
const { success, failure } = require("../util/common");

class Subscription {
  async getAll(req, res) {
    try {
      const subs = await subsModel
        .find({})
        .populate("user", "name email avatar")
        .populate(
          "courses.course",
          "title desc thumbnail rating students level"
        );
      const reversedSubs = subs.reverse();
      return res
        .status(200)
        .send(
          success("All Subsriptions are Successfully Fetched!", reversedSubs)
        );
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
}

module.exports = new Subscription();
