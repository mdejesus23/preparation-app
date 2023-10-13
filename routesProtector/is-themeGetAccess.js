// middleware to protect routes
module.exports = (req, res, next) => {
  if (!req.themeAccess) {
    return res.redirect("/themes");
  }
  next();
};
