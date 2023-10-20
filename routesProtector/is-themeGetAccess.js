// middleware to protect routes
module.exports = (req, res, next) => {
  const themeId = req.params.themeId;
  const cookieThemeId = req.cookies.themeId;
  if (!cookieThemeId) {
    return res.redirect("/themes");
  }

  if (themeId !== cookieThemeId) {
    return res.redirect("/themes");
  }
  next();
};
