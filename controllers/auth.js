const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // built-in node.js module. provides cryptographic functionality.

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.API_KEY);

require("dotenv").config();

const { validationResult } = require("express-validator");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: null,
    successMessage: null,
    prevInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.getSignup = (req, res, next) => {
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

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      prevInput: {
        email: email,
        password: password,
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
    res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: null,
      successMessage: "Signup Successfully!",
      prevInput: {
        email: "",
        password: "",
      },
      validationErrors: [],
    });

    // send email
    const msg = {
      to: email,
      from: "dejesusmelnard@gmail.com", // Use the email address or domain you verified above
      subject: "Signup Succeeded",
      text: "and easy to do anywhere, even with Node.js",
      html: "<h1>You successfully signed up in the Preparation app.</h1>",
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error("Error sending email:", error);
      next(error);
    }
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
        // const passwordResetUrl =
        //   process.env.NODE_ENV === development
        //     ? `http://localhost:3002/reset/${token}`
        //     : `https://preparation-app.onrender.com/reset/${token}`;

        // The result will be a new timestamp representing the time one hour from the current moment.
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "",
          successMessage: "Please check your email to change your password.",
          prevInput: {
            email: "",
            password: "",
          },
          validationErrors: [],
        });

        // send email
        const msg = {
          to: req.body.email,
          from: "dejesusmelnard@gmail.com", // Use the email address or domain you verified above
          subject: "Password Reset",
          text: "and easy to do anywhere, even with Node.js",
          html: `
          <h1>Preparation App Password Resetting</h1>
          <p>You requested password reset</p>
          <p>Click this <a href=${
            process.env.NODE_ENV === "development"
              ? `http://localhost:3002/reset/${token}`
              : `https://preparation-app.onrender.com/reset/${token}`
          }>link</a> to set a new password</p>
          `,
        };

        //ES6
        sgMail
          .send(msg)
          .then((result) => {
            console.log("sending password reset email successfully");
          })
          .catch((err) => {
            console.log(err);
            next(err);
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

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "New Password",
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

    return res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: "",
      successMessage: "Password successfully changed.",
      prevInput: {
        email: "",
        password: "",
      },
      validationErrors: [],
    });
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
};
