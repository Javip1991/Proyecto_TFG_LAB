const express = require("express");
const router = express.Router();
const controller = require("./controller");
const bcrypt = require("bcrypt");

router.get("/", controller.indexPage);
router.get("/switch-mode", controller.switchMode);
router.get("/login/:id", controller.fakeLogin);
router.get("/profile", controller.profilePage);
router.get("/code", controller.showCode);

module.exports = router;
