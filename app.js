const path = require("path"); //  This line imports the built-in path module in Node.js, which provides utilities for working with file and directory paths.
const fs = require("fs");

const express = require("express"); // This line imports the express module, which is a popular web framework for Node.js.
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const { csrfSync } = require("csrf-sync");
const flash = require("express-flash");
const multer = require("multer");
const User = require("./models/user");
require("dotenv").config();
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const errorController = require("./controllers/error"); //import error controller

const app = express();

app.use(cookieParser());

const MONGODB_URI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ac-rqst6ya-shard-00-00.acl3rer.mongodb.net:27017,ac-rqst6ya-shard-00-01.acl3rer.mongodb.net:27017,ac-rqst6ya-shard-00-02.acl3rer.mongodb.net:27017/${process.env.MONGO_DEFAULT_DATABASE}?ssl=true&replicaSet=atlas-17b4b2-shard-0&authSource=admin&retryWrites=true&w=majority`;

// Used to retrieve the token submitted by the user in a form or in the header thru fetch api in the request body.
const { csrfSynchronisedProtection } = csrfSync({
  getTokenFromRequest: (req) => {
    return req.body["csrfToken"] || req.headers["csrf-token"];
  },
});

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "session",
});

const fileStorage = multer.memoryStorage();

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

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// create nonce as local variables for CSP
app.use((req, res, next) => {
  res.locals.nonce1 = crypto.randomBytes(16).toString("hex");
  res.locals.nonce2 = crypto.randomBytes(16).toString("hex");
  res.locals.nonce3 = crypto.randomBytes(16).toString("hex");
  res.locals.nonce4 = crypto.randomBytes(16).toString("hex");
  res.locals.nonce5 = crypto.randomBytes(16).toString("hex");
  res.locals.nonce6 = crypto.randomBytes(16).toString("hex");
  res.locals.nonce7 = crypto.randomBytes(16).toString("hex");
  res.locals.nonce8 = crypto.randomBytes(16).toString("hex");
  res.locals.nonce9 = crypto.randomBytes(16).toString("hex");
  res.locals.nonce10 = crypto.randomBytes(16).toString("hex");
  next();
});

// implement CSP directives
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          (req, res) => `'nonce-${res.locals.nonce1}'`, // admin.js
          (req, res) => `'nonce-${res.locals.nonce2}'`, // main.js
          (req, res) => `'nonce-${res.locals.nonce3}'`, // prep.js
          (req, res) => `'nonce-${res.locals.nonce4}'`, // consolidated.js
          (req, res) => `'nonce-${res.locals.nonce5}'`, // index.js
          (req, res) => `'nonce-${res.locals.nonce6}'`, // result.js
          (req, res) => `'nonce-${res.locals.nonce7}'`, // themes.js
          (req, res) => `'nonce-${res.locals.nonce8}'`, // scroll.js
          (req, res) => `'nonce-${res.locals.nonce9}'`, // footer.js
          (req, res) => `'nonce-${res.locals.nonce10}'`, // reset-votes
        ],
        scriptSrcAttr: ["'self'", "'unsafe-inline'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "fonts.googleapis.com",
          "https://kit.fontawesome.com/372429fb46.js",
        ],
        connectSrc: ["'self'"], // Allow connections to the same origin
        frameSrc: ["'self'"], // Allow frames from the same origin
        imgSrc: ["*"], // allow image source
      },
    },
  })
);

// compress file
app.use(compression());

// middleware for logging HTTP request information.
app.use(morgan("combined", { stream: accessLogStream }));

// parsing middleware. it is use to parse data from form the request
app.use(express.urlencoded({ extended: false }));

app.use(express.json()); // Middleware to parse JSON request bodies

// middleware for file/image storage
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// static middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

// Set up your middleware based on the NODE_ENV environment variable
if (process.env.NODE_ENV === "production") {
  // Production middleware configuration
  app.set("trust proxy", 1); // trust first proxy
  app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      store: store,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        httpOnly: true,
        secure: true, // Ensure your app is running over HTTPS in production
      },
    })
  );
} else {
  // Development middleware configuration
  app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      store: store,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        httpOnly: true,
        secure: false, 
      },
    })
  );
}

// middleware for csrf protection
app.use(csrfSynchronisedProtection);

// middleware for storing or retrieving flash messages.
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(preparationRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);

// this middleware will be catch all the request route that is not define
app.use(errorController.get404);

// next error handling middleware.
app.use((err, req, res, next) => {
  console.log(err);

  res.status(500).render("500", {
    pageTitle: "Error",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
    username: req.user ? req.user.username : null,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT || 3002, () => {
      console.log(`app.js server is running!`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
