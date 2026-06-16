require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const authenticateUser = require("./middleware/authentication");
//security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

const rateLimitter = require("express-rate-limit");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authRoute = require("./routes/auth");
const jobsRoute = require("./routes/jobs");
const connectDB = require("./db/connect");

app.use(express.json());
// extra packages

app.use(
  rateLimitter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // 100 requests per IP
    message: {
      success: false,
      message: "Too many requests, try again later.",
    },
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.get("/", (req, res) => {
  res.send("hh");
});
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/jobs", authenticateUser, jobsRoute);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
