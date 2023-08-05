const Theme = require("../models/themes");

exports.getReadings = (req, res, next) => {
  res.render("preparation/index", {
    path: "/",
    // readingLists: readings,
    pageTitle: "users List",
  });
};

exports.getThemes = async (req, res, next) => {
  try {
    const themes = await Theme.fetchAll();
    res.render("preparation/themes", {
      themes: themes,
      path: "/themes",
      pageTitle: "Themes List",
    });
  } catch (err) {
    console.log(err);
  }
};
