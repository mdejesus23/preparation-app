const Theme = require("../models/themes");

const fileHelper = require("../util/file");

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
  const image = req.file;
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
      existingTheme.description = updatedDescription;
      // if user attached file image to change current image.
      if (image) {
        fileHelper.deleteFile(existingTheme.imageUrl);
        existingTheme.imageUrl = image.path;
      }
      return existingTheme.save().then((result) => {
        console.log("UPDATED THEME!");
        res.redirect("/admin/themes");
      });
    })
    .catch((err) => {
      const error = new Error(err); // create an error object.
      error.httpStatusCode = 500; // set error object property
      return next(error);
    });
};

exports.deleteTheme = async (req, res, next) => {
  const themeId = req.params.themeId;
  try {
    const theme = await Theme.findById(themeId);
    if (!theme) {
      return next(new Error("Product not found!"));
    }
    // fileHelper is a function use to delete image file using file system
    fileHelper.deleteFile(theme.imageUrl);
    await Theme.deleteOne({ _id: themeId, userId: req.user._id });
    console.log("Theme Deleted!");
    res.status(200).json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ message: "Deleting product failed!" });
  }
};

exports.getAddReading = (req, res, next) => {
  const themeId = req.params.themeId;

  Theme.findById(themeId)
    .then((theme) => {
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

      res.render("admin/add-readings", {
        theme: theme,
        readings: readings,
        path: "/readings",
        pageTitle: "Readings List",
        votedReadings: req.user.votedReadingIds,
      });
    })
    .catch((err) => {
      const error = new Error(err); // create an error object.
      error.httpStatusCode = 500; // set error object property
      return next(error);
    });
};

exports.postAddReading = (req, res, next) => {
  const word = req.body.reading;
  const category = req.body.category;
  let initialVote = 0;
  const themeId = req.params.themeId;

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
      res.redirect(`/admin/add-readings/${themeId}`);
    })
    .catch((err) => {
      const error = new Error(err); // create an error object.
      error.httpStatusCode = 500; // set error object property
      return next(error);
    });
};

exports.deleteReading = (req, res, next) => {
  const themeId = req.params.themeId;
  const readingId = req.header("X-Request-ID");

  Theme.findById(themeId)
    .then((theme) => {
      // need to assign to a new variable to get the return result thru filter method.
      const updatedReadings = theme.readings.filter((reading) => {
        return reading._id.toString() !== readingId.toString();
      });

      console.log(updatedReadings);

      theme.readings = updatedReadings;
      return theme.save();
    })
    .then(() => {
      res.status(200).json({ message: "Success deleting reading" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Deleting reading failed!" });
    });
};
