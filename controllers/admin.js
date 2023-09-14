const Theme = require("../models/themes");

const { validationResult } = require("express-validator");

exports.getAddTheme = (req, res, next) => {
  res.render("admin/edit-theme", {
    pageTitle: "Add Themes",
    path: "/admin/add-themes",
    editing: false,
    hasError: false,
    errorMessage: null,
    theme: {
      title: "",
      imageUrl: "",
      description: "",
      readings: "",
    },
    validationErrors: [],
  });
};

exports.postAddTheme = async (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const description = req.body.description;
  const readings = [];

  console.log(image);

  if (!image) {
    return res.status(422).render("admin/edit-theme", {
      pageTitle: "Add Themes",
      path: "/admin/add-themes",
      editing: false,
      hasError: true,
      theme: {
        title: title,
        description: description,
        readings: readings,
      },
      errorMessage: "Attached file is not an image",
      validationErrors: [],
    });
  }

  const imageUrl = image.path; // image path is a path to the file system with image directory.

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-theme", {
      pageTitle: "Add Themes",
      path: "/admin/add-themes",
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      theme: {
        title: title,
        description: description,
        readings: readings,
      },
      validationErrors: errors.array(),
    });
  }

  const theme = new Theme({
    title: title,
    imageUrl: imageUrl,
    description: description,
    readings: readings,
    userId: req.session.user,
  });
  theme
    .save()
    .then((result) => {
      res.redirect("/admin/themes");
    })
    .catch((err) => {
      const error = new Error(err); // create an error object.
      error.httpStatusCode = 500; // set error object property
      return next(error);
    });
};

exports.getEditTheme = (req, res, next) => {
  const editMode = req.query.edit;
  const themeId = req.params.themeId;

  if (!editMode) {
    return res.redirect("/");
  }

  Theme.findById(themeId)
    .then((theme) => {
      if (!theme) {
        return res.redirect("/");
      }
      res.render("admin/edit-theme", {
        pageTitle: "Edit Theme",
        path: "/admin/edit-theme",
        editing: editMode,
        theme: theme,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err); // create an error object.
      error.httpStatusCode = 500; // set error object property
      return next(error);
    });
};

exports.getThemes = async (req, res, next) => {
  let errMessage = req.flash("error");
  if (errMessage.length > 0) {
    errMessage = errMessage[0];
  } else {
    errMessage = null;
  }

  let successMessage = req.flash("success");
  if (successMessage.length > 0) {
    successMessage = successMessage[0];
  } else {
    successMessage = null;
  }

  try {
    const themes = await Theme.find({ userId: req.user._id });
    res.render("admin/themes", {
      themes: themes,
      pageTitle: "Admin Themes",
      path: "/admin/themes",
      errorMessage: errMessage,
      successMessage: successMessage,
    });
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
};

exports.postEditThemes = (req, res, next) => {
  const themeId = req.body.themeId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-theme", {
      pageTitle: "Edit Themes",
      path: "/admin/edit-themes",
      editing: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      theme: {
        _id: themeId,
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        description: updatedDescription,
      },
      validationErrors: errors.array(),
    });
  }

  Theme.findById(themeId)
    .then((existingTheme) => {
      if (existingTheme.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      existingTheme.title = updatedTitle;
      existingTheme.imageUrl = updatedImageUrl;
      existingTheme.description = updatedDescription;
      return existingTheme.save().then((result) => {
        // console.log(result);
        res.redirect("/admin/themes");
      });
    })
    .catch((err) => {
      const error = new Error(err); // create an error object.
      error.httpStatusCode = 500; // set error object property
      return next(error);
    });
};

exports.postDeleteTheme = async (req, res, next) => {
  const themeId = req.body.themeId;
  try {
    await Theme.deleteOne({ _id: themeId, userId: req.user._id });
    res.redirect("/admin/themes");
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
};

exports.postReading = (req, res, next) => {
  const word = req.body.reading;
  const category = req.body.category;
  let initialVote = 0;
  const themeId = req.body.themeId;

  if (!word) {
    req.flash("error", "Reading is not valid!");
    return res.redirect("/admin/themes");
  }

  Theme.findById(themeId)
    // .select("readings -_id")
    .then((theme) => {
      theme.readings.push({
        reading: word,
        category: category,
        voteCount: initialVote,
      });
      return theme.save();
    })
    .then(() => {
      req.flash("success", "Reading added successfully!");
      res.redirect("/admin/themes");
    })
    .catch((err) => {
      const error = new Error(err); // create an error object.
      error.httpStatusCode = 500; // set error object property
      return next(error);
    });
};
