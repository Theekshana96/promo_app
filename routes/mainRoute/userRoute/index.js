const routes = require("express").Router();
const UserController = require("../../../controllers/user.controller");
const storage = require("../../../lib/multerConfig");

routes.post("/register", UserController.register);
routes.post("/login", UserController.login);
routes.get("/getUsers", UserController.getUsers);
routes.get("/getUser/:id", UserController.getUser);
routes.put("/updateUser/:id",storage.single("image"), UserController.updateUser);

module.exports = routes;