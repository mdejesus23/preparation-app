const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // built-in node.js module. provides cryptographic functionality.

const { apiKey } = require("../uri");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const { validationResult } = require("express-validator");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: apiKey,
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
    prevInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("success");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: null,
    successMessage: null,
    prevInput: {
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      prevInput: {
        email: email,
        password: password,
        username: username,
      },
      validationErrors: errors.array(),
    });
  }

  try {
    const user = await User.findOne({ email: email });
    // if the user email is not find. means the user email not yet registered.
    if (!user) {
      req.flash("error", "Invalid email");
      return res.redirect("/login");
    }

    const doMatch = await bcrypt.compare(password, user.password);
    // doMatch will have value of true or false
    if (doMatch) {
      req.session.user = user;
      req.session.isLoggedIn = true;
      return req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    }

    // if password didn't match
    // req.flash("error", "Invalid email or password"); // takes a key 1st arg. and then the message.
    res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: "Invalid email or password",
      prevInput: {
        email: email,
        password: password,
      },
      validationErrors: [],
    });
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req); // collect errors in the middleware in the request.
  // if errors occur
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      successMessage: null,
      prevInput: {
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  try {
    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email: email,
      username: username,
      password: hashedPassword,
      votedReadings: [],
    });
    await user.save();

    // req.flash("success", "Signup successfully!");
    // res.redirect("/signup");
    res.render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: null,
      successMessage: "Signup successfully!",
      prevInput: {
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      },
      validationErrors: [],
    });
    return transporter.sendMail({
      to: email,
      from: "dejesusmelnard@gmail.com",
      subject: "Signup Succeeded",
      html: "<h1>You successfully signed up</h1>",
    });
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
};

exports.postLogout = (req, res, next) => {
  // this is a method provided with our session package we are using.
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found!");
          res.redirect("/reset");
        }

        user.resetToken = token;
        // The result will be a new timestamp representing the time one hour from the current moment.
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/login");
        transporter.sendMail({
          to: req.body.email,
          from: "dejesusmelnard@gmail.com",
          subject: "Password Reset",
          html: `
          <h1>Password Resetting</h1>
          <p>You requested password reset</p>
          <p>Click this <a href='http://localhost:3002/reset/${token}'>link</a> to set a new password</p>
          `,
        });
      })
      .catch((err) => {
        const error = new Error(err); // create an error object.
        error.httpStatusCode = 500; // set error object property
        return next(error);
      });
  });
};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;
  let message = req.flash("error");

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "New Password",
      errorMessage: message,
      userId: user._id.toString(), // we can get user data because of the middleware in the app.js which assign user.
      passwordToken: token,
    });
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
  //
};

exports.postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  try {
    const user = await User.findOne({
      _id: userId,
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
    });

    resetUser = user;
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    await resetUser.save();

    res.redirect("/login");
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
};
