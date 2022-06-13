const { User } = require("../models/user");
const { Conflict, Unauthorized } = require("http-errors");
require("dotenv").config();
const { SECRET_KEY } = process.env;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

const registerUser = async userData => {
  const result = await User.findOne({ email: userData.email });
  if (result) {
    throw new Conflict("Email in use");
  }
  const password = userData.password;
  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(userData.email);
  const user = await User.create({
    ...userData,
    avatarURL,
    password: hashedPassword,
  });
  return { user };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthorized("Login or password is wrong");
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Unauthorized("Login or password is wrong");
  }
  const payload = {
    id: user._id,
    email: user.email,
    subscription: user.subscription,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  await User.findByIdAndUpdate(user._id, { token });
  return {
    token,
    payload,
  };
};

const logoutUser = async id => {
  await User.findByIdAndUpdate(id, { token: null });
};

const authenticateUser = async token => {
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    const { id } = payload;
    const user = await User.findById(id);

    return user.token !== token ? null : user;
  } catch (e) {
    return null;
  }
};

module.exports = {
  registerUser,
  loginUser,
  authenticateUser,
  logoutUser,
};
