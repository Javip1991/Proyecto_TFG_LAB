const express = require("express");
const router = express.Router();
const controller = require("./controller");


// Mostrar formulario de login vulnerable
router.get("/", controller.loginPage);

// Procesar login vulnerable
router.post("/login", controller.loginSubmit);

// Mostrar código vulnerable
router.get("/code", controller.showCode);

// Cambiar modo de login
router.get("/switch-mode", controller.switchMode);

//CRUD

router.get("/users", controller.usersPage);
router.post("/users/create", controller.createUser);
router.post("/users/update/:id", controller.updateUser);
router.post("/users/delete/:id", controller.deleteUser);

module.exports = router;