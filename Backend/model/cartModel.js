const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
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
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
