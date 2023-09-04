const Theme = require("../models/themes");

exports.getThemes = async (req, res, next) => {
  try {
    const themes = await Theme.find();
    res.render("preparation/index", {
      themes: themes,
      path: "/",
      pageTitle: "Themes List",
    });
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
};

exports.getReadings = async (req, res, next) => {
  try {
    const themeId = req.params.themeId;
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
    });
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
};

exports.postVoteReading = (req, res, next) => {
  const themeId = req.params.themeId;
  const readingId = req.body.readingId;

  Theme.findById(themeId)
    .then((theme) => {
      // throw new Error("Dummy async error");
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

      const reading = theme.readings.id({ _id: readingId });
      // console.log(reading);
      req.user.voteReading(reading).then((user) => {
        // console.log(reading);
        // console.log(user.votedReadingIds);

        // add/minus vote count in the theme collection
        if (user.votedReadingIds.includes(readingId)) {
          reading.voteCount = reading.voteCount + 1;
          theme.save();
        } else {
          reading.voteCount = reading.voteCount - 1;
          theme.save();
        }

        res.render("preparation/readings", {
          theme: theme,
          readings: readings,
          path: "/readings",
          pageTitle: "Readings List",
          votedReadings: user.votedReadingIds,
        });
      });
    })
    .catch((err) => {
      console.log("error");
      const error = new Error(err); // create an error object.
      error.httpStatusCode = 500; // set error object property
      return next(error);
    });
};
