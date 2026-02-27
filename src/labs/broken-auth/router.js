// src/labs/broken-auth/router.js
const express = require("express");
const router = express.Router();
const controller = require("./controller");

// Formulario de login
router.get("/", controller.loginPage);

// Procesar login
router.post("/auth", controller.loginSubmit);

// Mostrar código vulnerable
router.get("/code", controller.showCode);

// Cambiar modo
router.get("/switch-mode", controller.switchMode);

module.exports = router;