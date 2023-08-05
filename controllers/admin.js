exports.getAddReading = (req, res, next) => {
  res.render("admin/add-reading", {
    pageTitle: "Add Reading",
    path: "/admin/add-reading",
  });
};
