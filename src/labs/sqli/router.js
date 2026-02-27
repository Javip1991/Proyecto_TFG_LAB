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

module.exports = router;