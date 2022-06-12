const { authenticateUser } = require("../services/auth.service");
const { Unauthorized, Forbidden } = require("http-errors");

const auth = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer" || !token) {
    next(new Unauthorized("Not authorized"));
  }

  const user = await authenticateUser(token);
  if (!user) {
    next(new Unauthorized("Not authorized"));
  }
  req.user = user;
  next();
};

const subAuth = subscription => {
  return (req, res, next) => {
    if (req.user.subscription !== subscription) {
      next(new Forbidden("Forbidden"));
    }
    next();
  };
};

module.exports = {
  auth,
  subAuth,
};
