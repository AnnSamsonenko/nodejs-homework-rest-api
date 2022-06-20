const authService = require("../services/auth.service");
const { BadRequest } = require("http-errors");
const registerUser = async (req, res, next) => {
  try {
    const { user } = await authService.registerUser(req.body);
    res.status(201).json({
      status: "Created",
      code: 201,
      user: { email: user.email, id: user._id, avatarURL: user.avatarURL },
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

const checkVerifiedUser = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const result = await authService.checkVerification(verificationToken);
    res.status(200).json({
      status: "Success",
      code: 200,
      message: result,
    });
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequest("missing required field email");
    }
    await authService.verify(email);
    res.status(200).json({ status: "Success", code: 200, message: "Verification email was sent" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  checkVerifiedUser,
  verifyUser,
};
