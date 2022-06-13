const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { User } = require("../models/user");

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const updateAvatar = async (req, res, next) => {
  const { path: tmpUpload, originalname } = req.file;
  const { _id: id } = req.user;
  try {
    const image = await Jimp.read(tmpUpload);
    image.resize(250, 250);
    image.write(tmpUpload);
    const newFileName = `${id}_${originalname}`;
    const fileUpload = path.join(avatarDir, newFileName);
    await fs.rename(tmpUpload, fileUpload);
    const avatarURL = path.join("public", "avatars", newFileName);
    await User.findByIdAndUpdate(id, { avatarURL }, { new: true });
    res.status(200).json({
      status: "Success",
      code: 200,
      avatarURL,
    });
  } catch (error) {
    await fs.unlink(tmpUpload);
    next(error.message);
  }
};

module.exports = {
  updateAvatar,
};
