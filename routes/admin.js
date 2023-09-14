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

router.post("/delete-theme", isAuth, adminController.postDeleteTheme);

router.get("/add-readings/:themeId", isAuth, adminController.getAddReading);

router.post("/add-readings/:themeId", isAuth, adminController.postAddReading);

module.exports = router;
