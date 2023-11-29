const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const databaseConnection = require("./config/database");
const multer = require("multer");
const { failure } = require("./util/common");
const courseRoute = require("./routes/courseRoute");
const contentRoute = require("./routes/contentRoute");
const authRoute = require("./routes/authRoute");
const quizQusRoute = require("./routes/quizQusRoute");
const reviewRatingRoute = require("./routes/reviewRatingRoute");
const cartRoute = require("./routes/cartRoute");
const adminRoute = require("./routes/adminRoute");
const wishlistRoute = require("./routes/wishlistRoute");
const userRoute = require("./routes/userRoute");
const subsRoute = require("./routes/subscriptionRoute");
const quizSubmissionRoute = require("./routes/quizSubmissionRoute");
const assignmentRoute = require("./routes/assignmentRoute");
const forumRoute = require("./routes/forumRoute");

dotenv.config();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("combined", { stream: accessLogStream }));

app.use("/auth", authRoute);
app.use("/course", courseRoute);
app.use("/content", contentRoute);
app.use("/quiz", quizQusRoute);
app.use("/feedback", reviewRatingRoute);
app.use("/cart", cartRoute);
app.use("/admin", adminRoute);
app.use("/wishlist", wishlistRoute);
app.use("/user", userRoute);
app.use("/subs", subsRoute);
app.use("/quiz", quizSubmissionRoute);
app.use("/assignment", assignmentRoute);
app.use("/forum", forumRoute);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ message: "Invaild JSON Format" });
  } else if (err instanceof multer.MulterError) {
    return res.status(404).send(failure("", err.message));
  } else {
    next(err);
  }
});
app.use((req, res) => {
  return res.status(400).send({ message: "Bad Request" });
});
databaseConnection(() => {
  app.listen(3000, () => {
    console.log("Server is running on 3000 port");
  });
});
