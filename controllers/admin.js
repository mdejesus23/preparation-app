const Theme = require("../models/themes");

const fileHelper = require("../util/file");

const { validationResult } = require("express-validator");
const sharp = require("sharp");

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const dotenv = require("dotenv");
dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const ITEMS_PER_PAGE = 5;

exports.getAddTheme = (req, res, next) => {
  res.render("admin/edit-theme", {
    pageTitle: "Add Themes",
    path: "/admin/add-themes",
    editing: false,
    hasError: false,
    errorMessage: null,
    username: req.user.username,
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
  const passcode = req.body.passcode;
  const readings = [];

  // validate if image is not the required image type.
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
      username: req.user.username,
    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-theme", {
      pageTitle: "Add Themes",
      path: "/admin/add-themes",
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      username: req.user.username,
      theme: {
        title: title,
        description: description,
        readings: readings,
        passcode: passcode,
      },
      validationErrors: errors.array(),
    });
  }

  // resize image
  const buffer = await sharp(image.buffer).resize(300, 250).toBuffer();

  // image name
  const imageName =
    new Date().toISOString().replace(/:/g, "-") + image.originalname;

  const uploadParams = {
    Bucket: bucketName, // s3 bucket name
    Key: imageName, // image file name
    Body: buffer, // image buffer data
    ContentType: image.mimetype,
  };

  try {
    // Send the upload to S3
    await s3Client.send(new PutObjectCommand(uploadParams));

    const theme = new Theme({
      title: title,
      imageName: imageName,
      description: description,
      passcode: passcode,
      readings: readings,
      userId: req.session.user,
    });

    await theme.save();
    res.redirect("/admin/themes");
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
};

exports.getEditTheme = async (req, res, next) => {
  const editMode = req.query.edit;
  const themeId = req.params.themeId;

  if (!editMode) {
    return res.redirect("/");
  }

  try {
    const theme = await Theme.findById(themeId);
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
      username: req.user.username,
    });
  } catch (er) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
};

exports.getThemes = async (req, res, next) => {
  const page = +req.query.page || 1; // if there is no query parameter the default value will be 1.
  let totalItems;

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
    const numThemes = await Theme.find({
      userId: req.user._id,
    }).countDocuments();
    totalItems = numThemes; // total number of documents fetched in the database.

    const themes = await Theme.find({ userId: req.user._id })
      .skip((page - 1) * ITEMS_PER_PAGE) // Skip the previous pages with the items per page.
      .limit(ITEMS_PER_PAGE); // Limit

    // For each theme, generate a signed URL and save it to the theme object
    for (let theme of themes) {
      const imageUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: bucketName,
          Key: theme.imageName,
        }),
        { expiresIn: 3600 } // 1 hour
      );

      theme.imageUrl = imageUrl;
      await theme.save();
    }

    res.render("admin/themes", {
      themes: themes,
      pageTitle: "Admin Themes",
      path: "/admin/themes",
      errorMessage: errMessage,
      successMessage: successMessage,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems, // true if the number of docs fetch is greater than ITEMS_PER_PAGE * page.
      hasPreviousPage: page > 1, // true if current page is greater than 1
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE), //  Math.ceil() increases the integer part of the number by 1 to round it up to the next higher integer.
      username: req.user.username,
    });
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
};

exports.postEditThemes = async (req, res, next) => {
  const themeId = req.body.themeId;
  const updatedTitle = req.body.title;
  const image = req.file;
  const updatedDescription = req.body.description;
  const updatedPasscode = req.body.passcode;

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
        passcode: updatedPasscode,
      },
      validationErrors: errors.array(),
      username: req.user.username,
    });
  }

  try {
    const existingTheme = await Theme.findById(themeId);

    if (existingTheme.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/");
    }

    existingTheme.title = updatedTitle;
    existingTheme.description = updatedDescription;
    existingTheme.passcode = updatedPasscode;

    // if user attached file image to change current image.
    if (image) {
      // delete old image on s3
      const deleteParams = {
        Bucket: bucketName,
        Key: existingTheme.imageName,
      };
      await s3Client.send(new DeleteObjectCommand(deleteParams));

      // then upload updated image on s3.
      // resize image
      const buffer = await sharp(image.buffer).resize(300, 250).toBuffer();

      // image name
      const imageName =
        new Date().toISOString().replace(/:/g, "-") + image.originalname;

      const uploadParams = {
        Bucket: bucketName, // s3 bucket name
        Key: imageName, // image file name
        Body: buffer, // image buffer data
        ContentType: image.mimetype,
      };
      // Send the updated image to S3
      await s3Client.send(new PutObjectCommand(uploadParams));

      existingTheme.imageName = imageName;
    }
    await existingTheme.save();
    res.redirect("/admin/themes");
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
};

exports.deleteTheme = async (req, res, next) => {
  const themeId = req.params.themeId;
  try {
    const theme = await Theme.findById(themeId);
    if (!theme) {
      return next(new Error("Theme not found!"));
    }

    // set params to delete image in s3
    const deleteParams = {
      Bucket: bucketName,
      Key: theme.imageName,
    };
    //
    await s3Client.send(new DeleteObjectCommand(deleteParams));

    await Theme.deleteOne({ _id: themeId, userId: req.user._id });
    res.status(200).json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ message: "Deleting product failed!" });
  }
};

exports.getAddReading = async (req, res, next) => {
  const themeId = req.params.themeId;

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

    res.render("admin/add-readings", {
      theme: theme,
      readings: readings,
      path: "/readings",
      pageTitle: "Readings List",
      votedReadings: req.user.votedReadingIds,
      username: req.user.username,
      errorMessage: errMessage,
      successMessage: successMessage,
    });
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
};

exports.postAddReading = async (req, res, next) => {
  const word = req.body.reading;
  const category = req.body.category;
  let initialVote = 0;
  const themeId = req.params.themeId;

  if (!word) {
    req.flash("error", "Reading is not valid!");
    return res.redirect("/admin/add-readings/" + themeId);
  }

  if (!category) {
    req.flash("error", "Category is not valid!");
    return res.redirect("/admin/add-readings/" + themeId);
  }

  try {
    const theme = await Theme.findById(themeId);

    theme.readings.push({
      reading: word,
      category: category,
      voteCount: initialVote,
    });
    await theme.save();

    req.flash("success", "Reading added successfully!");
    res.redirect(`/admin/add-readings/${themeId}`);
  } catch (err) {
    const error = new Error(err); // create an error object.
    error.httpStatusCode = 500; // set error object property
    return next(error);
  }
};

exports.deleteReading = async (req, res, next) => {
  const themeId = req.params.themeId;
  const readingId = req.header("X-Request-ID");

  try {
    const theme = await Theme.findById(themeId);

    // need to assign to a new variable to get the return result thru filter method.
    const updatedReadings = theme.readings.filter((reading) => {
      return reading._id.toString() !== readingId.toString();
    });

    theme.readings = updatedReadings;
    await theme.save();
    res.status(200).json({ message: "Success deleting reading" });
  } catch (err) {
    res.status(500).json({ message: "Deleting reading failed!" });
  }
};

exports.postThemeResetVotes = async (req, res, next) => {
  const themeId = req.params.themeId;

  try {
    const theme = await Theme.findById(themeId);
    if (!theme) {
      return next(new Error("Theme not found!"));
    }

    const updatedReadings = theme.readings.map((reading) => {
      return {
        ...reading,
        voteCount: 0,
      };
    });

    theme.readings = updatedReadings;
    await theme.save();

    res.status(200).json({
      message: "votes reset successfully",
      theme: theme,
    });
  } catch (err) {
    res.status(500).json({ message: "votes reset failed" });
  }
};
