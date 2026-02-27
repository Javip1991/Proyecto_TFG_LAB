const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.get("/", controller.indexPage);
router.get("/switch-mode", controller.switchMode);
router.post("/login", controller.login);
router.get("/admin", controller.admin);
router.get("/code", controller.showCode);

module.exports = router;
