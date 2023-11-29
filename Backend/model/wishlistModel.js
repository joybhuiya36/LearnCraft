const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courses: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
  ],
});
const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
