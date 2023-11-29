const { body, query, param } = require("express-validator");

const authValidator = {
  signup: [
    body("name")
      .exists()
      .withMessage("Name must be provided")
      .bail()
      .isString()
      .withMessage("Name must be a string")
      .not()
      .isEmpty()
      .withMessage("Name must be non-empty")
      .bail(),
    body("email")
      .exists()
      .withMessage("Email must be provided")
      .bail()
      .isString()
      .withMessage("Email must be string")
      .bail()
      .not()
      .isEmpty()
      .withMessage("Email must be non-empty")
      .bail()
      .isEmail()
      .withMessage("Email must be in valid format"),
    body("password")
      .exists()
      .withMessage("Password must be provided")
      .bail()
      .isString()
      .withMessage("Password must be string")
      .bail()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1,
      })
      .withMessage(
        "Password must contain min 8 characters, min 1 lowercase, min 1 uppercase, min 1 symbol, min 1 number"
      ),
    body("phone")
      .exists()
      .withMessage("Phone Number must be provided")
      .bail()
      .isString()
      .withMessage("Phone must be a string"),
    body("address")
      .exists()
      .withMessage("Address must be provided")
      .bail()
      .isString()
      .withMessage("Address must be a string")
      .not()
      .isEmpty()
      .withMessage("Address must be non-empty")
      .bail(),
    body("role")
      .optional()
      .isInt({ min: 2, max: 3 })
      .withMessage("Role must be 2 or 3"),
  ],
  login: [
    body("email")
      .exists()
      .withMessage("Email must be provided")
      .bail()
      .isString()
      .withMessage("Email must be string")
      .bail()
      .not()
      .isEmpty()
      .withMessage("Email must be non-empty")
      .bail()
      .isEmail()
      .withMessage("Email must be in valid format"),
  ],
};
const isValid = {
  userEditValidation: [
    body("id")
      .exists()
      .withMessage("User ID must be provided")
      .bail()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("Invalid ID Format"),
    body("name").optional().isString().withMessage("Name must be a string"),
    body("email")
      .optional()
      .isString()
      .withMessage("Email must be a string")
      .bail()
      .not()
      .isEmpty()
      .withMessage("Email must be non-empty")
      .bail()
      .isEmail()
      .withMessage("Email must be in valid format"),
    body("phone")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Phone must be a integer"),
    body("address")
      .optional()
      .isString()
      .withMessage("Address must be a string")
      .bail()
      .not()
      .isEmpty()
      .withMessage("Address must be non-empty"),
  ],
  bookAddValidation: [
    body("title")
      .exists()
      .withMessage("Title must be provided")
      .bail()
      .isString()
      .withMessage("Title must be a string")
      .bail()
      .not()
      .isEmpty()
      .withMessage("Title can't be an empty string"),
    body("author")
      .exists()
      .withMessage("Author must be provided")
      .bail()
      .isString()
      .withMessage("Author must be a string")
      .bail()
      .not()
      .isEmpty()
      .withMessage("Author can't be an empty string"),
    body("price")
      .exists()
      .withMessage("Price must be provided")
      .bail()
      .isInt({ min: 1 })
      .withMessage("Price must be greater than 0"),
    body("stock")
      .exists()
      .withMessage("Stock must be provided")
      .bail()
      .isInt({ min: 0 })
      .withMessage("Stock must be greater than or equal to 0"),
    body("pages")
      .exists()
      .withMessage("Pages must be provided")
      .bail()
      .isInt({ min: 1 })
      .withMessage("Pages must be greater than 0"),
    body("year")
      .exists()
      .withMessage("Year must be provided")
      .bail()
      .isInt({ min: 1800 })
      .withMessage("Year must be valid integer"),
  ],
  bookEditValidation: [
    body("title")
      .optional()
      .isString()
      .withMessage("Title must be a string")
      .bail()
      .not()
      .isEmpty()
      .withMessage("Title can't be an empty string"),
    body("author")
      .optional()
      .isString()
      .withMessage("Author must be a string")
      .bail()
      .not()
      .isEmpty()
      .withMessage("Author can't be an empty string"),
    body("price")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Price must be greater than 0"),
    body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Stock must be greater than or equal to 0"),
    body("pages")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Pages must be greater than 0"),
    body("year")
      .optional()
      .isInt({ min: 1800 })
      .withMessage("Year must be valid integer"),
  ],
  reviewRatingAdd: [
    body("courseId")
      .exists()
      .withMessage("Course ID must be provided")
      .bail()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("Invalid ID Format"),
    body("review").optional().isString().withMessage("Review must be a string"),
    body("rating")
      .exists()
      .withMessage("Rating must be provided")
      .bail()
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be in between 1 to 5"),
  ],
  editReview: [
    body("courseId")
      .exists()
      .withMessage("Course ID must be provided")
      .bail()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("Invalid ID Format"),
    body("review")
      .exists()
      .withMessage("Review must be provided")
      .bail()
      .isString()
      .withMessage("Review must be a string"),
  ],
  mongooseValidIdParam: [
    param("courseId")
      .exists()
      .withMessage("Course ID must be provided")
      .bail()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("Invalid ID Format"),
  ],
  mongooseValidIdBody: [
    body("courseId")
      .exists()
      .withMessage("Course ID must be provided")
      .bail()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("Invalid ID Format"),
  ],
};

module.exports = { authValidator, isValid };
