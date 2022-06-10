const authService = require("../services/auth.service");

const registerUser = async (req, res, next) => {
  try {
    const { user } = await authService.registerUser(req.body);
    res.status(201).json({
      status: "Created",
      code: 201,
      user: { email: user.email, id: user._id },
    });
  } catch (e) {
    next(e);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { token, payload: user } = await authService.loginUser(req.body);
    res.status(200).json({ status: "success", code: 200, token, user });
  } catch (e) {
    next(e);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user._id);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

const currentUser = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    user: {
      email,
      subscription,
    },
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
};
