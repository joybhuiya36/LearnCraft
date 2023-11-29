const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
    message: {
      type: String,
      default: "",
    },
    forAdmin: {
      type: Boolean,
      default: false,
    },
    read: {
      type: Boolean,
      default: true,
    },
    link: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
