// middleware to protect routes
module.exports = (req, res, next) => {
  const themeId = req.params.themeId;
  const cookieThemeId = req.cookies.themeId;
  console.log("theme access is executed");
  if (!cookieThemeId) {
    return res.redirect("/themes");
  }

  if (themeId !== cookieThemeId) {
    console.log("not equal");
    return res.redirect("/themes");
  }
  next();
};
