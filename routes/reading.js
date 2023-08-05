const express = require("express");

const readingController = require("../controllers/reading");

const router = express.Router();

router.get("/", readingController.getReadings);

router.get("/themes", readingController.getThemes);

module.exports = router;
