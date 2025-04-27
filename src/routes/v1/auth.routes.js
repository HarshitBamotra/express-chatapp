const express = require("express");
const { register, login, updateProfile } = require("../../controllers/auth.controller");
const upload = require("../../utils/cloudinary");
const authenticate = require("../../utils/authenticate");

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.put("/me", authenticate, upload.single("profilePhoto"), updateProfile);

module.exports = authRouter;