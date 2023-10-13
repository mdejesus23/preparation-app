const Theme = require("../models/themes");
const Result = require("../models/result");
const User = require("../models/user");

const { validationResult } = require("express-validator");

const ITEMS_PER_PAGE = 2;

exports.getHomePage = (req, res, next) => {
  res.render("preparation/index", {
    path: "/",
    pageTitle: "Home",
    username: req.user ? req.user.username : null,
  });
};

exports.getThemes = async (req, res, next) => {
  const page = +req.query.page || 1; // if there is no query parameter the default value will be 1.
  let totalItems;

  try {
    const numThemes = await Theme.find().countDocuments(); // Count all documents in the "Product" collection
    totalItems = numThemes; // total number of documents fetched in the database.

    const themes = await Theme.find()
      .skip((page - 1) * ITEMS_PER_PAGE) // Skip the previous pages with the items per page.
      .limit(ITEMS_PER_PAGE); // Limit the result to the current page's items
    res.render("preparation/themes", {
      themes: themes,
      path: "/themes",
      pageTitle: "Themes List",
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems, // true if the number of docs fetch is greater than ITEMS_PER_PAGE * page.
      hasPreviousPage: page > 1, // true if current page is greater than 1
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE), //  Math.ceil() increases the integer part of the number by 1 to round it up to the next higher integer.
      username: req.user.username,
    });
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
};

exports.getReadings = async (req, res, next) => {
  const themeId = req.params.themeId;
  console.log(req.themeAccess);

  try {
    const theme = await Theme.findById(themeId);

    let readings;

    if (theme.readings.length > 0) {
      const historical = theme.readings.filter((reading) => {
        return reading.category == "Historical";
      });

      const prophetical = theme.readings.filter((reading) => {
        return reading.category == "Prophetical";
      });

      const epistle = theme.readings.filter((reading) => {
        return reading.category == "Epistle";
      });

      const gospel = theme.readings.filter((reading) => {
        return reading.category == "Gospel";
      });

      // create a copy of all the readings
      readings = {
        historical: historical,
        prophetical: prophetical,
        epistle: epistle,
        gospel: gospel,
      };
    } else {
      readings = undefined;
    }

    res.render("preparation/readings", {
      theme: theme,
      readings: readings,
      path: "/readings",
      pageTitle: "Readings List",
      votedReadings: req.user.votedReadingIds,
      username: req.user.username,
    });
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
};

exports.checkPasscode = async (req, res, next) => {
  const themeId = req.params.themeId;
  const passcode = req.body.passcode;

  try {
    const theme = await Theme.findById(themeId);
    if (!theme) {
      const error = new Error("Theme not found.");
      error.httpStatusCode = 404; // Set appropriate status code for "Not Found"
      return next(error);
    }

    if (theme.passcode !== passcode) {
      console.log("passcode did match!");
      res.status(401).json({ message: "Passcode does not match" });
    } else {
      // if the passcode did match
      req.themeAccess = true;
      res.status(202).json({ message: "passcode did match" });
    }
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
};

exports.voteReading = async (req, res, next) => {
  const themeId = req.params.themeId;
  const readingId = req.header("X-Request-ID");

  try {
    const theme = await Theme.findById(themeId);

    const reading = theme.readings.id({ _id: readingId });

    const user = await req.user.voteReading(reading);
    // add/minus vote count in the theme collection
    if (user.votedReadingIds.includes(readingId)) {
      reading.voteCount += 1;
    } else {
      reading.voteCount -= 1;
    }
    await theme.save();

    res.status(200).json({ message: "Vote counted" });
  } catch (err) {
    res.status(500).json({ message: "Voting failed" });
  }
};

exports.getConsolidatedReadings = async (req, res, next) => {
  const themeId = req.params.themeId;
  const themeTitle = req.body.themeTitle;
  const entranceSong = req.body.entranceSong;
  const firstReading = req.body.firstReading;
  const firstPsalm = req.body.firstPsalm;
  const secondReading = req.body.secondReading;
  const secondPsalm = req.body.secondPsalm;
  const thirdReading = req.body.thirdReading;
  const thirdPsalm = req.body.thirdPsalm;
  const gospelReading = req.body.gospelReading;
  const finalSong = req.body.finalSong;

  try {
    const theme = await Theme.findById(themeId);

    let readings;

    if (theme.readings.length > 0) {
      let historical = theme.readings
        .filter((reading) => {
          return reading.category == "Historical";
        })
        .sort((a, b) => b.voteCount - a.voteCount);

      let prophetical = theme.readings
        .filter((reading) => {
          return reading.category == "Prophetical";
        })
        .sort((a, b) => b.voteCount - a.voteCount);

      let epistle = theme.readings
        .filter((reading) => {
          return reading.category == "Epistle";
        })
        .sort((a, b) => b.voteCount - a.voteCount);

      let gospel = theme.readings
        .filter((reading) => {
          return reading.category == "Gospel";
        })
        .sort((a, b) => b.voteCount - a.voteCount);

      // create a copy of all the readings
      readings = {
        historical: historical,
        prophetical: prophetical,
        epistle: epistle,
        gospel: gospel,
      };
    } else {
      readings = undefined;
    }

    res.render("preparation/consolidated", {
      theme: theme,
      readings: readings,
      path: "/readings",
      pageTitle: "Consolidated List",
      votedReadings: req.user.votedReadingIds,
      hasError: false,
      errorMessage: "",
      validationErrors: [],
      username: req.user.username,
      result: {
        entranceSong,
        firstReading,
        firstPsalm,
        secondReading,
        secondPsalm,
        thirdReading,
        thirdPsalm,
        gospelReading,
        finalSong,
      },
    });
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
};

exports.getResult = async (req, res, next) => {
  try {
    const results = await Result.find({ userId: req.user._id });
    res.render("preparation/result", {
      results: results,
      pageTitle: "Preparation Result",
      path: "/result",
      username: req.user.username,
    });
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error); // call next to proceeds to the next error handler middleware
  }
};

exports.postAddResult = async (req, res, next) => {
  const themeId = req.body.themeId;
  const themeTitle = req.body.themeTitle;
  const entranceSong = req.body.entranceSong;
  const firstReading = req.body.firstReading;
  const firstPsalm = req.body.firstPsalm;
  const secondReading = req.body.secondReading;
  const secondPsalm = req.body.secondPsalm;
  const thirdReading = req.body.thirdReading;
  const thirdPsalm = req.body.thirdPsalm;
  const gospelReading = req.body.gospelReading;
  const finalSong = req.body.finalSong;

  try {
    const theme = await Theme.findById(themeId);
    let readings;

    if (theme.readings.length > 0) {
      let historical = theme.readings
        .filter((reading) => {
          return reading.category == "Historical";
        })
        .sort((a, b) => b.voteCount - a.voteCount);

      let prophetical = theme.readings
        .filter((reading) => {
          return reading.category == "Prophetical";
        })
        .sort((a, b) => b.voteCount - a.voteCount);

      let epistle = theme.readings
        .filter((reading) => {
          return reading.category == "Epistle";
        })
        .sort((a, b) => b.voteCount - a.voteCount);

      let gospel = theme.readings
        .filter((reading) => {
          return reading.category == "Gospel";
        })
        .sort((a, b) => b.voteCount - a.voteCount);

      // create a copy of all the readings
      readings = {
        historical: historical,
        prophetical: prophetical,
        epistle: epistle,
        gospel: gospel,
      };
    } else {
      readings = undefined;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("preparation/consolidated", {
        theme: theme,
        readings: readings,
        path: "/readings",
        pageTitle: "Consolidated List",
        votedReadings: req.user.votedReadingIds,
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
        hasError: true,
        username: req.user.username,
        result: {
          entranceSong,
          firstReading,
          firstPsalm,
          secondReading,
          secondPsalm,
          thirdReading,
          thirdPsalm,
          gospelReading,
          finalSong,
        },
      });
    }

    const result = new Result({
      title: themeTitle,
      entranceSong,
      firstReading,
      firstPsalm,
      secondReading,
      secondPsalm,
      thirdReading,
      thirdPsalm,
      gospel: gospelReading,
      finalSong,
      userId: req.user._id,
    });

    await result.save();
    const user = await User.findById(req.user._id);
    console.log(user);

    // reset user votedReadings record
    user.votedReadings = [];
    await user.save();

    res.redirect("/results");
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
};

exports.deleteResult = async (req, res, next) => {
  const resultId = req.params.resultId;

  try {
    const result = await Result.findById(resultId);
    if (!result) {
      return next(new Error("Product not found"));
    }

    await result.deleteOne({ _id: resultId, userId: req.user._id });
    console.log("result deleted!");
    res.status(200).json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ message: "Deleting product failed!" });
  }
};
