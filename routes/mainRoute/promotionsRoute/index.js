const routes = require("express").Router();
const PromoController = require("../../../controllers/promotion.controller");
const storage = require("../../../lib/multerConfig");

routes.post("/add/:id",storage.single("image"), PromoController.add);
routes.get("/getAll", PromoController.getAll);
routes.get("/getOne/:id", PromoController.getOne);
routes.put("/update/:id",storage.single("image"), PromoController.update);
routes.delete("/delete/:id", PromoController.delete);

module.exports = routes;