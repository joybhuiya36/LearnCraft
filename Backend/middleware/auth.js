const { failure } = require("../util/common");
const jsonwebtoken = require("jsonwebtoken");

const authentication = (req, res, next) => {
  // console.log(req.headers.authorization);
  try {
    if (!req.headers.authorization)
      return res.status(401).send(failure("Unauthorized Access!"));
    const token = req.headers.authorization.split(" ")[1];
    const check = jsonwebtoken.verify(token, process.env.SECRET_KEY);
    if (check) next();
    else throw new Error();
  } catch (error) {
    if (error instanceof jsonwebtoken.TokenExpiredError) {
      return res.status(401).send(failure("Please Login Again!"));
    }
    if (error instanceof jsonwebtoken.JsonWebTokenError) {
      return res.status(401).send(failure("Token Invalid!"));
    }
    return res.status(500).send(failure("Something Went Wrong!"));
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res.status(401).send(failure("Unauthorized Access!"));
    const token = req.headers.authorization.split(" ")[1];
    const payload = jsonwebtoken.decode(token);
    if (payload.role === 1) {
      next();
    } else {
      return res.status(401).send(failure("Unauthorized Access!"));
    }
  } catch (error) {
    console.log("admin catch");
    return res.status(500).send(failure("Internal Server Error!"));
  }
};

const isInstructor = (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res.status(401).send(failure("Unauthorized Access!"));
    const token = req.headers.authorization.split(" ")[1];
    const payload = jsonwebtoken.decode(token);
    // console.log(payload);
    if (payload.role === 2) {
      next();
    } else {
      return res.status(401).send(failure("Unauthorized Access!"));
    }
  } catch (error) {
    return res.status(500).send(failure("Internal Server Error!"));
  }
};

module.exports = { authentication, isAdmin, isInstructor };
