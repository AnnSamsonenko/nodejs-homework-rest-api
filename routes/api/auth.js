const express = require("express");
const { registerUser, loginUser, logoutUser, currentUser } = require("../../controllers/auth");
const router = express.Router();
const { schemaRegister, schemaLogin } = require("../../models/user");
const { validateRequest } = require("../../middlewares/validateRequest");
const { auth, upload } = require("../../middlewares");
const { updateAvatar } = require("../../controllers/user");

router.post("/signup", validateRequest(schemaRegister), registerUser);
router.post("/login", validateRequest(schemaLogin), loginUser);
router.post("/logout", auth, logoutUser);
router.get("/current", auth, currentUser);
router.patch("/avatars", auth, upload.single("avatar"), updateAvatar);
module.exports = router;
