const { User } = require("../models/user");
const { Conflict, Unauthorized, NotFound, BadRequest } = require("http-errors");
require("dotenv").config();
const { SECRET_KEY, SG_VERIFY_KEY, EMAIL_SENDER, SITE_URL, PORT } = process.env;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const sgMail = require("@sendgrid/mail");
const { v4: uuidv4 } = require("uuid");
sgMail.setApiKey(SG_VERIFY_KEY);

const registerUser = async userData => {
  const result = await User.findOne({ email: userData.email });
  if (result) {
    throw new Conflict("Email in use");
  }
  const password = userData.password;
  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(userData.email);
  const verificationToken = uuidv4();

  const user = await User.create({
    ...userData,
    avatarURL,
    verificationToken,
    password: hashedPassword,
  });

  const data = {
    to: userData.email,
    subject: "Email veryfication",
    html: `<a target ="_blank" href="${SITE_URL}:${PORT}/users/verify/${verificationToken}">Confirm your email</a>`,
  };

  await sendEmail(data);

  return { user };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthorized("Login or password is wrong");
  }

  if (!user.verify) {
    throw new Unauthorized("Email veryfication was not passed");
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

const checkVerification = async verificationToken => {
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw new NotFound();
  }
  const isVerified = await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });
  return isVerified ? "User is succesfully verified" : "Verification was not passed, try again";
};

const verify = async email => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFound("User not found");
  }
  if (user.verify) {
    throw new BadRequest("Verification has already been passed");
  }

  const { verificationToken } = user;

  const data = {
    to: email,
    subject: "Email veryfication",
    html: `<a target ="_blank" href="${SITE_URL}:${PORT}/users/verify/${verificationToken}">Confirm your email</a>`,
  };

  await sendEmail(data);
};

const sendEmail = async data => {
  // eslint-disable-next-line no-useless-catch
  try {
    const email = { ...data, from: EMAIL_SENDER };
    await sgMail.send(email);
    return "User is succesfully verified";
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser,
  authenticateUser,
  logoutUser,
  checkVerification,
  sendEmail,
  verify,
};
