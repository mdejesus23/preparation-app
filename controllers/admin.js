const Theme = require("../models/themes");

exports.getAddTheme = (req, res, next) => {
  res.render("admin/edit-theme", {
    pageTitle: "Add Themes",
    path: "/admin/add-themes",
    editing: false,
  });
};

exports.postAddTheme = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const readings = [];

  const theme = new Theme(title, imageUrl, description, readings, null);

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

exports.getEditTheme = (req, res, next) => {
  const editMode = req.query.edit;
  const themeId = req.params.themeId;
  console.log(editMode);

  Theme.findById(themeId)
    .then((theme) => {
      console.log(theme);
      if (!theme) {
        return res.redirect("/");
      }
      res.render("admin/edit-theme", {
        pageTitle: "Edit Theme",
        path: "/admin/edit-theme",
        editing: editMode,
        theme: theme,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getThemes = async (req, res, next) => {
  try {
    const themes = await Theme.fetchAll();
    console.log(themes);
    res.render("admin/themes", {
      themes: themes,
      pageTitle: "Admin Themes",
      path: "/admin/themes",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditThemes = (req, res, next) => {
  const themeId = req.body.themeId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const updatedReadings = [];

  const theme = new Theme(
    updatedTitle,
    updatedImageUrl,
    updatedDescription,
    updatedReadings,
    themeId
  );
  theme
    .save()
    .then((result) => {
      console.log(result);
      res.redirect("/admin/themes");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteTheme = async (req, res, next) => {
  const themeId = req.body.themeId;
  try {
    await Theme.deleteById(themeId);
    res.redirect("/admin/themes");
  } catch (err) {
    console.log(err);
  }
};
