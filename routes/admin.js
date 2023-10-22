const express = require("express");

const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../routesProtector/is-auth");

// create a Route instance
const router = express.Router();

router.get("/add-themes", isAuth, adminController.getAddTheme);

router.post(
  "/add-theme",
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .trim()
      .withMessage("Please enter a valid title min of 3 characters"),
    body("description")
      .isLength({ min: 5, max: 400 })
      .trim()
      .withMessage(
        "Please enter a valid description min of five and max of 400 characters!"
      ),
    body("passcode", "Please enter a valid passcode min of 4 characters")
      .isString()
      .isLength({ min: 4 })
      .trim(),
  ],
  isAuth,
  adminController.postAddTheme
);

router.get("/edit-theme/:themeId", isAuth, adminController.getEditTheme);

router.post(
  "/edit-theme",
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .trim()
      .withMessage("Please enter a valid title min of 3 characters"),
  ],
  isAuth,
  adminController.postEditThemes
);

router.get("/themes", isAuth, adminController.getThemes);

router.delete("/theme/:themeId", isAuth, adminController.deleteTheme);

router.get("/add-readings/:themeId", isAuth, adminController.getAddReading);

router.post("/add-readings/:themeId", isAuth, adminController.postAddReading);

router.delete(
  "/delete-reading/:themeId",
  isAuth,
  adminController.deleteReading
);

router.post(
  "/theme/reset-votes/:themeId",
  isAuth,
  adminController.postThemeResetVotes
);

module.exports = router;
