const User = require("./models/user");

const pass = "zZRK0AgPwk99fW9K";

const URI = `mongodb://dejesusmelnard:${pass}@ac-rqst6ya-shard-00-00.acl3rer.mongodb.net:27017,ac-rqst6ya-shard-00-01.acl3rer.mongodb.net:27017,ac-rqst6ya-shard-00-02.acl3rer.mongodb.net:27017/preparation?ssl=true&replicaSet=atlas-17b4b2-shard-0&authSource=admin&retryWrites=true&w=majority`;

//  This line imports the built-in path module in Node.js, which provides utilities for working with file and directory paths.
const path = require("path");
// This line imports the express module, which is a popular web framework for Node.js.
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();

const store = new MongoDBStore({
  uri: URI,
  collection: "session",
});

//import error controller
const errorController = require("./controllers/error");

//import mongoConnect from database connection

//set port
const port = 3002;

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
// static middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

// setup another middleware to initialize session.
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(async (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  try {
    const user = await User.findById(req.session.user._id);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
});

app.use("/admin", adminRoutes);
app.use(preparationRoutes);
app.use(authRoutes);

// this middleware will be catch all the request route that is not define
app.use(errorController.get404);

mongoose
  .connect(URI)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Melnard",
          email: "dejesusmelnard@gmail.com",
          result: {
            themes: [],
          },
        });
        user.save();
      }
    });
    app.listen(port, () => {
      console.log(`app.js server is running in port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
