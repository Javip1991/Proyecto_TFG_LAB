// src/labs/xss/router.js
const express = require("express");
const router = express.Router();
const controller = require("./controller");

// Mostrar formulario XSS
router.get("/", controller.showForm);

// Procesar input XSS
router.post("/submit", controller.submitForm);

// Cambiar modo (vulnerable / seguro)
router.get("/switch-mode", controller.switchMode);

// Mostrar código vulnerable
router.get("/code", controller.showCode);

module.exports = router;