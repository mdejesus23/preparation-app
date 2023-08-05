const express = require("express");

const preparationControllers = require("../controllers/preparation");

const router = express.Router();

router.get("/", preparationControllers.getReadings);

router.get("/themes", preparationControllers.getThemes);

module.exports = router;
