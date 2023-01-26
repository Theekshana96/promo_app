const routes = require('express').Router();
const userRoutes = require("./mainRoute/userRoute/index");
const adminRoutes = require("./mainRoute/adminRoute/index");

routes.use("/user", userRoutes);
routes.use("/admin", adminRoutes);

module.exports = routes;