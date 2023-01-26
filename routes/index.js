const routes = require("express").Router();
const userRoutes = require("./mainRoute/userRoute/index");
const adminRoutes = require("./mainRoute/adminRoute/index");
const shopsRoutes = require("./mainRoute/shopsRoute/index");
const promotionsRoutes = require("./mainRoute/promotionsRoute/index");

routes.use("/user", userRoutes);
routes.use("/admin", adminRoutes);
routes.use("/shop", shopsRoutes);
routes.use("/promotions", promotionsRoutes);

module.exports = routes;
