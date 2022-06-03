const { BadRequest } = require("http-errors");

const validateRequest = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(new BadRequest(error.message));
    }
    next();
  };
};

module.exports = {
  validateRequest,
};
