const authorize = (roles = []) => {
  if (typeof roles === 'string') {
      roles = [roles];
  }
  return [
      (req, res, next) => {
          if (roles.length && !roles.includes(req.user.role)) {
              return res.send(400).json({ msg: "You do not have permission to access to this resource." });
          }
          next();
      }
  ];
}

module.exports = authorize;