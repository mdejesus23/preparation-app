const express = require("express");

const preparationControllers = require("../controllers/preparation");

const router = express.Router();

router.get("/", preparationControllers.getThemes);

router.get("/readings/:themeId", preparationControllers.getReadings);

router.post("/readings/vote/:readingId", preparationControllers.postVote);

module.exports = router;
