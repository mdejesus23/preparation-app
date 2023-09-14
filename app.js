const { uri } = require("./uri");

//set port
const port = 3002;

// const pass = "zZRK0AgPwk99fW9K";

// const URI = `mongodb://dejesusmelnard:${pass}@ac-rqst6ya-shard-00-00.acl3rer.mongodb.net:27017,ac-rqst6ya-shard-00-01.acl3rer.mongodb.net:27017,ac-rqst6ya-shard-00-02.acl3rer.mongodb.net:27017/preparation?ssl=true&replicaSet=atlas-17b4b2-shard-0&authSource=admin&retryWrites=true&w=majority`;

//  This line imports the built-in path module in Node.js, which provides utilities for working with file and directory paths.
const path = require("path");
// This line imports the express module, which is a popular web framework for Node.js.
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
// const csrf = require("csurf");
const { csrfSync } = require("csrf-sync");
const flash = require("express-flash");
const multer = require("multer");

const User = require("./models/user");
//import error controller
const errorController = require("./controllers/error");

const { csrfSynchronisedProtection } = csrfSync({
  getTokenFromRequest: (req) => req.body.csrfToken,
});

const app = express();

const store = new MongoDBStore({
  uri: uri,
  collection: "session",
});
// const csrfProtecttion = csrf();

// configuration object
//  Disk storage is in the end a storage engine which you can use with multer
// It takes two keys, it takes the destination and it takes the file name.
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images"); // null if its error or empty
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

// filter function to filter incoming file before it save through its file type.
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true); // null as an error and true if want to accept the file.
  } else {
    cb(null, false); // false means file not accepted.
  }
};

// the "view engine" is a special configuration to set ejs as a template engine.
// a reserved confituration key which is understood by express.js
app.set("view engine", "ejs");
// this is to tell engine where to be found the template.
app.set("views", "views");

// import routes
const adminRoutes = require("./routes/admin");
const preparationRoutes = require("./routes/preparation");
const authRoutes = require("./routes/auth");

// parsing middleware. it is use to parse data from form the request
app.use(express.urlencoded({ extended: false }));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// static middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

// setup another middleware to initialize session.
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
// app.use(csrfProtecttion);
app.use(csrfSynchronisedProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  // console.log("sync dummy error");
  // throw new Error("Sync dummy");
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      // throw new Error("dummy");
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.session.isLoggedIn;
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

app.use("/admin", adminRoutes);
app.use(preparationRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);

// this middleware will be catch all the request route that is not define
app.use(errorController.get404);

// next error handling middleware.
app.use((err, req, res, next) => {
  console.log("error handler middleware");
  console.log(err);

  res.status(500).render("500", {
    pageTitle: "Error",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
  // res.redirect("/500");
});

mongoose
  .connect(uri)
  .then((result) => {
    app.listen(port, () => {
      console.log(`app.js server is running in port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
