const express = require("express");

const { body } = require("express-validator");

const preparationControllers = require("../controllers/preparation");
const isAuth = require("../routesProtector/is-auth");
const isThemeGetAccess = require("../routesProtector/is-themeGetAccess");

const router = express.Router();

router.get("/", preparationControllers.getHomePage);

router.get("/themes", isAuth, preparationControllers.getThemes);

router.get("/readings/:themeId", isAuth, preparationControllers.getReadings);

router.get(
  "/readings/:themeId",
  isAuth,
  isThemeGetAccess,
  preparationControllers.getReadings
);

router.post("/readings/:themeId", isAuth, preparationControllers.checkPasscode);

router.put(
  "/readings/vote/:themeId",
  isAuth,
  preparationControllers.voteReading
);

router.get(
  "/readings/consolidated/:themeId",
  isAuth,
  preparationControllers.getConsolidatedReadings
);

router.get("/results", isAuth, preparationControllers.getResult);

router.post(
  "/results",
  [
    body("entranceSong")
      .isString()
      .isLength({ min: 4 })
      .withMessage("Please provide an entrance song."),
    body("firstReading")
      .isString()
      .isLength({ min: 4 })
      .withMessage("first reading should not be empty."),
    body("firstPsalm")
      .isString()
      .isLength({ min: 4 })
      .withMessage("Please provide psalm for 1 reading"),
    body("secondReading")
      .isString()
      .isLength({ min: 4 })
      .withMessage("second reading should not be empty."),
    body("secondPsalm")
      .isString()
      .isLength({ min: 4 })
      .withMessage("Please provide psalm for 2 reading"),
    body("thirdReading")
      .isString()
      .isLength({ min: 4 })
      .withMessage("third reading should not be empty."),
    body("thirdPsalm")
      .isString()
      .isLength({ min: 4 })
      .withMessage("Please provide psalm for 3 reading"),
    body("gospelReading")
      .isString()
      .isLength({ min: 4 })
      .withMessage("Godpel reading should not be empty."),
    body("finalSong")
      .isString()
      .isLength({ min: 4 })
      .withMessage("Please provide a final song."),
  ],
  isAuth,
  preparationControllers.postAddResult
);

router.delete(
  "/results/:resultId",
  isAuth,
  preparationControllers.deleteResult
);

module.exports = router;
