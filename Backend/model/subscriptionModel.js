const mongoose = require("mongoose");

const subsSchema = new mongoose.Schema({
  cart: {
    type: mongoose.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courses: [
    {
      course: {
        type: mongoose.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      status: {
        type: String,
        erum: ["pending", "approved", "rejected"],
        default: "pending",
      },
    },
  ],
});

const Subscription = mongoose.model("Subscription", subsSchema);

module.exports = Subscription;
