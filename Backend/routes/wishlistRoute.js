const express = require("express");
const route = express();
const wishlistController = require("../controller/wishlistController");
const { isValid } = require("../middleware/validator");

route.post("/addtowishlist", wishlistController.addToWishlist);
route.delete(
  "/remove/:courseId",
  isValid.mongooseValidIdParam,
  wishlistController.removeItem
);
route.get("/all", wishlistController.viewWishlist);
route.post("/addtocart", wishlistController.addToCartAll);
route.post(
  "/addtocartone",
  isValid.mongooseValidIdBody,
  wishlistController.addToCartOne
);

module.exports = route;
