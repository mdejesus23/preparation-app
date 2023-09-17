const Theme = require("../models/themes");

const ITEMS_PER_PAGE = 2;

exports.getThemes = async (req, res, next) => {
  const page = +req.query.page || 1; // if there is no query parameter the default value will be 1.
  let totalItems;
  try {
    const numThemes = await Theme.find().countDocuments(); // Count all documents in the "Product" collection
    totalItems = numThemes; // total number of documents fetched in the database.

    const themes = await Theme.find()
      .skip((page - 1) * ITEMS_PER_PAGE) // Skip the previous pages with the items per page.
      .limit(ITEMS_PER_PAGE); // Limit the result to the current page's items
    res.render("preparation/index", {
      themes: themes,
      path: "/",
      pageTitle: "Themes List",
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems, // true if the number of docs fetch is greater than ITEMS_PER_PAGE * page.
      hasPreviousPage: page > 1, // true if current page is greater than 1
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE), //  Math.ceil() increases the integer part of the number by 1 to round it up to the next higher integer.
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
      req.user
        .voteReading(reading)
        .then((user) => {
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
        })
        .catch((err) => {
          console.log(err);
          res.redirect(`/readings/${themeId}`);
        });
    })
    .catch((err) => {
      console.log("error");
      const error = new Error(err); // create an error object.
      error.httpStatusCode = 500; // set error object property
      return next(error);
    });
};

exports.getConsolidatedReadings = (req, res, next) => {
  const themeId = req.params.themeId;

  Theme.findById(themeId)
    .then((theme) => {
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
      });
    })
    .catch((err) => {
      const error = new Error(err); // create an error object.
      error.httpStatusCode = 500; // set error object property
      return next(error);
    });
};
