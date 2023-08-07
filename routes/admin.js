const express = require("express");

const adminController = require("../controllers/admin");

// create a Route instance
const router = express.Router();

router.get("/add-themes", adminController.getAddTheme);

router.post("/add-theme", adminController.postAddTheme);

router.get("/edit-theme/:themeId", adminController.getEditTheme);

router.post("/edit-theme", adminController.postEditThemes);

router.get("/themes", adminController.getThemes);

router.post("/delete-theme", adminController.postDeleteTheme);

module.exports = router;
