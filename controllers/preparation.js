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
    const readings = {
      historical: historical,
      prophetical: prophetical,
      epistle: epistle,
      gospel: gospel,
    };

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
