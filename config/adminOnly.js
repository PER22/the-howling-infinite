module.exports = function (req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(404).json({error: "You must be an administrator to perform this action."});
  }
  else {
    next();
  }
};