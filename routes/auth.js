const express = require("express");

const User = require("../models/user");

const { body } = require("express-validator");

const router = express.Router();

const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
    body("password", "Password has to be valid.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    body("username")
      .isString()
      .isLength({ min: 3 })
      .trim()
      .withMessage("Please enter a valid username min of 3 characters"),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(async (value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            // create a rejected promise to asynchronous code.
            return Promise.reject(
              "Email already exists, please pick a different one."
            );
          }
        });
      })
      .normalizeEmail(),

    body(
      "password",
      "Password must contain numbers and text with at least 6 characters."
    )
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),

    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password have to match!");
        }

        return true;
      }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postResetPassword);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
