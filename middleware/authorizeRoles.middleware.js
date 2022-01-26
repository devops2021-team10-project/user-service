const { handleError } = require("../utils/error");


const checkCondition = async ({ req, roles }) => {
  if (!req.isServiceCall && req.user && !roles.includes(req.user.role)) {
    throw "You do not have permission to access to this resource. - authRoles.";
  }
};

const authorizeRoles = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return [
    async (req, res, next) => {
      try {
        await checkCondition({ req, roles });
        next();
      } catch (err) {
        return handleError(err, res);
      }
    }
  ];
}

module.exports = Object.freeze({
  checkCondition,
  authorizeRoles
});