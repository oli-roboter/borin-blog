const protect = (req, res, next) => {
  console.log('req session', req.session);
  const { user } = req.session;
  console.log('User from session', user);

  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized",
    });
  }

  req.user = user;
  next();
};

module.exports = protect