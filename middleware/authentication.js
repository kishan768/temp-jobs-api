const jwt = require("jsonwebtoken");
const { BadRequestError } = require("../errors");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new BadRequestError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //attach the user to the job routes

    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new BadRequestError("Authentication invalid");
  }
};

module.exports = auth;
