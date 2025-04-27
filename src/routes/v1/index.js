const express = require("express");
const authRouter = require("./auth.routes");

const v1Router = express.Router();

v1Router.use("/auth", authRouter);

module.exports = v1Router;