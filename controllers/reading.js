exports.getReadings = (req, res, next) => {
  res.render("readings/index", {
    path: "/",
    // readingLists: readings,
    pageTitle: "users List",
  });
};

exports.getThemes = (req, res, next) => {
  res.render("readings/themes", {
    path: "/themes",
    pageTitle: "Themes List",
  });
};
