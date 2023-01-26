const routes = require("express").Router();
const ShopController = require("../../../controllers/shop.controller");
const storage = require("../../../lib/multerConfig");

routes.post("/create",storage.single("image"), ShopController.create);
routes.get("/all", ShopController.getAll);
routes.get("/getOne/:id", ShopController.getOne);
routes.put("/update/:id",storage.single("image"), ShopController.update);
routes.delete("/delete/:id", ShopController.delete);

module.exports = routes;