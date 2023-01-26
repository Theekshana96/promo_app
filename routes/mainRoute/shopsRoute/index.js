const routes = require("express").Router();
const ShopController = require("../../../controllers/shop.controller");
const storage = require("../../../lib/multerConfig");

routes.post("/create",storage.single("image"), ShopController.create);

module.exports = routes;