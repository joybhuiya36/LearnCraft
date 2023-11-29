const express = require("express");
const route = express();
const cartController = require("../controller/cartController");
const { isValid } = require("../middleware/validator");

route.post("/addtocart", isValid.mongooseValidIdBody, cartController.addToCart);
route.delete(
  "/remove/:courseId",
  isValid.mongooseValidIdParam,
  cartController.removeItem
);
route.get("/view", cartController.viewCart);
route.post("/checkout", cartController.checkout);

module.exports = route;
