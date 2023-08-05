const express = require("express");

const adminController = require("../controllers/admin");

// create a Route instance
const router = express.Router();

router.get("/add-themes", adminController.getAddTheme);

router.post("/add-theme", adminController.postAddTheme);

router.get("/themes", adminController.getAdminThemes);

module.exports = router;
