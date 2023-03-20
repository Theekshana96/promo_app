const routes = require("express").Router();
const CategoryController = require("../../../controllers/category.controller");
const storage = require("../../../lib/multerConfig");

routes.post("/create",storage.single("image"), CategoryController.create);
routes.get("/all", CategoryController.getAll);
routes.get("/getOne/:id", CategoryController.getOne);
routes.put("/update/:id",storage.single("image"), CategoryController.update);
routes.delete("/delete/:id", CategoryController.delete);

module.exports = routes;