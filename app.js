var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors"); // Add CORS

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const postRouter = require("./routes/postRouter");
const categoryRouter = require("./routes/categoryRouter");
const authorRouter = require("./routes/authorRouter");

const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/blogdb";
const connect = mongoose.connect(url, {});

connect.then(
  () => console.log("Connected correctly to MongoDB server"),
  (err) => console.log(err)
);

var app = express();

// CORS configuration - Add this before other middleware
app.use(cors({
  origin: 'http://localhost:3001', // React dev server port
  credentials: true
}));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Temporarily comment out authentication for development
// You can re-enable this later for admin routes only
/*
function auth(req, res, next) {
  console.log(req.headers);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const err = new Error("You are not authenticated!");
    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    return next(err);
  }

  const auth = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");
  const user = auth[0];
  const pass = auth[1];
  if (user === "admin" && pass === "password") {
    return next(); // authorized
  } else {
    const err = new Error("You are not authenticated!");
    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    return next(err);
  }
}

app.use(auth);
*/

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postRouter);
app.use("/categories", categoryRouter);
app.use("/authors", authorRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
