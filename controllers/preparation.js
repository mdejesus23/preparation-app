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
    console.log(err);
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

      console.log(historical);

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
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postVote = (req, res, next) => {
  const readingId = req.params.readingId;
  const themeId = req.body.themeId;

  Theme.findById(themeId)
    .then((theme) => {
      const reading = theme.readings.id({ _id: readingId });
      reading.voteCount = reading.voteCount + 1;
      return theme.save();
    })
    .then((result) => {
      // console.log(result);
      res.redirect(`/readings/${themeId}`);
    })
    .catch((err) => {
      console.log(err);
    });
};
