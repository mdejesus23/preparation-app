const Theme = require("../models/themes");

exports.getAddTheme = (req, res, next) => {
  res.render("admin/add-themes", {
    pageTitle: "Add Themes",
    path: "/admin/add-themes",
  });
};

exports.postAddTheme = async (req, res, next) => {
  const themeTitle = req.body.theme;
  const category = req.body.category;
  const words = req.body.words;

  const theme = new Theme(themeTitle, category, words);

  theme
    .save()
    .then((result) => {
      console.log(result);
      console.log("Themes Created!");
      res.redirect("/admin/themes");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAdminThemes = async (req, res, next) => {
  try {
    const themes = await Theme.fetchAll();
    res.render("admin/themes", {
      themes: themes,
      pageTitle: "Admin Themes",
      path: "/admin/themes",
    });
  } catch (err) {
    console.log(err);
  }
};
