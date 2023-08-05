//  This line imports the built-in path module in Node.js, which provides utilities for working with file and directory paths.
const path = require("path");
// This line imports the express module, which is a popular web framework for Node.js.
const express = require("express");
const app = express();

//import error controller
const errorController = require("./controllers/error");

//import mongoConnect from database connection
const { mongoConnect } = require("./util/database");

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

// parsing middleware. it is use to parse data from form the request
app.use(express.urlencoded({ extended: false }));
// static middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(preparationRoutes);

// this middleware will be catch all the request route that is not define
app.use(errorController.get404);

mongoConnect(() => {
  app.listen(port, () => {
    console.log(`app.js server is running in port ${port}`);
  });
});
